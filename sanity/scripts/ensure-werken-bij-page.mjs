import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-02-19'})

const block = (text, key) => ({
  _key: key,
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: [{_key: `${key}-span`, _type: 'span', text, marks: []}]
})

const textBlock = (key, eyebrow, title, paragraphs) => ({
  _key: key,
  _type: 'textBlock',
  eyebrow,
  title,
  text: paragraphs.map((paragraph, index) => block(paragraph, `${key}-${index + 1}`))
})

const cardGrid = (key, eyebrow, title, intro, items) => ({
  _key: key,
  _type: 'cardGrid',
  eyebrow,
  title,
  intro,
  items: items.map((item, index) => ({
    _key: `${key}-card-${index + 1}`,
    _type: 'object',
    title: item.title,
    text: item.text
  }))
})

await client.createIfNotExists({
  _id: 'page-werken-bij-audacious',
  _type: 'page',
  title: 'Werken bij Audacious',
  slug: {_type: 'slug', current: 'werken-bij-audacious'},
  template: 'default',
  hero: {
    _type: 'hero',
    eyebrow: 'Werken bij Audacious',
    title: 'Meewerken aan technisch plaatwerk.',
    highlight: 'In een nuchter en vakkundig team.',
    intro: 'Bij Audacious werk je aan plaatwerkproducten, samenstellingen en technische oplossingen voor klanten in de Nederlandse maakindustrie. Van voorbereiding en productie tot assemblage en levering.'
  },
  heroPanel: {
    eyebrow: 'Team',
    title: 'Vakmanschap, korte lijnen en technisch werk.',
    text: 'Audacious zoekt mensen die nauwkeurig werken, verantwoordelijkheid nemen en graag bijdragen aan hoogwaardige plaatwerkoplossingen.',
    panelLabel: 'WERKEN BIJ',
    panelCode: 'ASM-HR',
    rows: [
      {_key: 'row-1', _type: 'object', label: 'Werkveld', value: 'Plaatwerk, assemblage en engineering'},
      {_key: 'row-2', _type: 'object', label: 'Locatie', value: 'Zevenaar'},
      {_key: 'row-3', _type: 'object', label: 'Cultuur', value: 'Nuchter, technisch en betrokken'}
    ]
  },
  blocks: [
    textBlock('intro', 'Over werken bij Audacious', 'Techniek, precisie en verantwoordelijkheid', [
      'Audacious is actief als toeleverancier en partner van OEM’ers in de Nederlandse maakindustrie. Binnen het bedrijf werken voorbereiding, productie, assemblage en logistiek nauw samen om plaatwerkproducten betrouwbaar en nauwkeurig te leveren.',
      'Wie bij Audacious werkt, draagt bij aan producten waarbij maatvoering, afwerking en leverbetrouwbaarheid belangrijk zijn. Dat vraagt om vakmanschap, technisch inzicht en aandacht voor detail.'
    ]),
    cardGrid('rollen', 'Mogelijkheden', 'Waar je aan kunt bijdragen', 'Binnen Audacious zijn verschillende werkzaamheden belangrijk voor het eindresultaat.', [
      {title: 'Productie', text: 'Werken aan plaatwerkdelen, bewerkingen en samenstellingen met aandacht voor kwaliteit en herhaalbaarheid.'},
      {title: 'Assemblage', text: 'Samenbouwen, afmonteren en controleren van producten voordat ze naar de klant of vervolgstap gaan.'},
      {title: 'Engineering en voorbereiding', text: 'Meedenken over maakbaarheid, productieroute, plaatuitslagen en technische voorbereiding.'},
      {title: 'Logistiek en organisatie', text: 'Zorgen dat orders, materialen, bewerkingen en leveringen goed op elkaar aansluiten.'}
    ]),
    textBlock('houding', 'Wat we belangrijk vinden', 'Nauwkeurig werken en meedenken', [
      'Audacious past bij mensen die praktisch denken, technisch willen werken en kwaliteit serieus nemen. Korte lijnen, duidelijke afspraken en verantwoordelijkheid nemen zijn belangrijk in het dagelijkse werk.',
      'Ervaring in plaatwerk, metaal, assemblage of engineering is waardevol, maar motivatie, leervermogen en zorgvuldigheid tellen net zo goed mee.'
    ])
  ],
  closingCta: {
    title: 'Interesse om bij Audacious te werken?',
    button: {
      _type: 'cta',
      label: 'Neem contact op',
      linkType: 'internal',
      internalPage: {_type: 'reference', _ref: 'page-contact'}
    }
  },
  seo: {
    _type: 'seo',
    metaTitle: 'Werken bij Audacious | Audacious Sheet Metal',
    metaDescription: 'Werken bij Audacious Sheet Metal in Zevenaar: technisch werk in plaatwerk, assemblage, engineering en productievoorbereiding.',
    noIndex: false
  }
})

console.log('Werken bij Audacious staat nu als bewerkbare pagina in Sanity.')
