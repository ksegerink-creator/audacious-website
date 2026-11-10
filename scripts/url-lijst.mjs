#!/usr/bin/env node
/**
 * Lijst van alle URL's van de site, om na de verhuizing naar de eigen server
 * te controleren dat niets een 404 geeft (scripts/check-apache.mjs leest deze
 * lijst).
 *
 *   node scripts/url-lijst.mjs            # haalt de sitemap van de live site op
 *   node scripts/url-lijst.mjs --build    # leest de sitemap uit dist-apache/
 *
 * Schrijft docs/migratie/urls.txt (één pad per regel). Bestaat er een
 * Apache-build, dan meldt het script ook welke paden in de één wel en in de
 * ander niet staan.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { CANONIEK } from "./lib/site-regels.mjs";

const LIVE = `${CANONIEK}/sitemap.xml`;
const BUILD = "dist-apache/public_html/sitemap.xml";
const UIT = "docs/migratie/urls.txt";

const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
const pad = (url) => new URL(url).pathname;

const vanBuild = process.argv.includes("--build");
const bron = vanBuild ? readFileSync(BUILD, "utf8") : await (await fetch(LIVE)).text();
const paden = [...new Set(locs(bron).map(pad))].sort();
if (paden.length === 0) throw new Error(`Geen URL's gevonden in ${vanBuild ? BUILD : LIVE}.`);
mkdirSync("docs/migratie", { recursive: true });
writeFileSync(
  UIT,
  [
    `# Alle pagina's uit ${vanBuild ? "de sitemap van de Apache-build" : LIVE}`,
    `# Gegenereerd met: node scripts/url-lijst.mjs${vanBuild ? " --build" : ""} (${new Date().toISOString().slice(0, 10)})`,
    "# Redirects van oude URL's staan niet hier maar in vercel.json;",
    "# scripts/check-apache.mjs controleert die apart.",
    ...paden,
    "",
  ].join("\n"),
);
console.log(`${paden.length} paden geschreven naar ${UIT}.`);

if (!vanBuild && existsSync(BUILD)) {
  const b = new Set(locs(readFileSync(BUILD, "utf8")).map(pad));
  const alleenLive = paden.filter((p) => !b.has(p));
  const alleenBuild = [...b].filter((p) => !paden.includes(p));
  if (alleenLive.length) console.log(`Alleen op de live site:\n  ${alleenLive.join("\n  ")}`);
  if (alleenBuild.length) console.log(`Alleen in de Apache-build:\n  ${alleenBuild.join("\n  ")}`);
  if (!alleenLive.length && !alleenBuild.length) console.log("Live sitemap en Apache-build hebben precies dezelfde pagina's.");
}
