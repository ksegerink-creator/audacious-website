import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({name: 'metaTitle', title: 'Meta title', type: 'string'}),
    defineField({name: 'metaDescription', title: 'Meta description', type: 'text', rows: 3}),
    defineField({name: 'ogImage', title: 'Social image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'noIndex', title: 'Niet indexeren', type: 'boolean', initialValue: false})
  ]
})
