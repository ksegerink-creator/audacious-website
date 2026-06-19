import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-02-19'})

const block = (text) => ({
  _type: 'block',
  _key: text.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30) || 'block',
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: 'span', text, marks: []}]
})

const pages = [
  {
    _id: 'page-productievoorbereiding',
    title: 'Productievoorbereiding',
    slug: 'productievoorbereiding',
    template: 'default',
    hero: {
      eyebrow: 'Productievoorbereiding',
      title: 'Foutloos produceren begint',
      highlight: 'vóór de werkvloer.',
      intro: 'Audacious richt productievoorbereiding op snelle steltijden, maakbaarheid en foutreductie. Juist bij enkelstuks en kleine series bepalen voorbereiding, simulatie en routekeuze direct de kwaliteit, kostprijs en levertijd.'
    },
    seo: {
      metaTitle: 'Productievoorbereiding | Audacious Sheet Metal',
      metaDescription: 'Productievoorbereiding bij Audacious: maakbaarheid, simulatie, korte steltijden, foutreductie, materiaalkeuze en minder lasnaden vóór productie.'
    }
  },
  {
    _id: 'page-engineering',
    title: 'Engineering & CAD/CAM',
    slug: 'engineering',
    template: 'default',
    hero: {
      eyebrow: 'Engineering / CAD-CAM',
      title: 'Van STEP-file naar',
      highlight: 'maakbaar plaatwerk.',
      intro: 'Audacious gebruikt engineering en CAD/CAM om aangeleverde modellen te controleren, te optimaliseren en geschikt te maken voor lasersnijden, kanten, lassen en assemblage.'
    },
    seo: {
      metaTitle: 'Engineering & CAD/CAM | Audacious Sheet Metal',
      metaDescription: 'Engineering en CAD/CAM bij Audacious: 3D CAD, STEP-controle, ontwerpregels, Radan, nesting, NC-programmering en buigsimulatie.'
    }
  },
  {
    _id: 'page-materialen',
    title: 'Materialen',
    slug: 'materialen',
    template: 'default',
    hero: {
      eyebrow: 'Materialen',
      title: 'Het juiste materiaal voor',
      highlight: 'de toepassing.',
      intro: 'Audacious verwerkt een breed spectrum aan plaatmaterialen. Materiaalkeuze bepaalt maakbaarheid, afwerking, corrosiebestendigheid, sterkte en kostprijs.'
    },
    seo: {
      metaTitle: 'Materialen | Audacious Sheet Metal',
      metaDescription: 'Materialen bij Audacious: staal, RVS 304, RVS 316L, chroomstaal, aluminium, messing en andere plaatmaterialen voor industriële toepassing.'
    }
  },
  {
    _id: 'page-projecten',
    title: 'Projecten',
    slug: 'projecten',
    template: 'default',
    hero: {
      eyebrow: 'Projecten',
      title: 'Een blik op onze',
      highlight: 'projecten.',
      intro: 'Voorbeelden van producten en projecten: frames, RVS 316L behuizingen, een röntgenarm, verpakkingsmachineframes, engineeringwerk, schuifdeuren en transportwagens.'
    },
    seo: {
      metaTitle: 'Projecten | Audacious Sheet Metal',
      metaDescription: 'Projecten van Audacious: food-frame, RVS 316L behuizingen, röntgenarm, verpakkingsmachineframes, engineering behuizing, schuifdeuren en transportwagen.'
    }
  },
  {
    _id: 'page-project-food-frame',
    title: 'Project: Frame voor de food-industrie',
    slug: 'project-food-frame',
    template: 'default',
    hero: {
      eyebrow: 'Projecten / Food-industrie',
      title: 'Frame voor de',
      highlight: 'food-industrie.',
      intro: 'Frameconstructie voor toepassing in de voedingsmiddelenindustrie, met aandacht voor materiaalkeuze, laswerk, afwerking en montage.'
    },
    seo: {metaTitle: 'Frame voor de food-industrie | Audacious', metaDescription: 'Projectvoorbeeld van Audacious: frameconstructie voor toepassing in de voedingsmiddelenindustrie.'}
  },
  {
    _id: 'page-project-plaatwerk-behuizingen',
    title: 'Project: Plaatwerk behuizingen uit RVS 316L',
    slug: 'project-plaatwerk-behuizingen',
    template: 'default',
    hero: {
      eyebrow: 'Projecten / RVS 316L',
      title: 'Plaatwerk behuizingen uit',
      highlight: 'RVS 316L.',
      intro: 'Plaatwerkbehuizingen waarbij materiaalkeuze, passing, zichtkwaliteit en montage samenkomen.'
    },
    seo: {metaTitle: 'Plaatwerk behuizingen uit RVS 316L | Audacious', metaDescription: 'Projectvoorbeeld van Audacious: plaatwerk behuizingen uit RVS 316L.'}
  },
  {
    _id: 'page-project-rontgenarm',
    title: 'Project: Röntgenarm',
    slug: 'project-rontgenarm',
    template: 'default',
    hero: {
      eyebrow: 'Projecten / Medisch-technisch',
      title: 'Project',
      highlight: 'röntgenarm.',
      intro: 'Technische samenstelling met plaatwerkcomponenten, montage en controle.'
    },
    seo: {metaTitle: 'Project röntgenarm | Audacious', metaDescription: 'Projectvoorbeeld van Audacious: technische samenstelling rondom een röntgenarm.'}
  },
  {
    _id: 'page-project-verpakkingsframes',
    title: 'Project: Frames voor verpakkingsmachines',
    slug: 'project-verpakkingsframes',
    template: 'default',
    hero: {
      eyebrow: 'Projecten / Verpakkingsindustrie',
      title: 'Frames voor',
      highlight: 'verpakkingsmachines.',
      intro: 'Precisieframes uit RVS 316L, gelast en afgewerkt voor machinebouwtoepassingen.'
    },
    seo: {metaTitle: 'Frames voor verpakkingsmachines | Audacious', metaDescription: 'Projectvoorbeeld van Audacious: RVS 316L precisieframes voor verpakkingsmachines.'}
  },
  {
    _id: 'page-project-behuizing',
    title: 'Project: Behuizing',
    slug: 'project-behuizing',
    template: 'default',
    hero: {
      eyebrow: 'Projecten / Engineering',
      title: 'Engineering van een',
      highlight: 'behuizing.',
      intro: 'Engineering en productie van een behuizing in samenwerking met de klant, inclusief interne kantdelen en afmontage.'
    },
    seo: {metaTitle: 'Project behuizing | Audacious', metaDescription: 'Projectvoorbeeld van Audacious: engineering, productie en afmontage van een behuizing.'}
  },
  {
    _id: 'page-project-schuifdeuren',
    title: 'Project: Schuifdeuren / cold corridor',
    slug: 'project-schuifdeuren',
    template: 'default',
    hero: {
      eyebrow: 'Projecten / Cold corridor',
      title: 'Schuifdeuren voor een',
      highlight: 'cold corridor.',
      intro: 'Schuifdeuren voor luchtdichte cold corridors in serverruimtes.'
    },
    seo: {metaTitle: 'Schuifdeuren cold corridor | Audacious', metaDescription: 'Projectvoorbeeld van Audacious: schuifdeuren voor luchtdichte cold corridors in serverruimtes.'}
  },
  {
    _id: 'page-project-transportwagen-kooi',
    title: 'Project: Transportwagen en kooi',
    slug: 'project-transportwagen-kooi',
    template: 'default',
    hero: {
      eyebrow: 'Projecten / Ontwerp en realisatie',
      title: 'Transportwagen en',
      highlight: 'kooi.',
      intro: 'Van digitaal ontwerp naar praktisch maatwerkproduct: transportwagen en kooi.'
    },
    seo: {metaTitle: 'Transportwagen en kooi | Audacious', metaDescription: 'Projectvoorbeeld van Audacious: transportwagen en kooi, van ontwerp tot realisatie.'}
  },
  {
    _id: 'page-nieuws',
    title: 'Nieuws',
    slug: 'nieuws',
    template: 'default',
    hero: {
      eyebrow: 'Nieuws',
      title: 'Bedrijfsupdates van',
      highlight: 'Audacious.',
      intro: 'Nieuws en bedrijfsupdates over certificering, machinepark, transport en productievoorzieningen.'
    },
    seo: {
      metaTitle: 'Nieuws | Audacious Sheet Metal',
      metaDescription: 'Nieuws van Audacious Sheet Metal: ISO 9001, transport, straalcabine, stikstoftank en afzuiging voor de lasersnijmachine.'
    }
  }
]

