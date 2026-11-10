/**
 * Gedeelde regels voor de Apache-build (scripts/build-apache.mjs) en de
 * controle (scripts/check-apache.mjs).
 *
 * Bron van de URL-structuur blijft vercel.json: de redirects en rewrites
 * daaruit worden 1-op-1 omgezet naar de .htaccess. Zo kunnen Vercel en Apache
 * niet uit elkaar gaan lopen; een nieuwe redirect zet je dus in vercel.json.
 */
import { readFileSync } from "node:fs";

/** Het hoofdadres; alleen deze host mag geïndexeerd worden. */
export const CANONIEK_HOST = "www.audacious.com";
/** Het kale domein; stuurt door naar CANONIEK_HOST. */
export const APEX_HOST = "audacious.com";
export const CANONIEK = `https://${CANONIEK_HOST}`;

/**
 * Wat er van de repository op de webserver komt. Alles wat hier niet staat
 * (app/, sanity/, components/, api/, *.ts, *.md, package.json …) is broncode
 * of Vercel-specifiek en hoort niet in public_html.
 */
export const PUBLIEK = [
  "html",
  "pages",
  "css",
  "js",
  "assets",
  "404.html",
  "favicon.svg",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
];

/** Gegevens in de meldingen van het formulier (gelijk aan html/contact.html). */
export const CONTACT = {
  email: "info@audacious.com",
  telefoon: "+31 (0)316 - 581 470",
};

const regexEscape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Vercel-pad (`/nieuws/:path*`, `/html/index.html`) → per-directory
 * RewriteRule-patroon zonder voorloop-slash en zonder anker.
 * `:naam*` = nul of meer segmenten, `:naam` = precies één segment.
 */
export function vercelNaarRegex(bron) {
  const relatief = bron.replace(/^\//, "");
  return relatief
    .split(/(:[A-Za-z_]+\*?)/)
    .map((deel) => {
      if (/^:[A-Za-z_]+\*$/.test(deel)) return ".*";
      if (/^:[A-Za-z_]+$/.test(deel)) return "[^/]+";
      return regexEscape(deel);
    })
    .join("");
}

/** @returns {{ trailingSlash: boolean|undefined, redirects: {from:string,to:string}[], rewrites: {from:string,to:string}[] }} */
export function leesVercel(pad = "vercel.json") {
  const v = JSON.parse(readFileSync(pad, "utf8"));
  const redirects = (v.redirects ?? []).map((r) => {
    if (r.permanent === false || r.statusCode === 302 || r.statusCode === 307) {
      throw new Error(`Tijdelijke redirect ${r.source} wordt niet ondersteund in de Apache-build.`);
    }
    if (r.has || r.missing) throw new Error(`Redirect ${r.source} heeft voorwaarden; niet ondersteund.`);
    return { from: r.source, to: r.destination };
  });
  const rewrites = (v.rewrites ?? []).map((r) => ({ from: r.source, to: r.destination }));
  if (redirects.length === 0 || rewrites.length === 0) {
    throw new Error("Geen redirects of rewrites gevonden in vercel.json.");
  }
  return { trailingSlash: v.trailingSlash, redirects, rewrites };
}

/**
 * Content-Security-Policy, bewust in Report-Only: hij blokkeert niets, maar
 * meldt in de browserconsole wat hij zou blokkeren. Pas omzetten naar
 * "Content-Security-Policy" als de console schoon is.
 *
 * Externe bronnen van deze site: Google Fonts, Google Analytics (GA4),
 * Sanity (teksten en foto's worden in de browser opgehaald) en Cloudflare
 * Turnstile (spamcontrole van het formulier op de eigen server).
 */
export const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "frame-src https://challenges.cloudflare.com",
  "form-action 'self'",
  "img-src 'self' data: https://cdn.sanity.io https://www.googletagmanager.com https://*.google-analytics.com",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.sanity.io https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://challenges.cloudflare.com",
].join("; ");

/** Security headers voor elke respons op Apache. */
export const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=()",
  },
  { key: "Content-Security-Policy-Report-Only", value: CSP },
];
