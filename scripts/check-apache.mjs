#!/usr/bin/env node
/**
 * Controleert een draaiende Apache-versie van de site, vóór en na de
 * DNS-omzetting. Verstuurt niets: de enige POST is er één vanaf een vreemde
 * herkomst, die geweigerd moet worden.
 *
 *   node scripts/check-apache.mjs                       # https://www.audacious.com
 *   node scripts/check-apache.mjs --ip 62.84.247.85 -k  # vóór de DNS-omzetting
 *   node scripts/check-apache.mjs --base http://127.0.0.1:8080 --host www.audacious.com
 *
 *   --base <url>   te controleren adres (standaard https://www.audacious.com)
 *   --ip <ip>      verbind met dit IP i.p.v. de DNS (zoals een hosts-bestand)
 *   -k             certificaat niet controleren (zolang er nog geen geldig is)
 *   --host <naam>  Host-header (lokaal testen tegen een IP of poort)
 *   --urls <file>  lijst met paden (standaard docs/migratie/urls.txt)
 *
 * Gebruikt curl (ook aanwezig op Windows 10+ en in GitHub Actions), omdat
 * alleen curl eenvoudig een IP kan forceren zonder het hosts-bestand.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { APEX_HOST, CANONIEK, CANONIEK_HOST, leesVercel } from "./lib/site-regels.mjs";

const args = process.argv.slice(2);
const optie = (naam, standaard) => {
  const i = args.indexOf(naam);
  return i >= 0 ? args[i + 1] : standaard;
};
const BASE = optie("--base", CANONIEK).replace(/\/$/, "");
const IP = optie("--ip");
const HOST = optie("--host");
const INSECURE = args.includes("-k");
const URLS = optie("--urls", "docs/migratie/urls.txt");
const basis = new URL(BASE);
const isProductie = basis.hostname === CANONIEK_HOST && basis.protocol === "https:";

function curl(url, { method = "GET", headers = {}, body } = {}) {
  const u = new URL(url);
  const a = ["-s", "-D", "-", "-X", method, "--max-time", "30"];
  if (INSECURE) a.push("-k");
  if (IP) a.push("--resolve", `${u.hostname}:${u.port || (u.protocol === "https:" ? 443 : 80)}:${IP}`);
  if (HOST) a.push("-H", `Host: ${HOST}`);
  // Lokaal (http) doen alsof er HTTPS voor zit, anders volgt overal de https-redirect.
  if (HOST && u.protocol === "http:") a.push("-H", "X-Forwarded-Proto: https");
  for (const [k, v] of Object.entries(headers)) a.push("-H", `${k}: ${v}`);
  if (body !== undefined) a.push("--data-raw", body);
  a.push(url);
  const r = spawnSync("curl", a, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
  let rest = r.stdout ?? "";
  let kop = "";
  while (/^HTTP\//.test(rest)) {
    const eind = rest.search(/\r?\n\r?\n/);
    if (eind < 0) {
      kop = rest;
      rest = "";
      break;
    }
    kop = rest.slice(0, eind);
    rest = rest.slice(eind).replace(/^\r?\n\r?\n/, "");
  }
  const status = Number(kop.match(/^HTTP\/[\d.]+ (\d{3})/)?.[1] ?? 0);
  const hdrs = {};
  for (const regel of kop.split(/\r?\n/).slice(1)) {
    const i = regel.indexOf(":");
    if (i > 0) hdrs[regel.slice(0, i).trim().toLowerCase()] = regel.slice(i + 1).trim();
  }
  return { status, headers: hdrs, body: rest };
}

let fouten = 0;
let goed = 0;
const fout = (msg) => {
  fouten += 1;
  console.log(`  ✗ ${msg}`);
};
const ok = () => (goed += 1);
const sectie = (t) => console.log(`\n${t}`);
const padVan = (loc) => (loc.startsWith("http") ? new URL(loc).pathname + new URL(loc).search : loc);

// ── 1. Alle pagina's ─────────────────────────────────────────────────────────
const paden = readFileSync(URLS, "utf8")
  .split(/\r?\n/)
  .map((r) => r.trim())
  .filter((r) => r.startsWith("/"));
sectie(`Pagina's (${paden.length}) → 200, canonical naar ${CANONIEK}, geen noindex`);
for (const pad of paden) {
  const r = curl(BASE + pad);
  if (r.status !== 200) {
    fout(`${pad} gaf ${r.status}`);
    continue;
  }
  const canonical = r.body.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical !== undefined && canonical !== CANONIEK + pad) fout(`${pad}: canonical is ${canonical}`);
  else if (/<meta name="robots" content="[^"]*noindex/.test(r.body)) fout(`${pad}: heeft noindex in de HTML`);
  else ok();
}

// ── 2. Redirects uit vercel.json ────────────────────────────────────────────
const { redirects } = leesVercel();
const voorbeeld = (bron) => bron.replace(/:[A-Za-z_]+\*/g, "voorbeeld/pad").replace(/:[A-Za-z_]+/g, "voorbeeld");
sectie(`Redirects (${redirects.length}, met en zonder slash) → 301 naar het juiste doel`);
for (const { from, to } of redirects) {
  const pad = voorbeeld(from);
  for (const variant of [pad, `${pad}/`]) {
    const r = curl(BASE + variant);
    const loc = r.headers.location ?? "";
    if (r.status !== 301 || padVan(loc) !== to) fout(`${variant} gaf ${r.status} → ${loc || "(geen location)"}, verwacht 301 → ${to}`);
    else ok();
  }
}
const q = curl(`${BASE}/html/contact.html?utm_source=test`);
if (q.status === 301 && padVan(q.headers.location ?? "") === "/contact?utm_source=test") ok();
else fout(`query string bij redirect: ${q.status} → ${q.headers.location}`);

