import {defineField, defineType} from 'sanity'

const hideUnlessHomePage = ({document}: {document?: {_type?: string}}) => document?._type !== 'homePage'

export const hero = defineType({
  name: 'hero',
  title: 'Bovenste deel van de pagina',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Kleine oranje tekst boven de titel',
      type: 'string',
      description: 'Bijvoorbeeld: WERKZAAMHEDEN, INTRO of AUDACIOUS.'
    }),
    defineField({
      name: 'title',
      title: 'Grote titel bovenaan',
      type: 'string',
      description: 'Dit is de grootste titel bovenaan de pagina.',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'highlight',
      title: 'Oranje deel van de titel',
      type: 'string',
      description: 'Optioneel. Dit tekstdeel wordt als accent/oranje weergegeven.'
    }),
    defineField({
      name: 'intro',
      title: 'Intro onder de grote titel',
      type: 'text',
      rows: 4,
      description: 'Korte uitleg direct onder de titel. Houd dit bij voorkeur op 1 tot 3 zinnen.'
    }),
    defineField({
      name: 'image',
      title: 'Afbeelding bovenaan',
      type: 'image',
      options: {hotspot: true},
      description: 'Deze afbeelding wordt gebruikt in de hero van deze pagina.'
    }),
    defineField({
      name: 'videoFile',
      title: 'Homepage video bestand',
      type: 'file',
      options: {accept: 'video/mp4,video/webm'},
      description: 'Alleen voor de homepage. Upload hier het bedrijfsfilmpje als achtergrondvideo.',
      hidden: hideUnlessHomePage
    }),
    defineField({
      name: 'videoUrl',
      title: 'Homepage video URL',
      type: 'url',
      description: 'Alleen voor de homepage. Gebruik alleen een directe .mp4/.webm URL.',
      hidden: hideUnlessHomePage
    }),
    defineField({
      name: 'videoPoster',
      title: 'Afbeelding als video niet geladen is',
      type: 'image',
      options: {hotspot: true},
      description: 'Alleen voor de homepage. Fallback-afbeelding voordat de video geladen is.',
      hidden: hideUnlessHomePage
    }),
    defineField({name: 'primaryCta', title: 'Eerste knop bovenaan', type: 'cta'}),
    defineField({name: 'secondaryCta', title: 'Tweede knop bovenaan', type: 'cta'})
  ]
})
