import {defineArrayMember, defineField, defineType} from 'sanity'

const editableBlocks = [
  defineArrayMember({type: 'textBlock'}),
  defineArrayMember({type: 'imageBlock'}),
  defineArrayMember({type: 'imageTextBlock'}),
  defineArrayMember({type: 'specList'}),
  defineArrayMember({type: 'cardGrid'}),
  defineArrayMember({type: 'ctaBlock'}),
  defineArrayMember({type: 'faqBlock'})
]

export const market = defineType({
  name: 'market',
  title: 'Markt',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string', validation: Rule => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, validation: Rule => Rule.required()}),
    defineField({name: 'order', title: 'Volgorde', type: 'number'}),
    defineField({name: 'intro', title: 'Intro', type: 'text', rows: 4}),
    defineField({name: 'image', title: 'Afbeelding', type: 'image', options: {hotspot: true}}),
    defineField({name: 'heroPanel', title: 'Hero rechterblok / specificaties', type: 'object', fields: [
      defineField({name: 'eyebrow', title: 'Label bovenin beeldblok', type: 'string'}),
      defineField({name: 'title', title: 'Titel in beeldblok', type: 'string'}),
      defineField({name: 'text', title: 'Tekst in beeldblok', type: 'text', rows: 3}),
      defineField({name: 'panelLabel', title: 'Specificatieblok label links', type: 'string'}),
      defineField({name: 'panelCode', title: 'Specificatieblok label rechts', type: 'string'}),
      defineField({name: 'rows', title: 'Specificatieregels', type: 'array', of: [defineArrayMember({type: 'object', fields: [defineField({name: 'label', title: 'Label', type: 'string'}), defineField({name: 'value', title: 'Waarde', type: 'string'})]})]})
    ]}),
    defineField({name: 'relatedServices', title: 'Gerelateerde werkzaamheden', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})]}),
    defineField({name: 'blocks', title: 'Contentblokken', description: 'Wanneer je hier blokken toevoegt, worden de vaste tekstsecties op de detailpagina vervangen door deze CMS-content.', type: 'array', of: editableBlocks}),
    defineField({name: 'galleryEyebrow', title: 'Galerij label', type: 'string'}),
    defineField({name: 'galleryTitle', title: 'Galerij titel', type: 'string'}),
    defineField({name: 'galleryImages', title: 'Extra foto’s / galerij', type: 'array', of: [defineArrayMember({type: 'image', options: {hotspot: true}, fields: [defineField({name: 'alt', title: 'Alt-tekst', type: 'string'}), defineField({name: 'caption', title: 'Bijschrift', type: 'string'})]})]}),
    defineField({name: 'closingCta', title: 'Onderste CTA', type: 'object', fields: [defineField({name: 'title', title: 'Titel', type: 'string'}), defineField({name: 'button', title: 'Knop', type: 'cta'})]}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'})
  ],
  orderings: [{title: 'Volgorde', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'slug.current', media: 'image'}}
})