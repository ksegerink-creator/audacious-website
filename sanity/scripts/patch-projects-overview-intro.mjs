import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-02-19'})

const page = await client.fetch('*[_type == "page" && slug.current == "projecten"][0]{_id}')

if (!page?._id) {
  throw new Error('Projecten overzicht niet gevonden in Sanity.')
}

await client.patch(page._id).set({
  projectOverview: {
    eyebrow: 'Selectie',
    title: 'Concrete toepassingen uit de praktijk.',
    intro: 'Deze projecten tonen hoe toepassing, materiaal, afwerking en montage samen de productieroute bepalen.',
    tags: ['Frames', 'RVS', 'Behuizingen', 'Assemblage', 'Engineering']
  }
}).commit()

console.log('Projectenblok is nu bewerkbaar gevuld in Sanity.')