const categories = [
  {_id: 'blogCategory-certificering', title: 'Certificering', slug: 'certificering'},
  {_id: 'blogCategory-logistiek', title: 'Logistiek', slug: 'logistiek'},
  {_id: 'blogCategory-machinepark', title: 'Machinepark', slug: 'machinepark'},
  {_id: 'blogCategory-afwerking', title: 'Afwerking', slug: 'afwerking'},
  {_id: 'blogCategory-lasersnijden', title: 'Lasersnijden', slug: 'lasersnijden'}
]

const newsItems = [
  {
    _id: 'blogPost-iso-9001-vervolg',
    title: 'ISO 9001 vervolg',
    slug: 'nieuws-iso-9001-vervolg',
    category: 'blogCategory-certificering',
    publishedAt: '2020-12-01T09:00:00.000Z',
    excerpt: 'Na twee dagen audit werd Audacious opnieuw voorgedragen voor het ISO 9001:2015 certificaat.',
    body: [
      block('Na twee dagen audit werd Audacious opnieuw voorgedragen voor het ISO 9001:2015 certificaat.'),
      {_type: 'cardGrid', _key: 'waarom-dit-telt', title: 'Waarom dit telt', intro: 'Bij plaatwerkproductie draait kwaliteit niet alleen om de bewerking, maar ook om voorbereiding, registratie, planning en controle.', items: [
        {title: 'Procesbeheersing', text: 'Een certificeringstraject maakt zichtbaar dat processen gecontroleerd en herhaalbaar ingericht zijn.'},
        {title: 'Leverbetrouwbaarheid', text: 'Voor OEM-klanten is een beheerste organisatie net zo belangrijk als een goed geproduceerd onderdeel.'},
        {title: 'Ketenregie', text: 'Kwaliteitsborging ondersteunt de volledige route van aanvraag tot levering.'}
      ]}
    ],
    seo: {metaTitle: 'ISO 9001 vervolg | Audacious Sheet Metal', metaDescription: 'Audacious werd na een tweedaagse audit opnieuw voorgedragen voor het ISO 9001:2015 certificaat.'}
  },
  {
    _id: 'blogPost-vervanging-klein-transport',
    title: 'Vervanging klein transport',
    slug: 'nieuws-vervanging-klein-transport',
    category: 'blogCategory-logistiek',
    publishedAt: '2020-09-01T09:00:00.000Z',
    excerpt: 'De kleine transportwagen werd vervangen na ruim 300.000 kilometer.',
    body: [
      block('De kleine transportwagen werd vervangen na ruim 300.000 kilometer. Ook logistiek en intern/extern transport zijn onderdeel van betrouwbare levering.'),
      {_type: 'cardGrid', _key: 'logistiek', title: 'Waarom dit telt', intro: 'Voor klanten telt niet alleen het product, maar ook de manier waarop onderdelen en modules betrouwbaar geleverd worden.', items: [
        {title: 'Continuïteit', text: 'Betrouwbaar transport ondersteunt korte lijnen tussen productie, klant en ketenpartners.'},
        {title: 'Planning', text: 'Leveringen sluiten beter aan wanneer logistiek onderdeel is van de orderplanning.'},
        {title: 'Ketenregie', text: 'Transport is een praktische schakel in het leveren van plaatwerkproducten en assemblages.'}
      ]}
    ],
    seo: {metaTitle: 'Vervanging klein transport | Audacious Sheet Metal', metaDescription: 'Audacious verving de kleine transportwagen na ruim 300.000 kilometer.'}
  },
  {
    _id: 'blogPost-nieuwe-glasparel-straalcabine',
    title: 'Nieuwe glasparel straalcabine',
    slug: 'nieuws-nieuwe-glasparel-straalcabine',
    category: 'blogCategory-afwerking',
    publishedAt: '2020-06-01T09:00:00.000Z',
    excerpt: 'Audacious schafte een nieuwe straalkast aan voor het stralen van kleinere werkstukken en producten.',
    body: [
      block('Audacious schafte een nieuwe straalkast aan voor het stralen van kleinere werkstukken en producten.'),
      {_type: 'cardGrid', _key: 'afwerking', title: 'Waarom dit telt', intro: 'Bij plaatwerkproducten bepaalt afwerking vaak hoe een onderdeel functioneert, oogt en gemonteerd wordt.', items: [
        {title: 'Afwerkingscontrole', text: 'Een eigen straalkast maakt afwerking van kleinere delen sneller en beter beheersbaar.'},
        {title: 'Reproduceerbaarheid', text: 'Terugkerende producten kunnen met meer controle op eindkwaliteit worden behandeld.'},
        {title: 'Productkwaliteit', text: 'Afwerking is onderdeel van de totale productroute, niet alleen een laatste stap.'}
      ]}
    ],
    seo: {metaTitle: 'Nieuwe glasparel straalcabine | Audacious Sheet Metal', metaDescription: 'Audacious schafte een nieuwe straalkast aan voor het stralen van kleinere werkstukken en producten.'}
  },
  {
    _id: 'blogPost-grotere-stikstoftank',
    title: 'Plaatsing grotere stikstoftank',
    slug: 'nieuws-grotere-stikstoftank',
    category: 'blogCategory-lasersnijden',
    publishedAt: '2019-11-01T09:00:00.000Z',
    excerpt: 'Audacious stapte over op een grotere stikstoftank voor het lasersnijden.',
    body: [
      block('Audacious stapte over op een grotere stikstoftank voor het lasersnijden. Dit ondersteunt continuïteit, beschikbaarheid en snijprocesbeheersing.'),
      {_type: 'cardGrid', _key: 'stikstof', title: 'Waarom dit telt', intro: 'Lasersnijden vraagt om een stabiele procesomgeving. Gasvoorziening, machinepark en planning beïnvloeden kwaliteit en beschikbaarheid.', items: [
        {title: 'Continuïteit', text: 'Een grotere tank ondersteunt langere en stabielere productieperiodes.'},
        {title: 'Snijkwaliteit', text: 'Procesgas is onderdeel van de totale snijroute en beïnvloedt het eindresultaat.'},
        {title: 'Productieplanning', text: 'Betere beschikbaarheid helpt om orders voorspelbaar te plannen.'}
      ]}
    ],
    seo: {metaTitle: 'Plaatsing grotere stikstoftank | Audacious Sheet Metal', metaDescription: 'Audacious stapte over op een grotere stikstoftank voor het lasersnijden.'}
  },
  {
    _id: 'blogPost-nieuwe-afzuiging-nedermann',
    title: 'Nieuwe afzuiging Nedermann',
    slug: 'nieuws-nieuwe-afzuiging-nedermann',
    category: 'blogCategory-machinepark',
    publishedAt: '2019-09-01T09:00:00.000Z',
    excerpt: 'Audacious plaatste een nieuwe afzuiginstallatie van Nedermann voor de lasersnijmachine.',
    body: [
      block('Audacious plaatste een nieuwe afzuiginstallatie van Nedermann voor de lasersnijmachine.'),
      {_type: 'cardGrid', _key: 'afzuiging', title: 'Waarom dit telt', intro: 'Productievoorzieningen rondom machines zijn onderdeel van procesbeheersing, veiligheid en continuïteit.', items: [
        {title: 'Procesomgeving', text: 'Een goede afzuiging ondersteunt de werkomgeving en het productieproces rond lasersnijden.'},
        {title: 'Continuïteit', text: 'Randapparatuur is nodig om machines stabiel en inzetbaar te houden.'},
        {title: 'Machinepark', text: 'Investeringen rond machines versterken het totale productieproces.'}
      ]}
    ],
    seo: {metaTitle: 'Nieuwe afzuiging Nedermann | Audacious Sheet Metal', metaDescription: 'Audacious plaatste een nieuwe afzuiginstallatie van Nedermann voor de lasersnijmachine.'}
  }
]

