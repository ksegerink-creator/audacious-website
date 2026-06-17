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
    defineField({name: 'image', title: 'Fallback afbeelding', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'videoUrl',
      title: 'Hero video URL',
      type: 'url',
      description: 'Plaats hier een directe .mp4/.webm video-url. Deze video vervangt de hero-afbeelding op de homepage.'
    }),
    defineField({
      name: 'videoPoster',
      title: 'Video poster / fallback beeld',
      type: 'image',
      options: {hotspot: true},
      description: 'Afbeelding die wordt getoond als de video nog niet geladen is.'
    }),
    defineField({name: 'primaryCta', title: 'Primaire knop', type: 'cta'}),
    defineField({name: 'secondaryCta', title: 'Secundaire knop', type: 'cta'})
  ]
})