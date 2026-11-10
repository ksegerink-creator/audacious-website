# www.audacious.com op de DirectAdmin-server (Apache + PHP)

www.audacious.com verhuist van Vercel naar de eigen DirectAdmin-server
(62.84.247.85), op dezelfde manier als assinkschipholt.nl en baas-metaal.nl.
Het hoofdadres blijft **https://www.audacious.com/** (met www); het kale
`audacious.com` stuurt daarheen door.

| Onderdeel | Waar | Hoe |
|---|---|---|
| Website (32 pagina's), 42 redirects, 404 | DirectAdmin | `npm run build:apache` → statische HTML + gegenereerde `.htaccess` |
| Contactformulier (`/api/contact`) | DirectAdmin | PHP (`_form/contact.php`), Microsoft 365 via Graph, Turnstile, opslag in MariaDB |
| Teksten en foto's uit Sanity | Sanity (ongewijzigd) | De browser haalt ze rechtstreeks bij Sanity op; geen deploy nodig |
| Live zetten | GitHub Action `.github/workflows/deploy-apache.yml` | Bij elke push naar `main`: bouwen, via FTPS uploaden, controleren |
| Vercel-project `audacious-website` | Vercel (blijft bestaan) | Alleen nog als terugvaloptie; `X-Robots-Tag: noindex` op elke host behalve (www.)audacious.com |

De site is statische HTML/CSS/JS zonder framework-build. Teksten, URL's,
canonicals, schema (JSON-LD), sitemap, robots.txt en llms.txt zijn exact de
bestanden die nu op Vercel staan. Er is geen hreflang (de site is alleen
Nederlandstalig).

## 0. Wat er van Vercel afhing en hoe het is vervangen

| Op Vercel | Op Apache |
|---|---|
| `rewrites` in `vercel.json` (nette URL → `html/…` / `pages/…`) | `RewriteRule … [END]` in `.htaccess`, gegenereerd uit `vercel.json` |
| `redirects` in `vercel.json` (308) | 301 in `.htaccess`, met en zonder slash, query string behouden |
| `trailingSlash: false` (`/contact/` → `/contact`) | 301 naar de vorm zonder slash; `DirectorySlash Off` |
| `404.html` | `ErrorDocument 404 /404.html` |
| apex → www, https, HSTS (Vercel-domeininstellingen) | `.htaccess` (alleen voor het echte domein) + HSTS twee jaar |
| Serverless function `api/contact.js` (Node, SMTP/OAuth) | `_form/contact.php` (PHP, Microsoft Graph), zelfde velden en JSON-antwoord |
| Vercel serveerde óók broncode (`/app/…`, `/sanity.config.ts`, `/SANITY_EDITOR_GUIDE.md`) | Niet meer: alleen `html/ pages/ css/ js/ assets/` en de vaste rootbestanden gaan mee |

Bron van de URL-structuur blijft `vercel.json`. Een nieuwe redirect zet je
daar; de volgende deploy neemt hem mee in de `.htaccess`.

## 1. Bouwen

Alleen Node 22, geen `npm ci` nodig:

```
npm run build:apache
```

Resultaat in `dist-apache/`:

| Map / bestand | Waar het heen moet |
|---|---|
| `public_html/` | de **inhoud** naar `domains/audacious.com/public_html/`, inclusief verborgen bestanden |
| `private/` | naar `domains/audacious.com/private/` (**naast** public_html) |
| `LEESMIJ.md` | dit bestand |

Verborgen bestanden die mee moeten: `public_html/.htaccess`,
`public_html/_form/.htaccess` en `public_html/_form/.user.ini`.

## 2. Eerste keer handmatig op de server zetten

1. `npm run build:apache` en zip de map `dist-apache/`.
2. DirectAdmin (gebruiker van audacious.com) → Bestandsbeheer →
   `domains/audacious.com/`:
   - upload de zip en pak uit;
   - verplaats de inhoud van `dist-apache/public_html/` naar `public_html/`
     (verwijder eerst de standaard `index.html` van DirectAdmin);
   - verplaats `dist-apache/private/` naar `domains/audacious.com/private/`.
3. Maak `private/config.php` (zie §3) en zet de rechten op **`640`**, zoals
   bij baas-metaal.nl en assinkschipholt.nl op deze server (bij `600` is niet
   zeker dat PHP het bestand kan lezen).
4. Controleer in DirectAdmin dat PHP 8.1 of nieuwer actief is voor het
   domein (getest met 8.3), met de extensies `curl`, `mbstring` en
   `pdo_mysql`.
5. Daarna doet de GitHub Action het; zie §5.

## 3. `private/config.php`

Kopieer `private/config.example.php` naar `private/config.php`. Sleutels:

| Sleutel | Inhoud |
|---|---|
| `mail.to` | ontvanger(s), komma-gescheiden |
| `mail.from` | verzendende mailbox in Microsoft 365 (echte mailbox, geen distributielijst) |
| `mail.tenant_id` | tenant-ID van de Microsoft 365-omgeving van die mailbox |
| `mail.client_id` | app-registratie (client) ID |
| `mail.client_secret` | client secret van die app-registratie |
| `turnstile.site_key` | Cloudflare Turnstile site key (hostnames `www.audacious.com` en `audacious.com`) |
| `turnstile.secret_key` | Cloudflare Turnstile secret key |
| `database.dsn` | `mysql:host=localhost;dbname=<db-naam>;charset=utf8mb4` |
| `database.user` | databasegebruiker |
| `database.password` | wachtwoord van die gebruiker |
| `rate_limit_salt` | willekeurige tekst, minstens 32 tekens (`openssl rand -hex 32`) |
| `client_ip_header` | leeg laten (alleen nodig achter een proxy/CDN) |

**Rechten van de app-registratie (applicatierechten, met admin consent):**
`Mail.Send`, en `Mail.ReadWrite` voor bijlagen die samen groter zijn dan
±3 MB. Graph accepteert in één verzendaanvraag maximaal 4 MB; grotere
tekeningen gaan via een concept met upload-sessie, en dat vraagt
`Mail.ReadWrite`. Beperk de app bij voorkeur met een Application Access
Policy tot de verzendende mailbox.

Let op: de Vercel-versie gebruikt een app-registratie via `MICROSOFT_*`
(waarschijnlijk voor SMTP met OAuth). Die heeft niet vanzelf de
Graph-rechten hierboven. Advies: een aparte app-registratie voor de website
van Audacious, zoals bij Assink.

Zonder `config.php`, of met ontbrekende mailgegevens, meldt het formulier
eerlijk dat het niet kan versturen (met e-mailadres en telefoonnummer). Het
doet nooit alsof een bericht is aangekomen. Turnstile staat alleen aan als
beide sleutels zijn ingevuld; de site-sleutel komt via `GET /api/contact` in
de pagina, er is dus maar één plek om hem te wijzigen.

## 4. Formulier en database

Het formulier op `/contact` verstuurt naar `/api/contact`, net als op Vercel.
Wat er op de eigen server bij komt:

- **Bijlagen:** veld `tekeningen[]`, meerdere bestanden; maximaal 6 bestanden,
  10 MB per bestand, 20 MB totaal (op Vercel 4 MB totaal). Het script op de
  pagina vraagt de limieten op bij `GET /api/contact` en past de hint aan.
- **Turnstile:** het script van Cloudflare wordt pas geladen bij de eerste
  klik of focus in het formulier.
- **Herkomst:** een POST vanaf een andere website wordt geweigerd (403).
- **Limiet:** 10 berichten per 10 minuten per verbinding.
- **Opslag:** de tabellen `aanvragen` en `formulier_pogingen` worden bij het
  eerste bericht automatisch aangemaakt. `private/schema.sql` laat zien wat
  er wordt opgeslagen.

| Gegeven | Opgeslagen? |
|---|---|
| Naam, bedrijf, e-mail, telefoon, onderwerp, materiaal/bewerking, aantal/planning, bericht, pagina | ja |
| Bijlagen | alleen naam en grootte; de bestanden gaan alleen met de mail mee |
| Of Microsoft 365 de mail aannam, of de foutmelding | ja |
| IP-adres | nee; alleen een gezouten hash, tien minuten, voor de limiet |

Een aanvraag wordt opgeslagen vóórdat de mail vertrekt. Valt de mail uit, dan
staat de aanvraag er met `verzonden = 0`.

**Privacy:** als de privacyverklaring van Audacious alleen verwerking via de
mail noemt, laat die aanvullen voor de database (wat, waarom, hoe lang). Er
is nog geen automatische opschoning.

## 5. Automatisch live na een wijziging

1. FTP-account `deploy@audacious.com` (root = `public_html`).
   `private/config.php` staat daarbuiten en wordt nooit aangeraakt.
2. GitHub → repository → Settings → Secrets and variables → Actions:

   | Naam | Waarde |
   |---|---|
   | `FTP_SERVER` | `srv.baas-metaal.nl` — de naam op het certificaat van de FTP-dienst van deze server. Met het IP faalt de certificaatcontrole. |
   | `FTP_USERNAME` | `deploy@audacious.com` |
   | `FTP_PASSWORD` | uit de wachtwoordmanager |

3. Actions → *Deploy naar DirectAdmin* → *Run workflow* (of merge naar
   `main`). De eerste run uploadt alles (± 2 MB), daarna alleen wat
   veranderd is. Wat je zelf op de server zet, blijft staan; bestanden die uit
   de build verdwijnen, haalt de action weg.
4. Na de upload controleert de workflow de server met
   `scripts/check-apache.mjs` (verstuurt niets). Zolang de DNS van
   www.audacious.com nog naar Vercel wijst, gebeurt dat op het IP en maakt een
   fout de run niet rood.

Fouten bij de upload (zelfde server als baas-metaal.nl):

| Melding | Oplossing |
|---|---|
| `unable to verify the first certificate` | De workflow haalt de tussencertificaten zelf op (`scripts/fetch-cert-chain.sh`). |
| `read ECONNRESET (data socket)` | De uploadstap draait al met `--tls-max-v1.2`. Blijft het, FTP-log op de server bekijken. |
| iets met `hostname` / `self signed` | `FTP_SERVER` controleren (`srv.baas-metaal.nl`). Nooit terugvallen op gewone `ftp`. |
| `530 Login incorrect` | Secrets controleren. |

## 6. Vercel

1. Het project `audacious-website` blijft bestaan. Elke host behalve
   `www.audacious.com` en `audacious.com` krijgt `X-Robots-Tag: noindex,
   nofollow` (header in `vercel.json` met twee `missing`-voorwaarden op de
   host). Controle: `curl -sI https://audacious-website.vercel.app/ | grep -i
   x-robots` moet `noindex, nofollow` tonen.
2. Sanity Studio draait niet op Vercel en verandert niet.
3. **Pas ná de DNS-omzetting en een geslaagde controle**: Vercel → project →
   Settings → Domains → `www.audacious.com` en `audacious.com` verwijderen. Het
   project zelf **niet** verwijderen.

## 7. Testen vóór de DNS-omzetting (hosts-bestand)

Zet in het hosts-bestand (Windows: `C:\Windows\System32\drivers\etc\hosts`
als beheerder; Mac/Linux: `/etc/hosts`):

```
62.84.247.85 www.audacious.com audacious.com
```

Er is dan nog geen geldig certificaat; de browser waarschuwt, dat is
verwacht. Of zonder hosts-bestand:

```
node scripts/check-apache.mjs --ip 62.84.247.85 -k
```

Testlijst:

- [ ] `node scripts/check-apache.mjs --ip 62.84.247.85 -k` geeft 0 fouten
      (32 pagina's 200 met juiste canonical, 84 redirect-varianten 301,
      audacious.com → www, http → https, trailing slash, 404, headers,
      afgeschermde bestanden).
- [ ] Homepage, een dienstpagina, een projectpagina en een marktpagina zien er
      goed uit (foto's en teksten uit Sanity, menu).
- [ ] `/contact/` gaat naar `/contact`; een onbekende URL toont de eigen 404.
- [ ] `GET /api/contact` toont `"beschikbaar":true` en de Turnstile-sleutel.
- [ ] Contactformulier: Turnstile verschijnt na klikken in het formulier,
      bericht komt aan bij de ontvanger, Reply-To is de aanvrager.
- [ ] Twee bijlagen van samen > 3 MB (bv. PDF + STEP): beide komen aan.
- [ ] In phpMyAdmin staan de testaanvragen met `verzonden = 1`.
- [ ] Bron van de homepage: geen `noindex`, wel GA (`G-8EHNBNNHQB`).

Na de DNS-omzetting (via Joey/Anony; MX naar Microsoft 365 niet aanraken) en
het certificaat (Let's Encrypt in DirectAdmin voor `audacious.com` én
`www.audacious.com`):

- [ ] `node scripts/check-apache.mjs` (zonder opties) geeft 0 fouten, inclusief HSTS.
- [ ] Eén echt testbericht via het contactformulier.
- [ ] Search Console: niets wijzigen (URL's blijven gelijk); de week erna *Pagina-indexering* bekijken.
- [ ] Daarna pas de domeinen uit Vercel halen (§6.3).

## 8. Terugvallen op Vercel (noodplan)

1. Domeinen nog niet verwijderd: DNS van www.audacious.com en audacious.com
   terug naar Vercel (via Joey). Al verwijderd: eerst in Vercel weer
   toevoegen.
2. Het formulier op Vercel gebruikt dan weer zijn eigen variabelen
   (`MAIL_PROVIDER`, `MICROSOFT_*`, `SMTP_*`, `CONTACT_*`) en de limiet van
   4 MB; de opslag in MariaDB bestaat daar niet.

## 9. Lokaal testen zonder echte mail

`apache/test/` bevat een nep-Microsoft 365 en nep-Turnstile (`mock.php`) en
een testconfiguratie (`config.test.php`, met de Turnstile-testsleutel van
Cloudflare):

```
MOCK_LOG=/tmp/mock.log php -S 127.0.0.1:8099 apache/test/mock.php
# Apache-vhost op poort 8080 met DocumentRoot dist-apache/public_html en
#   AllowOverride All; config.test.php als private/config.php ernaast, en
#   SetEnv TEST_DB_DSN / TEST_DB_USER / TEST_DB_PASSWORD voor MariaDB.
node scripts/check-apache.mjs --base http://127.0.0.1:8080 --host www.audacious.com
```
