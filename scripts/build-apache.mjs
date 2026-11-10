#!/usr/bin/env node
/**
 * Bouwt de site voor de DirectAdmin-server (Apache + PHP, geen Node), in
 * dist-apache/:
 *
 *   public_html/   de INHOUD hiervan hoort in
 *                  domains/audacious.com/public_html/
 *     .htaccess    https, audacious.com → www.audacious.com, trailing slash
 *                  zoals op Vercel, alle redirects en rewrites uit
 *                  vercel.json, eigen 404, caching, security headers en de
 *                  route /api/contact
 *     _form/       de PHP-verwerker van het contactformulier + settings.json
 *   private/       hoort NAAST public_html: config.example.php en schema.sql
 *   LEESMIJ.md     apache/README.md
 *
 * De site zelf is statische HTML/CSS/JS; er is geen framework-build. Dit
 * script kopieert alleen de publieke bestanden (zie PUBLIEK in
 * scripts/lib/site-regels.mjs) en heeft geen npm-pakketten nodig.
 *
 * Gebruik: `npm run build:apache` (of `node scripts/build-apache.mjs`).
 */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  APEX_HOST,
  CANONIEK,
  CANONIEK_HOST,
  CONTACT,
  PUBLIEK,
  SECURITY_HEADERS,
  leesVercel,
  vercelNaarRegex,
} from "./lib/site-regels.mjs";

const OUT = "dist-apache";
const WEB = join(OUT, "public_html");
const PRIVATE = join(OUT, "private");

const regexEscape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** De root-.htaccess als tekst. Puur, zodat hij te testen is. */
export function bouwHtaccess({ redirects, rewrites, headers = SECURITY_HEADERS }) {
  const www = regexEscape(CANONIEK_HOST);
  const apex = regexEscape(APEX_HOST);
  const regels = [
    "# Gegenereerd door scripts/build-apache.mjs uit vercel.json en",
    "# scripts/lib/site-regels.mjs. Niet met de hand aanpassen: wijzig de bron en",
    "# bouw opnieuw (de deploy-workflow overschrijft dit bestand bij elke push).",
    "",
    "Options -Indexes -MultiViews",
    "DirectoryIndex disabled",
    "AddDefaultCharset utf-8",
    "AddType image/svg+xml .svg",
    "AddType text/plain .txt",
    "",
    "# Eigen 404-pagina (404.html, dezelfde als op Vercel).",
    "ErrorDocument 404 /404.html",
    "",
    "<Files \".user.ini\">",
    "    Require all denied",
    "</Files>",
    "# Geschreven door de deploy-workflow (.github/workflows/deploy-apache.yml):",
    "# .ftp-deploy-sync-state.json bevat de volledige bestandslijst met hashes.",
    "# Alle .ftp-deploy*-bestanden weigeren, ook tijdelijke of back-upkopieën.",
    "<FilesMatch \"^\\.ftp-deploy\">",
    "    Require all denied",
    "</FilesMatch>",
    "",
    "<IfModule mod_headers.c>",
    ...headers.map(({ key, value }) => `    Header always set ${key} "${value.replace(/"/g, '\\"')}"`),
    `    # Alleen ${CANONIEK_HOST} mag in Google; een test- of stagingadres niet.`,
    `    <If "%{HTTP_HOST} != '${CANONIEK_HOST}'">`,
    "        Header always set X-Robots-Tag \"noindex, nofollow\"",
    "    </If>",
    "    # HSTS zoals Vercel het stuurde (twee jaar), alleen voor het echte domein",
    "    # over HTTPS, zodat een testadres zonder certificaat niet vastzit.",
    `    <If "%{HTTP_HOST} == '${CANONIEK_HOST}' && %{HTTPS} == 'on'">`,
    "        Header always set Strict-Transport-Security \"max-age=63072000\"",
    "    </If>",
    "    # Foto's, iconen en fonts: een dag cachen. Bestandsnamen hebben geen hash,",
    "    # dus een vervangen foto staat binnen een dag overal.",
    "    <FilesMatch \"\\.(?:avif|webp|png|jpe?g|gif|svg|ico|pdf|woff2?|ttf|otf)$\">",
    "        Header set Cache-Control \"public, max-age=86400\"",
    "    </FilesMatch>",
    "    # Pagina's, CSS en JS altijd opnieuw valideren (ETag), zoals op Vercel:",
    "    # na een deploy ziet iedereen meteen de nieuwe versie, zonder mengvorm.",
    "    <FilesMatch \"\\.(?:html|css|js|xml|txt|json)$\">",
    "        Header set Cache-Control \"public, max-age=0, must-revalidate\"",
    "    </FilesMatch>",
    "</IfModule>",
    "",
    "<IfModule mod_deflate.c>",
    "    AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript text/javascript application/json application/xml image/svg+xml",
    "</IfModule>",
    "",
    "# Uploadlimieten voor mod_php; PHP-FPM leest _form/.user.ini.",
    "<IfModule php_module>",
    "    php_value upload_max_filesize 12M",
    "    php_value post_max_size 24M",
    "</IfModule>",
    "",
    "# Apache mag zelf geen slash toevoegen; de regels hieronder doen wat Vercel",
    "# deed (trailingSlash: false).",
    "DirectorySlash Off",
    "",
    "RewriteEngine On",
    "RewriteBase /",
    "",
    `# ${APEX_HOST} → ${CANONIEK_HOST} en http → https. Alleen voor het echte`,
    "# domein, zodat het IP-adres of een testdomein zonder certificaat werkt.",
    `RewriteCond %{HTTP_HOST} ^${apex}$ [NC]`,
    `RewriteRule ^ https://${CANONIEK_HOST}%{REQUEST_URI} [R=301,L,NE]`,
    `RewriteCond %{HTTP_HOST} ^${www}$ [NC]`,
    "RewriteCond %{HTTPS} !=on",
    "RewriteCond %{HTTP:X-Forwarded-Proto} !=https",
    `RewriteRule ^ https://${CANONIEK_HOST}%{REQUEST_URI} [R=301,L,NE]`,
    "",
    "# Contactformulier: /api/contact wordt afgehandeld door PHP (GET en POST).",
    "# [END]: na deze interne rewrite geen regels meer, dus ook niet de 404 hieronder.",
    "RewriteRule ^api/contact$ _form/contact.php [END]",
    "# De map _form/ zelf is nooit rechtstreeks bereikbaar.",
    "RewriteRule ^_form(/|$) - [R=404,L]",
    "",
    "# Permanente redirects uit vercel.json. Met en zonder slash in één stap;",
    "# de query string blijft behouden, net als op Vercel.",
    ...redirects.map(({ from, to }) => `RewriteRule ^${vercelNaarRegex(from)}/?$ ${to} [R=301,L,NE]`),
    "",
    "# Trailing slash zoals op Vercel (trailingSlash: false): /contact/ → /contact.",
    "RewriteRule ^(.+)/$ /$1 [R=301,L,NE]",
    "",
    "# Overige /api/-routes bestaan hier niet.",
    "RewriteRule ^api(/|$) - [R=404,L]",
    "",
    "# Nette URL's → HTML-bestanden (de rewrites uit vercel.json). [END] zodat de",
    "# redirects hierboven niet nog eens op het doel (/html/…) worden toegepast.",
    ...rewrites.map(({ from, to }) => `RewriteRule ^${vercelNaarRegex(from)}$ ${to.replace(/^\//, "")} [END]`),
    "",
    "# Een map (/css, /html …) is geen pagina: 404 zoals op Vercel.",
    "RewriteCond %{REQUEST_FILENAME} -d",
    "RewriteRule ^ - [R=404,L]",
    "",
  ];
  return regels.join("\n");
}

