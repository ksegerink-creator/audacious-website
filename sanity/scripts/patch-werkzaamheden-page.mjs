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

const specList = (key, title, intro, items) => ({
  _key: key,
  _type: 'specList',
  title,
  intro,
  items: items.map((item, index) => ({
    _key: `${key}-item-${index + 1}`,
    _type: 'object',
    label: item.label,
    value: item.value
  }))
})

const page = await client.fetch('*[_type == "page" && slug.current == "werkzaamheden"][0]{_id}')

if (!page?._id) {
  throw new Error('Pagina met slug werkzaamheden niet gevonden in Sanity.')
}

await client.patch(page._id).set({
  title: 'Werkzaamheden',
  hero: {
    _type: 'hero',
    eyebrow: 'Werkzaamheden',
    title: 'Hoogwaardige plaatwerkproducten voor OEM’ers.',
    highlight: 'Van ontwerp tot logistieke services.',
    intro: 'Audacious Sheet Metal International B.V. is al 25 jaar actief als toeleverancier en partner van OEM’ers in de Nederlandse maakindustrie. Wij produceren hoogwaardige plaatwerkproducten uit staal, RVS en aluminium: van mono-delen tot samengestelde constructies en totaalproducten.'
  },
  heroPanel: {
    eyebrow: 'Ketenregie',
    title: 'Plaatwerk, assemblage en levering in één beheersbaar proces.',
    text: 'Audacious organiseert de route van engineering, lasersnijden, kanten en lassen tot oppervlaktebehandeling, machinale nabewerking, cleanroom verpakken, voormontage en logistiek.',
    panelLabel: 'FOCUS',
    panelCode: 'ASM-WERK',
    rows: [
      {_key: 'row-1', _type: 'object', label: 'Materialen', value: 'Staal, RVS en aluminium'},
      {_key: 'row-2', _type: 'object', label: 'Producten', value: 'Machineframes, kasten, behuizingen en samenstellingen'},
      {_key: 'row-3', _type: 'object', label: 'Proces', value: 'Engineering, productie, assemblage en logistiek'}
    ]
  },
  blocks: [
    textBlock('intro', 'Plaatwerkpartner', 'Van mono-deel tot complete samenstelling', [
      'Audacious Sheet Metal International B.V. is al 25 jaar actief als toeleverancier en partner van OEM’ers in de Nederlandse maakindustrie. Van ontwerp tot en met logistieke services produceren wij hoogwaardige plaatwerkproducten voor technische toepassingen.',
      'Wij leveren zowel lasergesneden en gekante mono-delen als samengestelde plaatwerkconstructies uit staal, RVS en aluminium. Onze focus ligt op machineframes, kasten, behuizingen, machinebekledingen en mechanische samenstellingen waarbij maatvoering, afwerking en leverbetrouwbaarheid centraal staan.'
    ]),
    textBlock('ketenregie', 'Ketenregisseur', 'Regie over bewerking, afwerking en levering', [
      'Als ketenregisseur organiseert Audacious niet alleen de plaatbewerking, maar ook aanvullende processtappen zoals oppervlaktebehandeling, machinale nabewerking, cleanroom verpakken en assemblage. Daarnaast beschikken wij over eigen mogelijkheden voor elektromechanische voormontage.',
      'Exacte maatvoering, een hoogwaardige finishing touch en stipte aanlevering zijn voor ons vanzelfsprekend. Audacious staat voor beheersbare processen, korte orderdoorlooptijden en duidelijke regie over de volledige productieketen.'
    ]),
    cardGrid('producten-diensten', 'Producten en diensten', 'Vier hoofdgroepen binnen Audacious', 'Binnen Audacious onderscheiden we onze werkzaamheden in vier duidelijke producten en diensten.', [
      {title: 'Mono-delen', text: 'Nauwkeurige plaatwerkonderdelen uit staal, RVS en aluminium. Denk aan lasergesneden contouren, gezette onderdelen, plaatuitslagen en technische componenten voor verdere bewerking of montage.'},
      {title: 'Samengesteld plaatwerk', text: 'Samengestelde plaatwerkconstructies zoals frames, kasten, behuizingen en machinebekledingen. Meerdere bewerkingen worden gecombineerd tot één gecontroleerd productieproces.'},
      {title: 'Totaalproducten inclusief assembleren', text: 'Complete samenstellingen inclusief oppervlaktebehandeling, machinale nabewerking, cleanroom verpakken, assemblage en elektromechanische voormontage.'},
      {title: 'Engineering', text: 'Schetsen, ideeën en specificaties worden vertaald naar produceerbare 3D-producten, plaatuitslagen en maakbare eindproducten waarin de wensen en eisen van de klant zijn verwerkt.'}
    ]),
    specList('engineering-specificaties', 'Engineering en maakbaarheid', 'Audacious denkt actief mee om tot een technisch maakbaar en efficiënt produceerbaar product te komen.', [
      {label: 'Schetsen uitwerken', value: 'Van schets of concept naar 3D-product en technische uitwerking.'},
      {label: 'Plaatuitslagen', value: 'Producten voorbereiden voor lasersnijden, kanten en verdere plaatbewerking.'},
      {label: 'Meedenken met klant', value: 'Materiaal, toleranties, afwerking, assemblage en productiewijze afstemmen op alle wensen en eisen.'},
      {label: 'Produceerbaar eindproduct', value: 'Engineering gericht op kwaliteit, korte doorlooptijd en beheersbare productie.'}
    ]),
    textBlock('afsluiting', 'Van ontwerp tot levering', 'Grip op kwaliteit, planning en kosten', [
      'Audacious denkt mee vanaf de eerste technische vraag. Door engineering, productie, nabewerking, assemblage en logistiek slim op elkaar af te stemmen, houden we grip op kwaliteit, planning en kosten. Dat maakt ons een betrouwbare partner voor OEM’ers die zoeken naar hoogwaardige plaatwerkoplossingen met korte doorlooptijden.'
    ])
  ],
  closingCta: {
    title: 'Een plaatwerkvraag bespreken?',
    button: {
      _type: 'cta',
      label: 'Aanvraag starten',
      linkType: 'internal',
      internalPage: {_type: 'reference', _ref: 'page-contact'}
    }
  },
  seo: {
    _type: 'seo',
    metaTitle: 'Werkzaamheden | Audacious Sheet Metal',
    metaDescription: 'Audacious Sheet Metal produceert mono-delen, samengesteld plaatwerk, totaalproducten en engineering voor OEM’ers in de Nederlandse maakindustrie.',
    noIndex: false
  }
}).commit()

console.log('Werkzaamheden-pagina is bijgewerkt in Sanity.')
