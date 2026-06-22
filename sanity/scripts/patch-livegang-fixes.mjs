import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-02-19'})

const block = (text, key = 'copy') => ({
  _key: key,
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: [{_key: `${key}-span`, _type: 'span', text, marks: []}]
})

const textBlock = ({eyebrow, title, text, key = 'b1'}) => ({
  _key: key,
  _type: 'textBlock',
  eyebrow,
  title,
  text: [block(text, `${key}-text`)]
})

await client.patch('siteSettings').set({
  tagline: 'Voor intelligent en gedurfd plaatwerk'
}).commit()

await client.patch('homePage').set({
  'hero.eyebrow': 'Zevenaar - plaatbewerking',
  'hero.title': 'Voor intelligent en gedurfd\nplaatwerk.',
  'hero.highlight': '',
  'hero.intro': 'Audacious Sheet Metal ontwikkelt en vervaardigt plaatwerkproducten uit RVS, aluminium en staal. Van enkelstuks en kleine series tot lasersnijden, kanten, lassen, constructiewerk, cleanroom verpakken en complete assemblage.',
  'hero.primaryCta.label': 'Contact opnemen',
  'hero.secondaryCta.label': 'Bekijk bewerkingen',
  introTitle: 'Ketenregisseur in\nplaatwerk.',
  introText: 'Audacious organiseert de volledige route: voorbereiding, calculatie, productie, vaste partners, cleanroom verpakken, assemblage en levering. Zo blijft er grip op kwaliteit, kosten en planning.',
  processEyebrow: 'Ketenregie',
  processTitle: 'Voorbereiden, produceren\nen regisseren.',
  processText: 'Audacious kijkt vooraf naar maakbaarheid, materiaal, lasnaden, afwerking, verpakking en productieroute. Zo worden plaatwerkdelen en samenstellingen niet als losse stappen behandeld, maar als één beheersbare keten.',
  processItems: [
    {title: 'Maakbaarheid beoordelen', text: 'Controle op plaatdikte, buigradius, toleranties, lasnaden, reiniging en materiaalkeuze.'},
    {title: 'CAD/CAM voorbereiden', text: '3D CAD, STEP-controle, nesting en NC-programmering voor laser en kantbank.'},
    {title: 'Plaatwerk produceren', text: 'Lasersnijden, kanten, walsen, persen, lassen en afwerken volgens de gekozen route.'},
    {title: 'Ketenregie leveren', text: 'Montage, cleanroom verpakken, vaste partners en levering als één gecontroleerde keten.'}
  ],
  seo: {
    _type: 'seo',
    metaTitle: 'Audacious Sheet Metal | Intelligent en gedurfd plaatwerk',
    metaDescription: 'Audacious in Zevenaar ontwikkelt en produceert intelligent en gedurfd plaatwerk in RVS, aluminium en staal: lasersnijden, kanten, lassen, cleanroom verpakken en assemblage.',
    noIndex: false
  }
}).commit()

await client.createIfNotExists({
  _id: 'service-cleanroom-verpakken',
  _type: 'service',
  title: 'Cleanroom verpakken',
  slug: {_type: 'slug', current: 'cleanroom-verpakken'},
  order: 8,
  intro: 'Reinigen, controleren en cleanroom verpakken van plaatwerkdelen, samenstellingen en modules volgens de gevraagde productspecificatie.',
  summary: 'Cleanroom verpakken van onderdelen en modules zodat producten schoon, beschermd en traceerbaar worden geleverd.',
  blocks: [textBlock({eyebrow: 'Werkzaamheid', title: 'Cleanroom verpakken als onderdeel van de keten', text: 'Schoon en beschermd leveren is onderdeel van een beheerste productieketen. Audacious stemt reiniging, controle, verpakking en levering af op productspecificatie, toepassing en vervolgstap.', key: 'cleanroom-copy'})],
  seo: {
    _type: 'seo',
    metaTitle: 'Cleanroom verpakken | Audacious Sheet Metal',
    metaDescription: 'Cleanroom verpakken, reinigen en controleren van plaatwerkonderdelen, samenstellingen en modules volgens specificatie.',
    noIndex: false
  }
})

console.log('Livegang fixes patched: homepage copy, ketenregie wording and cleanroom service.')
