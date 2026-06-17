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
      name: 'videoFile',
      title: 'Hero video bestand (.mp4)',
      type: 'file',
      options: {accept: 'video/mp4,video/webm'},
      description: 'Upload hier het bedrijfsfilmpje. Dit bestand vervangt de hero-afbeelding op de homepage.'
    }),
    defineField({
      name: 'videoUrl',
      title: 'Hero video URL',
      type: 'url',
      description: 'Optioneel: gebruik alleen als de video al online staat als directe .mp4/.webm URL.'
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