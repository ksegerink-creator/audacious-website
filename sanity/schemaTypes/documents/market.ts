import {defineArrayMember, defineField, defineType} from 'sanity'

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
    defineField({name: 'relatedServices', title: 'Gerelateerde werkzaamheden', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})]}),
    defineField({name: 'blocks', title: 'Contentblokken', type: 'array', of: [defineArrayMember({type: 'textBlock'}), defineArrayMember({type: 'imageBlock'}), defineArrayMember({type: 'imageTextBlock'}), defineArrayMember({type: 'specList'}), defineArrayMember({type: 'faqBlock'})]}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'})
  ],
  orderings: [{title: 'Volgorde', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'slug.current', media: 'image'}}
})
