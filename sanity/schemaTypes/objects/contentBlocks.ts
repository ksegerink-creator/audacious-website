import {defineArrayMember, defineField, defineType} from 'sanity'

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Tekstblok',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'text', title: 'Tekst', type: 'array', of: [defineArrayMember({type: 'block'})]})
  ],
  preview: {select: {title: 'title', subtitle: 'eyebrow'}}
})

export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Afbeelding',
  type: 'object',
  fields: [
    defineField({name: 'image', title: 'Afbeelding', type: 'image', options: {hotspot: true}, validation: Rule => Rule.required()}),
    defineField({name: 'alt', title: 'Alt-tekst', type: 'string'}),
    defineField({name: 'caption', title: 'Bijschrift', type: 'string'})
  ],
  preview: {select: {title: 'caption', media: 'image'}, prepare: ({title, media}) => ({title: title || 'Afbeelding', media})}
})

export const imageTextBlock = defineType({
  name: 'imageTextBlock',
  title: 'Afbeelding + tekst',
  type: 'object',
  fields: [
    defineField({name: 'image', title: 'Afbeelding', type: 'image', options: {hotspot: true}}),
    defineField({name: 'imagePosition', title: 'Afbeeldingspositie', type: 'string', options: {list: [{title: 'Links', value: 'left'}, {title: 'Rechts', value: 'right'}], layout: 'radio'}, initialValue: 'right'}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'text', title: 'Tekst', type: 'array', of: [defineArrayMember({type: 'block'})]}),
    defineField({name: 'cta', title: 'CTA', type: 'cta'})
  ],
  preview: {select: {title: 'title', subtitle: 'eyebrow', media: 'image'}}
})

export const specList = defineType({
  name: 'specList',
  title: 'Specificatielijst',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'intro', title: 'Intro', type: 'text', rows: 3}),
    defineField({
      name: 'items',
      title: 'Specificaties',
      type: 'array',
      of: [defineArrayMember({type: 'object', fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({name: 'value', title: 'Waarde', type: 'string'})
      ]})]
    })
  ],
  preview: {select: {title: 'title'}, prepare: ({title}) => ({title: title || 'Specificatielijst'})}
})

export const cardGrid = defineType({
  name: 'cardGrid',
  title: 'Kaartenblok',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'intro', title: 'Intro', type: 'text', rows: 3}),
    defineField({
      name: 'items',
      title: 'Kaarten',
      type: 'array',
      of: [defineArrayMember({type: 'object', fields: [
        defineField({name: 'title', title: 'Titel', type: 'string'}),
        defineField({name: 'text', title: 'Tekst', type: 'text', rows: 3}),
        defineField({name: 'cta', title: 'Link / knop', type: 'cta'})
      ]})]
    })
  ],
  preview: {select: {title: 'title', subtitle: 'eyebrow'}, prepare: ({title, subtitle}) => ({title: title || 'Kaartenblok', subtitle})}
})

export const ctaBlock = defineType({
  name: 'ctaBlock',
  title: 'CTA blok',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({name: 'text', title: 'Tekst', type: 'text', rows: 3}),
    defineField({name: 'cta', title: 'Knop', type: 'cta'})
  ],
  preview: {select: {title: 'title', subtitle: 'eyebrow'}, prepare: ({title, subtitle}) => ({title: title || 'CTA blok', subtitle})}
})

export const faqBlock = defineType({
  name: 'faqBlock',
  title: 'FAQ blok',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string'}),
    defineField({
      name: 'items',
      title: 'Vragen',
      type: 'array',
      of: [defineArrayMember({type: 'object', fields: [
        defineField({name: 'question', title: 'Vraag', type: 'string'}),
        defineField({name: 'answer', title: 'Antwoord', type: 'text', rows: 4})
      ]})]
    })
  ],
  preview: {select: {title: 'title'}, prepare: ({title}) => ({title: title || 'FAQ blok'})}
})