// ── 3. Host, https, trailing slash, 404 ─────────────────────────────────────
sectie("audacious.com → www, https, trailing slash en 404");
if (isProductie || IP) {
  const apex = curl(`https://${APEX_HOST}/contact?x=1`);
  if (apex.status === 301 && apex.headers.location === `${CANONIEK}/contact?x=1`) ok();
  else fout(`https://${APEX_HOST} gaf ${apex.status} → ${apex.headers.location}`);
  const apexHttp = curl(`http://${APEX_HOST}/`);
  if (apexHttp.status === 301 && apexHttp.headers.location === `${CANONIEK}/`) ok();
  else fout(`http://${APEX_HOST} gaf ${apexHttp.status} → ${apexHttp.headers.location}`);
  const http = curl(`http://${CANONIEK_HOST}/contact`);
  if (http.status === 301 && http.headers.location === `${CANONIEK}/contact`) ok();
  else fout(`http://${CANONIEK_HOST} gaf ${http.status} → ${http.headers.location}`);
} else {
  console.log("  (apex/https overgeslagen: alleen tegen het echte domein of met --ip)");
}
const metSlash = curl(`${BASE}/contact/?x=1`);
if (metSlash.status === 301 && padVan(metSlash.headers.location ?? "") === "/contact?x=1") ok();
else fout(`/contact/ gaf ${metSlash.status} → ${metSlash.headers.location}, verwacht 301 → /contact (zoals Vercel)`);
const diep = curl(`${BASE}/projecten/food-frame/`);
if (diep.status === 301 && padVan(diep.headers.location ?? "") === "/projecten/food-frame") ok();
else fout(`/projecten/food-frame/ gaf ${diep.status} → ${diep.headers.location}`);
const nf = curl(`${BASE}/deze-pagina-bestaat-niet`);
if (nf.status === 404 && nf.body.includes("404")) ok();
else fout(`onbekende pagina gaf ${nf.status} (verwacht 404 met de eigen 404-pagina)`);
const map = curl(`${BASE}/css`);
if (map.status === 404) ok();
else fout(`/css (een map) gaf ${map.status}, verwacht 404`);

