import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-02-19'})

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
      title: 'Voorbeelden van',
      highlight: 'plaatwerkprojecten.',
      intro: 'Voorbeelden van producten en projecten: frames, RVS 316L behuizingen, een röntgenarm, verpakkingsmachineframes, engineeringwerk, schuifdeuren en transportwagens.'
    },
    seo: {
      metaTitle: 'Projecten | Audacious Sheet Metal',
      metaDescription: 'Projecten van Audacious: food-frame, RVS 316L behuizingen, röntgenarm, verpakkingsmachineframes, engineering behuizing, schuifdeuren en transportwagen.'
    }
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

console.log('Sanity page documents checked. Existing documents were not overwritten.')
