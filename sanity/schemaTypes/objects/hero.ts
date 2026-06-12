import {defineField, defineType} from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Titel', type: 'string', validation: Rule => Rule.required()}),
    defineField({name: 'highlight', title: 'Accentwoord', type: 'string'}),
    defineField({name: 'intro', title: 'Intro', type: 'text', rows: 4}),
    defineField({name: 'image', title: 'Afbeelding', type: 'image', options: {hotspot: true}}),
    defineField({name: 'primaryCta', title: 'Primaire knop', type: 'cta'}),
    defineField({name: 'secondaryCta', title: 'Secundaire knop', type: 'cta'})
  ]
})