// ── 4. Headers en caching ───────────────────────────────────────────────────
sectie("Security headers en caching");
const home = curl(`${BASE}/`);
for (const h of ["x-content-type-options", "x-frame-options", "referrer-policy", "permissions-policy", "content-security-policy-report-only"]) {
  if (home.headers[h]) ok();
  else fout(`header ${h} ontbreekt op /`);
}
if (isProductie) {
  if (home.headers["strict-transport-security"]) ok();
  else fout("HSTS ontbreekt op /");
}
const verwachtHost = HOST ?? basis.hostname;
if (verwachtHost === CANONIEK_HOST) {
  if (home.headers["x-robots-tag"]) fout(`X-Robots-Tag op ${CANONIEK_HOST}: ${home.headers["x-robots-tag"]}`);
  else ok();
}
if (/must-revalidate/.test(home.headers["cache-control"] ?? "")) ok();
else fout(`Cache-Control op / is "${home.headers["cache-control"]}"`);
const foto = curl(`${BASE}/assets/hero-press-brake.jpeg`);
if (foto.status === 200 && /max-age=86400/.test(foto.headers["cache-control"] ?? "")) ok();
else fout(`/assets/hero-press-brake.jpeg: ${foto.status}, Cache-Control "${foto.headers["cache-control"]}"`);

// ── 5. Vaste bestanden ──────────────────────────────────────────────────────
sectie("Vaste bestanden");
for (const pad of ["/robots.txt", "/sitemap.xml", "/llms.txt", "/favicon.svg", "/css/style.css", "/js/main.js", "/js/contact-form.js"]) {
  const r = curl(BASE + pad);
  if (r.status === 200) ok();
  else fout(`${pad} gaf ${r.status}`);
}
const sitemap = curl(`${BASE}/sitemap.xml`).body;
if (sitemap.includes(`<loc>${CANONIEK}/</loc>`)) ok();
else fout(`sitemap.xml bevat geen ${CANONIEK}/`);
for (const pad of [
  "/_form/settings.json",
  "/_form/contact.php",
  "/_form/lib/Store.php",
  "/_form/lib/schema.sql",
  "/_form/.user.ini",
  "/.htaccess",
  "/.ftp-deploy-sync-state.json",
  "/.ftp-deploy-sync-state.json.tmp",
  "/package.json",
  "/vercel.json",
  "/api/contact.js",
  "/app/page.tsx",
]) {
  const r = curl(BASE + pad);
  if (r.status === 403 || r.status === 404) ok();
  else fout(`${pad} is bereikbaar (${r.status}); hoort afgeschermd te zijn`);
}

// ── 6. Formulier-endpoint ───────────────────────────────────────────────────
sectie("Formulier-endpoint /api/contact (verstuurt niets)");
const cfg = curl(`${BASE}/api/contact`, { headers: { accept: "application/json" } });
let json = null;
try {
  json = JSON.parse(cfg.body);
} catch {}
if (cfg.status === 200 && json && "captcha" in json) {
  ok();
  console.log(`  mail ingesteld: ${json.beschikbaar ? "ja" : "NEE"}, Turnstile: ${json.captcha ? "ja" : "nee"}`);
  if (!json.beschikbaar) fout("mail is niet ingesteld in private/config.php: aanvragen worden NIET verstuurd");
} else fout(`GET /api/contact gaf ${cfg.status}`);
const vreemd = curl(`${BASE}/api/contact`, {
  method: "POST",
  headers: { origin: "https://voorbeeld.invalid", "content-type": "application/x-www-form-urlencoded" },
  body: "name=x",
});
if (vreemd.status === 403) ok();
else fout(`POST vanaf een vreemde herkomst gaf ${vreemd.status}, verwacht 403`);

console.log(`\n${goed} goed, ${fouten} fout.`);
process.exit(fouten > 0 ? 1 : 0);