function main() {
  const { trailingSlash, redirects, rewrites } = leesVercel();
  if (trailingSlash !== false) {
    throw new Error("vercel.json heeft geen trailingSlash: false meer; pas de trailing-slash-regel in build-apache.mjs aan.");
  }

  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(WEB, { recursive: true });
  mkdirSync(PRIVATE, { recursive: true });

  for (const item of PUBLIEK) {
    if (!existsSync(item)) throw new Error(`${item} ontbreekt in de repository.`);
    cpSync(item, join(WEB, item), { recursive: true });
  }
  // Elk rewrite-doel moet bestaan, anders geeft een pagina uit de sitemap 404.
  for (const { from, to } of rewrites) {
    if (!existsSync(join(WEB, to))) throw new Error(`Rewrite ${from} → ${to}: doelbestand ontbreekt.`);
  }

  // PHP-verwerker, instellingen en databaseschema.
  cpSync("apache/public_html", WEB, { recursive: true });
  writeFileSync(
    join(WEB, "_form", "settings.json"),
    `${JSON.stringify({ contactEmail: CONTACT.email, contactTel: CONTACT.telefoon, siteUrl: CANONIEK }, null, 2)}\n`,
  );
  cpSync("apache/private/schema.sql", join(WEB, "_form", "lib", "schema.sql"));
  cpSync("apache/private", PRIVATE, { recursive: true });
  writeFileSync(join(WEB, ".htaccess"), bouwHtaccess({ redirects, rewrites }));
  cpSync("apache/README.md", join(OUT, "LEESMIJ.md"));

  const paginas = readFileSync(join(WEB, "sitemap.xml"), "utf8").match(/<loc>/g)?.length ?? 0;
  console.log(
    `Apache-build in ${OUT}/: ${paginas} pagina's in de sitemap, ${rewrites.length} rewrites en ` +
      `${redirects.length} redirects in .htaccess.`,
  );
}

if (process.argv[1]?.endsWith("build-apache.mjs")) {
  main();
}
