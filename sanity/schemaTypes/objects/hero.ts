import {defineField, defineType} from 'sanity'

const hideUnlessHomePage = ({document}: {document?: {_type?: string}}) => document?._type !== 'homePage'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Titel', type: 'string', validation: Rule => Rule.required()}),
    defineField({name: 'highlight', title: 'Accentwoord', type: 'string'}),
    defineField({name: 'intro', title: 'Intro', type: 'text', rows: 4}),
    defineField({
      name: 'image',
      title: 'Hero afbeelding',
      type: 'image',
      options: {hotspot: true},
      description: 'Afbeelding voor deze hero. Op de homepage wordt deze gebruikt als fallback/poster wanneer er ook een video is ingesteld.'
    }),
    defineField({
      name: 'videoFile',
      title: 'Hero video bestand (.mp4)',
      type: 'file',
      options: {accept: 'video/mp4,video/webm'},
      description: 'Alleen voor de homepage. Upload hier het bedrijfsfilmpje als hero-achtergrond.',
      hidden: hideUnlessHomePage
    }),
    defineField({
      name: 'videoUrl',
      title: 'Hero video URL',
      type: 'url',
      description: 'Alleen voor de homepage. Gebruik alleen een directe .mp4/.webm URL.',
      hidden: hideUnlessHomePage
    }),
    defineField({
      name: 'videoPoster',
      title: 'Video poster / fallback beeld',
      type: 'image',
      options: {hotspot: true},
      description: 'Alleen voor de homepage. Afbeelding die wordt getoond als de video nog niet geladen is.',
      hidden: hideUnlessHomePage
    }),
    defineField({name: 'primaryCta', title: 'Primaire knop', type: 'cta'}),
    defineField({name: 'secondaryCta', title: 'Secundaire knop', type: 'cta'})
  ]
})