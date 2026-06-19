import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-02-19'})

const block = (text) => ({
  _type: 'block',
  _key: text.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30) || 'block',
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: 'span', text, marks: []}]
})

const newsContent = [
  {
    id: 'blogPost-iso-9001-vervolg',
    body: [
      {
        _type: 'textBlock',
        _key: 'nieuwsinhoud',
        title: 'Nieuwsbericht',
        text: [
          block('Na twee dagen audit werd Audacious opnieuw voorgedragen voor het ISO 9001:2015 certificaat.'),
          block('Het bericht gaat over de voortzetting van de kwaliteitscertificering en de manier waarop Audacious processen, productievoorbereiding en controle organiseert.')
        ]
      }
    ]
  },
  {
    id: 'blogPost-vervanging-klein-transport',
    body: [
      {
        _type: 'textBlock',
        _key: 'nieuwsinhoud',
        title: 'Nieuwsbericht',
        text: [
          block('De kleine transportwagen werd vervangen na ruim 300.000 kilometer.'),
          block('Met deze vervanging blijft ook het praktische transport rondom levering, klantcontact en ketenpartners op orde.')
        ]
      }
    ]
  },
  {
    id: 'blogPost-nieuwe-glasparel-straalcabine',
    body: [
      {
        _type: 'textBlock',
        _key: 'nieuwsinhoud',
        title: 'Nieuwsbericht',
        text: [
          block('Audacious schafte een nieuwe straalkast aan voor het stralen van kleinere werkstukken en producten.'),
          block('De glasparel straalcabine ondersteunt een nette en reproduceerbare afwerking van kleinere onderdelen.')
        ]
      }
    ]
  },
  {
    id: 'blogPost-grotere-stikstoftank',
    body: [
      {
        _type: 'textBlock',
        _key: 'nieuwsinhoud',
        title: 'Nieuwsbericht',
        text: [
          block('Audacious stapte over op een grotere stikstoftank voor het lasersnijden.'),
          block('Een grotere stikstofvoorziening ondersteunt continuïteit, beschikbaarheid en beheersing van het snijproces.')
        ]
      }
    ]
  },
  {
    id: 'blogPost-nieuwe-afzuiging-nedermann',
    body: [
      {
        _type: 'textBlock',
        _key: 'nieuwsinhoud',
        title: 'Nieuwsbericht',
        text: [
          block('Audacious plaatste een nieuwe afzuiginstallatie van Nedermann voor de lasersnijmachine.'),
          block('De afzuiginstallatie ondersteunt de procesomgeving rond lasersnijden en hoort bij een stabiel en goed onderhouden machinepark.')
        ]
      }
    ]
  }
]

for (const item of newsContent) {
  await client
    .patch(item.id)
    .set({body: item.body})
    .commit()

  console.log(`Updated news content: ${item.id}`)
}

console.log('News item content patched. Card blocks have been replaced by article text.')
