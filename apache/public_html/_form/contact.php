<?php
/**
 * /api/contact op de DirectAdmin-server: de PHP-tegenhanger van
 * api/contact.js (Vercel). Verwerkt het offerte-/contactformulier op /contact.
 *
 * De root-.htaccess stuurt /api/contact hierheen. Zelfde contract als op
 * Vercel, zodat js/contact-form.js op beide hostings werkt:
 *  - POST multipart met de velden name, bedrijf, email, telefoon,
 *    aanvraag_type, materiaal_bewerking, aantal_planning, message, page_url,
 *    honeypot botcheck en bijlagen in tekeningen[];
 *  - antwoord JSON { success, message }.
 * Erbij gekomen t.o.v. Vercel: controle op herkomst, Cloudflare Turnstile, een
 * limiet per verbinding, opslag in MariaDB, grotere bijlagen (via een
 * upload-sessie van Microsoft Graph) en verzending via Graph i.p.v. SMTP.
 *
 * GET /api/contact geeft { captcha, beschikbaar, maxBestandMB, maxTotaalMB,
 * maxBestanden }. Het formulierscript laadt daarmee Turnstile alleen als die
 * hier is ingesteld, en toont de juiste bestandslimieten. (Op Vercel geeft
 * GET een 405 en houdt het script de oude limiet van 4 MB aan.)
 *
 * Instellingen en geheimen: private/config.php, buiten public_html.
 */

declare(strict_types=1);

namespace Audacious\Form;

require __DIR__ . '/lib/Http.php';
require __DIR__ . '/lib/Turnstile.php';
require __DIR__ . '/lib/GraphMailer.php';
require __DIR__ . '/lib/Store.php';

/** Bestandstypen (gelijk aan api/contact.js en het accept-attribuut). */
const TOEGESTAAN = ['.pdf', '.step', '.stp', '.dxf', '.dwg', '.zip', '.jpg', '.jpeg', '.png'];
const MAX_BYTES = 10 * 1024 * 1024;
const MAX_BESTANDEN = 6;
const MAX_TOTAAL_BYTES = 20 * 1024 * 1024;
/** Ruim boven wat een mens typt; houdt de mail en de database binnen de perken. */
const MAX_TEKENS = 20000;

/** Volgorde en labels gelijk aan buildMessage() in api/contact.js. */
const LABELS = [
    'name' => 'Naam',
    'bedrijf' => 'Bedrijf',
    'email' => 'E-mail',
    'telefoon' => 'Telefoon',
    'aanvraag_type' => 'Onderwerp',
    'materiaal_bewerking' => 'Materiaal / bewerking',
    'aantal_planning' => 'Aantal / planning',
    'message' => 'Bericht',
    'page_url' => 'Pagina',
];

/** @return array<string, mixed> */
function loadConfig(): array
{
    $path = (string) ($_SERVER['REDIRECT_AUDACIOUS_FORM_CONFIG'] ?? $_SERVER['AUDACIOUS_FORM_CONFIG'] ?? getenv('AUDACIOUS_FORM_CONFIG') ?: '');
    if ($path === '') {
        // public_html/_form/contact.php -> ../../private/config.php
        $path = dirname(__DIR__, 2) . '/private/config.php';
    }
    if (!is_file($path)) {
        error_log('[contact] geen configuratie op ' . $path . '; het formulier kan niet versturen.');
        return [];
    }
    $config = require $path;
    return is_array($config) ? $config : [];
}

