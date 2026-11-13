import {getCliClient} from 'sanity/cli'

/**
 * Zet alleen de SEO-titel, SEO-beschrijving en H1 van /oppervlaktebehandelingen.
 * Raakt verder niets aan (anders dan update-seo-copy.mjs, dat ook blokken
 * en intro's van andere pagina's overschrijft).
 *
 * Gebruik: npm run sanity:patch-oppervlakte
 *
 * De H1 op de site is hero.title + hero.highlight (oranje deel, in een <span>);
 * og:title/og:description en twitter:* volgen seo.metaTitle/metaDescription
 * (js/sanity-page-images.js).
 */
const client = getCliClient({apiVersion: '2025-02-19'})
const id = 'service-oppervlaktebehandelingen'

const result = await client
  .patch(id)
  .setIfMissing({hero: {_type: 'hero'}, seo: {_type: 'seo', noIndex: false}})
  .set({
    'hero.title': 'Oppervlaktebehandeling als onderdeel van de',
    'hero.highlight': 'productieroute',
    'seo.metaTitle': 'Oppervlaktebehandeling van plaatwerk | Audacious',
    'seo.metaDescription': 'Plaatwerk afgewerkt geleverd: Audacious regelt poedercoaten, verzinken, beitsen of passiveren als onderdeel van uw productieroute.'
  })
  .commit({visibility: 'sync'})

console.log(`${id} bijgewerkt (rev ${result._rev}):`, JSON.stringify({hero: result.hero, seo: result.seo}, null, 2))
