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