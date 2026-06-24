import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-02-19'})

await client
  .patch('homePage')
  .set({
    processEyebrow: 'Over ons',
    processTitle: 'Voorbereiden, produceren\nen regisseren.',
    processText: 'Audacious kijkt vooraf naar maakbaarheid, materiaal, lasnaden, afwerking en productieroute. Zo blijven kwaliteit, kosten en levertijd beheersbaar, juist bij enkelstuks en kleine series.',
    processTags: ['Korte steltijden', 'ERP-planning', 'Barcodes per order', 'Ketenregie'],
    processPanelTitle: 'Hoe het proces werkt',
    processPanelIntro: 'Compact ingericht voor enkelstuks, kleine series en samengestelde producten.',
    processPanelCode: 'PROCESS / 01-04',
    processItems: [
      {
        _key: 'process-step-1',
        _type: 'object',
        stepLabel: 'Stap 1',
        title: 'Maakbaarheid beoordelen',
        text: 'Controle op plaatdikte, buigradius, toleranties, lasnaden en materiaalkeuze.'
      },
      {
        _key: 'process-step-2',
        _type: 'object',
        stepLabel: 'Stap 2',
        title: 'CAD/CAM voorbereiden',
        text: '3D CAD, STEP-controle, nesting en NC-programmering voor laser en kantbank.'
      },
      {
        _key: 'process-step-3',
        _type: 'object',
        stepLabel: 'Stap 3',
        title: 'Plaatwerk produceren',
        text: 'Lasersnijden, kanten, walsen, persen, lassen en afwerken volgens de gekozen route.'
      },
      {
        _key: 'process-step-4',
        _type: 'object',
        stepLabel: 'Stap 4',
        title: 'Assembleren en leveren',
        text: 'Mechanische montage, cleanroom verpakken, afstemming met partners en levering van mono-deel tot samenstelling.'
      }
    ]
  })
  .commit()

console.log('Homepage over ons / procesblok is gevuld in Sanity.')
