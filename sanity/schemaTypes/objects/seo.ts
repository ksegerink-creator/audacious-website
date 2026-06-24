import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({name: 'metaTitle', title: 'SEO titel', type: 'string', description: 'Korte titel voor zoekmachines.'}),
    defineField({name: 'metaDescription', title: 'SEO beschrijving', type: 'text', rows: 3, description: 'Korte beschrijving voor zoekmachines.'}),
    defineField({name: 'ogImage', title: 'Afbeelding voor delen', type: 'image', options: {hotspot: true}}),
    defineField({name: 'noIndex', title: 'Verbergen voor zoekmachines', type: 'boolean', initialValue: false})
  ]
})