function esc(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function antwoord(int $status, bool $success, string $message): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode(['success' => $success, 'message' => $message], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$settings = json_decode((string) @file_get_contents(__DIR__ . '/settings.json'), true);
if (!is_array($settings)) {
    error_log('[contact] settings.json ontbreekt; bouw opnieuw met npm run build:apache.');
    $settings = [];
}
$contactEmail = (string) ($settings['contactEmail'] ?? 'info@audacious.com');
$contactTel = (string) ($settings['contactTel'] ?? '');
$siteUrl = (string) ($settings['siteUrl'] ?? 'https://www.audacious.com');
$belOns = $contactTel !== '' ? " of bel {$contactTel}" : '';
$nietVerstuurd = "Het verzenden lukte niet aan onze kant. Mail uw aanvraag naar {$contactEmail}{$belOns}";

$config = loadConfig();
$mailer = GraphMailer::fromConfig($config);
$turnstile = Turnstile::fromConfig($config);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET' || $method === 'HEAD') {
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex');
    echo json_encode([
        'captcha' => $turnstile?->siteKey,
        'beschikbaar' => $mailer !== null,
        'maxBestandMB' => MAX_BYTES / 1024 / 1024,
        'maxTotaalMB' => MAX_TOTAAL_BYTES / 1024 / 1024,
        'maxBestanden' => MAX_BESTANDEN,
    ]);
    exit;
}
if ($method !== 'POST') {
    header('Allow: GET, HEAD, POST');
    antwoord(405, false, 'Alleen POST is toegestaan.');
}

/*
 * Een POST moet van deze site komen, anders kan een andere site het formulier
 * namens een bezoeker versturen. Browsers sturen Origin altijd mee bij fetch().
 */
$https = ($_SERVER['HTTPS'] ?? '') === 'on' || ($_SERVER['REQUEST_SCHEME'] ?? '') === 'https'
    || strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https';
$expectedOrigin = ($https ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? '');
if (($_SERVER['HTTP_ORIGIN'] ?? '') !== $expectedOrigin) {
    antwoord(403, false, 'Verzenden vanaf een andere website is niet toegestaan.');
}

/*
 * Een body boven PHP's post_max_size komt leeg aan. Dat kan alleen door (te)
 * grote bijlagen; zeg dat, in plaats van "naam is verplicht".
 */
if ($_POST === [] && $_FILES === [] && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    antwoord(413, false, 'De bestanden zijn samen groter dan 20 MB. Stuur de rest los naar ' . $contactEmail . '.');
}

$veld = static fn (string $k): string => is_string($_POST[$k] ?? null) ? trim($_POST[$k]) : '';

// ── Spamfilter ──────────────────────────────────────────────────────────────
// Honeypot (verborgen checkbox "botcheck"): ingevuld = bot; stil "gelukt",
// zoals api/contact.js.
if ($veld('botcheck') !== '') {
    antwoord(200, true, 'Aanvraag verzonden.');
}

// ── Validatie (zelfde verplichte velden als api/contact.js) ─────────────────
$waarden = [];
foreach (array_keys(LABELS) as $key) {
    $v = $veld($key);
    if (mb_strlen($v) > MAX_TEKENS) {
        antwoord(422, false, 'Een van de velden is te lang. Mail uw aanvraag naar ' . $contactEmail . '.');
    }
    $waarden[$key] = $v;
}
if ($waarden['name'] === '' || $waarden['email'] === '' || $waarden['message'] === '') {
    antwoord(400, false, 'Naam, e-mail en bericht zijn verplicht.');
}
if (preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u', $waarden['email']) !== 1) {
    antwoord(422, false, 'Vul een geldig e-mailadres in.');
}

// ── Limiet per verbinding en Turnstile ──────────────────────────────────────
$store = Store::fromConfig($config);
$ipHeader = (string) ($config['client_ip_header'] ?? '');
$clientIp = trim(explode(',', (string) (($ipHeader !== '' ? ($_SERVER[$ipHeader] ?? null) : null) ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown'))[0]);
if (!$store->allow($clientIp)) {
    antwoord(429, false, "U heeft kort na elkaar veel berichten verstuurd. Probeer het over tien minuten opnieuw{$belOns}");
}
if ($turnstile !== null) {
    $verdict = $turnstile->verify($veld(Turnstile::FIELD), $clientIp !== 'unknown' ? $clientIp : null);
    if ($verdict === 'unreachable') {
        antwoord(503, false, "De beveiligingscontrole is tijdelijk niet bereikbaar. Mail uw aanvraag naar {$contactEmail}{$belOns}");
    }
    if ($verdict !== 'ok') {
        antwoord(422, false, "De beveiligingscontrole is niet gelukt. Probeer het opnieuw, of mail uw aanvraag naar {$contactEmail}");
    }
}

// ── Bijlagen ────────────────────────────────────────────────────────────────
$bijlagen = [];
// tekeningen[] (nieuw, meerdere bestanden); "attachment" alleen als vangnet
// voor een oude, nog geladen versie van het formulierscript.
$f = $_FILES['tekeningen'] ?? $_FILES['attachment'] ?? null;
if (is_array($f) && isset($f['name'])) {
    // tekeningen[] komt als parallelle lijsten binnen; één bestand als losse waarden.
    $lijst = static fn ($x) => is_array($x) ? array_values($x) : [$x];
    $namen = $lijst($f['name']);
    $tmp = $lijst($f['tmp_name']);
    $fouten = $lijst($f['error']);
    $groottes = $lijst($f['size']);
    $bestanden = [];
    foreach ($namen as $i => $origineel) {
        if ((int) $fouten[$i] === UPLOAD_ERR_NO_FILE || ((int) $groottes[$i] === 0 && (int) $fouten[$i] === UPLOAD_ERR_OK)) {
            continue;
        }
        $bestanden[] = ['name' => (string) $origineel, 'tmp' => (string) $tmp[$i], 'error' => (int) $fouten[$i], 'size' => (int) $groottes[$i]];
    }
    if (count($bestanden) > MAX_BESTANDEN) {
        antwoord(422, false, 'Maximaal ' . MAX_BESTANDEN . ' bestanden per aanvraag.');
    }
    $totaal = 0;
    foreach ($bestanden as $b) {
        // Alleen het laatste stuk van de naam, zonder stuurtekens.
        $naamBestand = mb_substr((string) preg_replace('/[\x00-\x1F\x7F\/\\\\]+/u', '_', basename($b['name'])), -150);
        $punt = strrpos($naamBestand, '.');
        $ext = $punt === false ? '' : strtolower(substr($naamBestand, $punt));
        if (!in_array($ext, TOEGESTAAN, true)) {
            antwoord(422, false, 'Bestandstype ' . ($ext !== '' ? $ext : $naamBestand) . ' wordt niet ondersteund. Gebruik PDF, STEP/STP, DXF/DWG, ZIP of een afbeelding.');
        }
        if ($b['error'] === UPLOAD_ERR_INI_SIZE || $b['error'] === UPLOAD_ERR_FORM_SIZE || $b['size'] > MAX_BYTES) {
            antwoord(422, false, "{$naamBestand} is groter dan 10 MB. Stuur dit bestand los naar {$contactEmail}.");
        }
        if ($b['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($b['tmp'])) {
            error_log('[contact] upload mislukt met PHP-foutcode ' . $b['error']);
            antwoord(500, false, $nietVerstuurd);
        }
        $totaal += $b['size'];
        if ($totaal > MAX_TOTAAL_BYTES) {
            antwoord(422, false, 'De bestanden zijn samen groter dan 20 MB. Stuur de rest los naar ' . $contactEmail . '.');
        }
        $bijlagen[] = [
            'filename' => $naamBestand,
            'size' => $b['size'],
            'type' => match ($ext) {
                '.pdf' => 'application/pdf',
                '.png' => 'image/png',
                '.jpg', '.jpeg' => 'image/jpeg',
                '.zip' => 'application/zip',
                default => 'application/octet-stream',
            },
            'path' => $b['tmp'],
        ];
    }
}

// ── Mail opbouwen (zelfde opmaak en onderwerp als api/contact.js) ───────────
$regels = [];
foreach (LABELS as $key => $label) {
    $regels[] = [$label, $waarden[$key] !== '' ? $waarden[$key] : '-'];
}
$regels[] = ['Bijlagen', $bijlagen !== [] ? implode(', ', array_column($bijlagen, 'filename')) : 'Geen bijlagen'];

$html = '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#111">'
    . '<h2>Nieuwe aanvraag via Audacious.com</h2>'
    . '<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:760px">'
    . implode('', array_map(
        static fn (array $r) => '<tr><td style="border:1px solid #ddd;background:#f7f7f7;font-weight:bold;width:190px;vertical-align:top">'
            . esc($r[0]) . '</td><td style="border:1px solid #ddd;white-space:pre-wrap">' . esc($r[1]) . '</td></tr>',
        $regels,
    ))
    . '</table>'
    . '<p style="font-size:12px;color:#777">Verstuurd via ' . esc($siteUrl) . '</p>'
    . '</div>';

// ── Opslaan en verzenden ────────────────────────────────────────────────────
$id = $store->save($waarden, $bijlagen);

if ($mailer === null) {
    // Niet stil falen: de bezoeker moet weten dat hij ons moet mailen of bellen.
    $store->markDelivery($id, false, 'mail niet geconfigureerd');
    error_log('[contact] mail niet geconfigureerd; aanvraag ' . ($id ?? '(niet opgeslagen)') . ' NIET verzonden.');
    antwoord(500, false, $nietVerstuurd);
}

$resultaat = $mailer->send([
    'subject' => 'Nieuwe aanvraag via Audacious.com' . ($waarden['aanvraag_type'] !== '' ? ' - ' . $waarden['aanvraag_type'] : ''),
    'html' => $html,
    'replyName' => $waarden['name'],
    'replyEmail' => $waarden['email'],
], $bijlagen);
$store->markDelivery($id, $resultaat['delivered'], $resultaat['detail']);

if (!$resultaat['delivered']) {
    error_log('[contact] verzenden mislukt: ' . $resultaat['detail']);
    antwoord(502, false, $nietVerstuurd);
}

antwoord(200, true, 'Aanvraag verzonden.');
