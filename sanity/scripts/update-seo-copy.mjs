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

const seo = (metaTitle, metaDescription) => ({
  _type: 'seo',
  metaTitle,
  metaDescription,
  noIndex: false
})

const patches = [
  {
    id: 'siteSettings',
    set: {
      tagline: 'Voor intelligent plaatwerk',
      seo: seo(
        'Audacious Sheet Metal | Plaatwerk, lassen en assemblage voor OEM',
        'Audacious in Zevenaar ontwikkelt en produceert plaatwerkproducten in RVS, aluminium en staal: lasersnijden, kanten, lassen, oppervlaktebehandeling en assemblage voor industriële OEM-bedrijven.'
      )
    }
  },
  {
    id: 'homePage',
    set: {
      'hero.eyebrow': 'Zevenaar - intelligent plaatwerk',
      'hero.title': 'Voor intelligent\nplaatwerk.',
      'hero.highlight': '',
      'hero.intro': 'Audacious Sheet Metal ontwikkelt en vervaardigt plaatwerkproducten uit RVS, aluminium en staal. Van enkelstuks en kleine series tot gecompliceerd lasersnij-, kant- en laswerk, constructiewerk en complete assemblage.',
      'hero.primaryCta.label': 'Offerte aanvragen',
      'hero.secondaryCta.label': 'Bekijk werkzaamheden',
      introTitle: 'Slim georganiseerd.\nNauwkeurig geproduceerd.',
      introText: 'De kracht van Audacious zit in de organisatie. Door goed voor te bereiden, doelmatig te calculeren en productie slim te plannen, houden we grip op kwaliteit, kosten en levertijd. Niet reageren als het te laat is, maar vooraf sturen op maakbaarheid en betrouwbaarheid.',
      seo: seo(
        'Audacious Sheet Metal | Intelligent plaatwerk voor industriële OEM-bedrijven',
        'Plaatwerkproductie in RVS, aluminium en staal voor OEM-bedrijven. Audacious combineert engineering, lasersnijden, kanten, lassen, oppervlaktebehandeling en assemblage in één gecontroleerde keten.'
      )
    }
  },
  {
    id: 'service-kanten',
    set: {
      intro: 'CNC-kanten en zetten van plaatwerkdelen in RVS, aluminium en staal, met aandacht voor radius, maatvoering, passing en herhaalbaarheid.',
      summary: 'CNC-kanten en zetten van plaatwerkdelen met controle op radius, maatvoering en reproduceerbaarheid.',
      blocks: [textBlock({eyebrow: 'Werkzaamheid', title: 'CNC-kanten voor nauwkeurig plaatwerk', text: 'Bij kanten draait het om meer dan buigen alleen. Radius, uitslag, materiaalrichting en toleranties bepalen of een onderdeel later probleemloos past in de samenstelling. Audacious denkt vooraf mee in maakbaarheid en produceert plaatwerkdelen die passen binnen de volledige keten van snijden, zetten, lassen en assemblage.'})],
      seo: seo('CNC kanten en zetten van plaatwerk | Audacious', 'CNC-kanten en zetten van RVS, aluminium en staal. Audacious produceert nauwkeurige plaatwerkdelen voor OEM-bedrijven, machinebouw en technische assemblages.')
    }
  },
  {
    id: 'service-lasersnijden',
    set: {
      intro: 'Lasersnijden van nauwkeurige contouren en uitslagen in RVS, aluminium en staal, voorbereid op kanten, lassen en assemblage.',
      summary: 'Nauwkeurig lasersnijden van plaatwerkdelen in RVS, aluminium en staal voor verdere bewerking en montage.',
      blocks: [textBlock({eyebrow: 'Werkzaamheid', title: 'Lasersnijden als startpunt van maakbaar plaatwerk', text: 'Een goed lasersnijdeel vormt de basis voor elke vervolgstap. Audacious snijdt uitslagen en contouren met aandacht voor toleranties, materiaalkeuze, braamvorming en de bewerkingen die daarna volgen. Zo sluit lasersnijden aan op kanten, lassen, oppervlaktebehandeling en assemblage.'})],
      seo: seo('Lasersnijden RVS, aluminium en staal | Audacious', 'Lasersnijden van plaatwerkdelen voor OEM-bedrijven. Audacious produceert nauwkeurige uitslagen en contouren in RVS, aluminium en staal.')
    }
  },
  {
    id: 'service-lassen',
    set: {
      intro: 'MIG/MAG- en TIG-laswerk voor plaatwerkconstructies, frames, behuizingen en samengestelde modules.',
      summary: 'Laswerk voor plaatwerkconstructies, frames, behuizingen en technische samenstellingen.',
      blocks: [textBlock({eyebrow: 'Werkzaamheid', title: 'Laswerk voor plaatwerkconstructies en modules', text: 'Lassen vraagt om beheersing van passing, warmte-inbreng en nabewerking. Audacious combineert laswerk met plaatbewerking en assemblage, zodat constructies, frames en behuizingen niet als losse onderdelen worden benaderd, maar als complete samenstelling.'})],
      seo: seo('Lassen van plaatwerkconstructies | Audacious', 'MIG/MAG- en TIG-laswerk voor RVS, aluminium en staal. Audacious last plaatwerkconstructies, frames, behuizingen en samengestelde modules.')
    }
  },
  {
    id: 'service-walsen',
    set: {
      intro: 'Walsen van radiusdelen, ronde vormen en gebogen plaatwerkcomponenten voor technische constructies en modules.',
      summary: 'Walsen van gebogen plaatwerkdelen, radiusdelen en ronde componenten voor technische toepassingen.',
      blocks: [textBlock({eyebrow: 'Werkzaamheid', title: 'Walsen voor gevormde plaatwerkdelen', text: 'Voor gebogen plaatdelen is controle over radius, materiaalgedrag en maatvoering essentieel. Audacious past walsen toe waar ronde vormen, technische kappen of constructieve componenten onderdeel zijn van een grotere samenstelling.'})],
      seo: seo('Walsen van plaatwerk | Audacious', 'Walsen van RVS, aluminium en staal voor radiusdelen, ronde vormen en technische plaatwerkcomponenten.')
    }
  },
  {
    id: 'service-persen',
    set: {
      intro: 'Pers- en vormbewerkingen voor plaatwerkdelen waarbij passing, functionaliteit en herhaalbaarheid bepalend zijn.',
      summary: 'Persen en vormen van plaatwerkdelen voor functionele, reproduceerbare onderdelen.',
      blocks: [textBlock({eyebrow: 'Werkzaamheid', title: 'Persen en vormen met controle op functie', text: 'Persbewerkingen worden ingezet wanneer vorm en functie direct samenhangen. Audacious beoordeelt vooraf welke bewerking nodig is en hoe die past binnen de rest van het productieproces, zodat onderdelen reproduceerbaar en montageklaar geproduceerd worden.'})],
      seo: seo('Persen en vormen van plaatwerk | Audacious', 'Pers- en vormbewerkingen voor plaatwerkdelen in RVS, aluminium en staal. Gericht op passing, functie en reproduceerbaarheid.')
    }
  },
  {
    id: 'service-oppervlaktebehandelingen',
    set: {
      intro: 'Coördinatie van oppervlaktebehandelingen zoals poedercoaten, verzinken, beitsen en passiveren via vaste specialistische partners.',
      summary: 'Oppervlaktebehandeling gecoördineerd binnen de plaatwerkketen: poedercoaten, verzinken, beitsen en passiveren.',
      blocks: [textBlock({eyebrow: 'Werkzaamheid', title: 'Oppervlaktebehandeling als onderdeel van de keten', text: 'Afwerking bepaalt mede de levensduur, uitstraling en toepasbaarheid van een plaatwerkproduct. Audacious stemt oppervlaktebehandelingen af met vaste partners en bewaakt planning, specificaties en aansluiting op assemblage en levering.'})],
      seo: seo('Oppervlaktebehandeling plaatwerk | Audacious', 'Coördinatie van poedercoaten, verzinken, beitsen, passiveren en andere oppervlaktebehandelingen voor plaatwerkproducten.')
    }
  },
  {
    id: 'service-assembleren',
    set: {
      intro: 'Assemblage van losse plaatwerkdelen tot complete samenstellingen, submodules en montageklare producten.',
      summary: 'Van losse plaatwerkdelen naar complete samenstellingen, submodules en montageklare producten.',
      blocks: [textBlock({eyebrow: 'Werkzaamheid', title: 'Assemblage van plaatwerk tot complete module', text: 'Audacious levert niet alleen losse plaatdelen, maar ook samengestelde producten. Door engineering, plaatbewerking, laswerk, oppervlaktebehandeling en montage op elkaar af te stemmen, ontstaat één gecontroleerde route van tekening tot module.'})],
      seo: seo('Assemblage van plaatwerkmodules | Audacious', 'Assemblage van plaatwerkdelen tot complete samenstellingen, submodules en montageklare producten voor industriële OEM-bedrijven.')
    }
  },
  {
    id: 'market-halfgeleiderindustrie',
    set: {
      intro: 'Precisieplaatwerk en technische samenstellingen voor omgevingen waar reproduceerbaarheid, traceerbaarheid en leverbetrouwbaarheid cruciaal zijn.',
      seo: seo('Plaatwerk voor de halfgeleiderindustrie | Audacious', 'Precisieplaatwerk, behuizingen en modules voor de halfgeleiderindustrie. Geproduceerd met aandacht voor reproduceerbaarheid, traceerbaarheid en kwaliteit.')
    }
  },
  {
    id: 'market-medische-industrie',
    set: {
      intro: 'RVS en aluminium plaatwerk voor medische en technische toepassingen waar afwerking, reinigbaarheid en betrouwbaarheid zwaar wegen.',
      seo: seo('Plaatwerk voor de medische industrie | Audacious', 'RVS en aluminium plaatwerk voor medische toepassingen, behuizingen en technische samenstellingen met hoge eisen aan afwerking en betrouwbaarheid.')
    }
  },
  {
    id: 'market-voedingsmiddelenindustrie',
    set: {
      intro: 'RVS plaatwerk en samenstellingen voor productieomgevingen waar hygiëne, reinigbaarheid, materiaalkeuze en afwerking bepalend zijn.',
      seo: seo('RVS plaatwerk voor de voedingsmiddelenindustrie | Audacious', 'RVS plaatwerk, kappen, frames en samenstellingen voor food-productieomgevingen met hoge eisen aan hygiëne, materiaalkeuze en afwerking.')
    }
  },
  {
    id: 'market-drank-en-zuivelindustrie',
    set: {
      intro: 'RVS plaatwerk, kappen en modules voor natte procesomgevingen in de drank- en zuivelindustrie.',
      seo: seo('RVS plaatwerk voor drank- en zuivelindustrie | Audacious', 'Plaatwerk en modules voor drank- en zuivelinstallaties. RVS, laswerk, afwerking en assemblage voor natte procesomgevingen.')
    }
  },
  {
    id: 'market-verpakkingsindustrie',
    set: {
      intro: 'Plaatwerkdelen, frames, omkastingen en modules voor verpakkingsmachines en industriële productielijnen.',
      seo: seo('Plaatwerk voor verpakkingsmachines | Audacious', 'Technisch plaatwerk, machineframes, omkastingen en modules voor verpakkingsmachines en productielijnen.')
    }
  },
  {
    id: 'market-bouw-en-meubelindustrie',
    set: {
      intro: 'Functioneel en zichtbaar plaatwerk waarbij vormgeving, afwerking en seriematige maakbaarheid samenkomen.',
      seo: seo('Zichtwerk en plaatwerk voor bouw en meubelindustrie | Audacious', 'Functioneel en zichtbaar plaatwerk voor bouw- en meubeltoepassingen, met aandacht voor vormgeving, afwerking en maakbaarheid.')
    }
  },
  {
    id: 'product-omkastingen',
    set: {
      intro: 'Omkastingen voor machines, installaties en technische modules, geproduceerd in RVS, aluminium of staal.',
      seo: seo('Plaatwerk omkastingen voor machines | Audacious', 'Plaatwerk omkastingen voor machines, installaties en technische modules. Geproduceerd in RVS, aluminium en staal.')
    }
  },
  {
    id: 'product-behuizingen',
    set: {
      intro: 'Technische behuizingen waarbij passing, montage, ventilatie, afwerking en materiaalkeuze vooraf worden meegenomen.',
      seo: seo('Technische behuizingen in plaatwerk | Audacious', 'Technische behuizingen in RVS, aluminium en staal, afgestemd op functie, montage, afwerking en maakbaarheid.')
    }
  },
  {
    id: 'product-machineframes',
    set: {
      intro: 'Machineframes en constructies voor industriële toepassingen, afgestemd op sterkte, maatvoering en montage.',
      seo: seo('Machineframes en plaatwerkconstructies | Audacious', 'Machineframes en constructieve plaatwerkdelen voor machinebouw en industriële toepassingen.')
    }
  },
  {
    id: 'product-samengestelde-modules',
    set: {
      intro: 'Samengestelde modules waarin plaatwerk, laswerk, oppervlaktebehandeling, montage en logistiek samenkomen.',
      seo: seo('Samengestelde plaatwerkmodules | Audacious', 'Complete plaatwerkmodules inclusief productie, afwerking, montage en logistieke afstemming voor OEM-bedrijven.')
    }
  },
  {
    id: 'product-designproducten',
    set: {
      intro: 'Zichtwerk en maatwerkproducten waarbij vorm, materiaal, afwerking en produceerbaarheid bepalend zijn.',
      seo: seo('Design plaatwerk en zichtwerk | Audacious', 'Designproducten en zichtbaar plaatwerk in RVS, aluminium en staal met aandacht voor vorm, afwerking en maakbaarheid.')
    }
  },
  {
    id: 'page-over-ons',
    set: {
      'hero.eyebrow': 'Over Audacious',
      'hero.title': 'Plaatwerkproductie met ketenregie.',
      'hero.intro': 'Audacious combineert engineering, plaatbewerking, laswerk, oppervlaktebehandeling en assemblage in één gecontroleerd productieproces.',
      seo: seo('Over Audacious Sheet Metal | Plaatwerk met ketenregie', 'Audacious is productiepartner voor plaatwerk in RVS, aluminium en staal. Van engineering en bewerking tot lassen, afwerking en assemblage.')
    }
  },
  {
    id: 'page-contact',
    set: {
      'hero.eyebrow': 'Contact',
      'hero.title': 'Leg je plaatwerkvraag direct bij Audacious.',
      'hero.intro': 'Stuur een tekening, STEP-file of omschrijving mee. Dan kijken we gericht naar materiaal, maakbaarheid, bewerking, afwerking en serieomvang.',
      seo: seo('Contact met Audacious Sheet Metal | Offerte plaatwerk', 'Neem contact op met Audacious in Zevenaar voor plaatwerk, lasersnijden, kanten, lassen, assemblage of technische afstemming.')
    }
  },
  {
    id: 'page-werkzaamheden',
    set: {
      'hero.eyebrow': 'Werkzaamheden',
      'hero.title': 'Plaatbewerking van tekening tot assemblage.',
      'hero.intro': 'Audacious verzorgt lasersnijden, kanten, lassen, walsen, persen, oppervlaktebehandeling en assemblage binnen één gecontroleerde plaatwerkketen.',
      seo: seo('Werkzaamheden | Lasersnijden, kanten, lassen en assemblage', 'Bekijk de werkzaamheden van Audacious: lasersnijden, kanten, lassen, walsen, persen, oppervlaktebehandeling en assemblage voor plaatwerkproducten.')
    }
  },
  {
    id: 'page-markten',
    set: {
      'hero.eyebrow': 'Markten',
      'hero.title': 'Plaatwerk voor veeleisende industrieën.',
      'hero.intro': 'Audacious levert plaatwerkoplossingen voor onder meer halfgeleiderindustrie, medische industrie, food, zuivel, verpakkingsindustrie, bouw en meubel.',
      seo: seo('Markten | Plaatwerk voor industrie en machinebouw', 'Plaatwerkoplossingen voor halfgeleiderindustrie, medische industrie, food, zuivel, verpakkingsindustrie, bouw en meubel.')
    }
  },
  {
    id: 'page-producten',
    set: {
      'hero.eyebrow': 'Producten',
      'hero.title': 'Van plaatdeel tot complete module.',
      'hero.intro': 'Audacious produceert omkastingen, behuizingen, machineframes, plaatwerkframes, designproducten en samengestelde modules.',
      seo: seo('Producten | Omkastingen, behuizingen en modules', 'Plaatwerkproducten van Audacious: omkastingen, behuizingen, machineframes, plaatwerkframes, designproducten en samengestelde modules.')
    }
  },
  {
    id: 'page-blog',
    set: {
      'hero.eyebrow': 'Kennisbank',
      'hero.title': 'Praktische kennis over plaatwerk en maakbaarheid.',
      'hero.intro': 'Artikelen over engineering, materiaalkeuze, lasersnijden, kanten, lassen, assemblage, planning en ketenregie.',
      seo: seo('Blog | Plaatwerk, maakbaarheid en productieplanning', 'Lees artikelen van Audacious over plaatwerk, maakbaarheid, materiaalkeuze, lasersnijden, kanten, lassen, assemblage en ketenregie.')
    }
  }
]

async function run() {
  let transaction = client.transaction()

  for (const patch of patches) {
    transaction = transaction.patch(client.patch(patch.id).set(patch.set))
  }

  await transaction.commit({visibility: 'sync'})
  console.log(`SEO/copy update uitgevoerd voor ${patches.length} documenten.`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