for (const page of pages) {
  const doc = {
    _id: page._id,
    _type: 'page',
    title: page.title,
    slug: {_type: 'slug', current: page.slug},
    template: page.template,
    hero: page.hero,
    blocks: [],
    seo: page.seo
  }

  await client.createIfNotExists(doc)
  console.log(`Checked page: ${page.title} (${page.slug})`)
}

for (const category of categories) {
  await client.createIfNotExists({
    _id: category._id,
    _type: 'blogCategory',
    title: category.title,
    slug: {_type: 'slug', current: category.slug}
  })
  console.log(`Checked news category: ${category.title}`)
}

for (const item of newsItems) {
  await client.createIfNotExists({
    _id: item._id,
    _type: 'blogPost',
    title: item.title,
    slug: {_type: 'slug', current: item.slug},
    excerpt: item.excerpt,
    category: {_type: 'reference', _ref: item.category},
    publishedAt: item.publishedAt,
    isFeatured: true,
    body: item.body,
    closingCta: {
      title: 'Terug naar nieuws.',
      button: {label: 'Alle nieuwsitems', linkType: 'internal', internalPage: {_type: 'reference', _ref: 'page-nieuws'}}
    },
    seo: item.seo
  })
  console.log(`Checked news item: ${item.title}`)
}

console.log('Sanity page and news documents checked. Existing documents were not overwritten.')