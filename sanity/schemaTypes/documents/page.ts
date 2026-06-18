import {defineArrayMember, defineField, defineType} from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Pagina',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string', validation: Rule => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, validation: Rule => Rule.required()}),
    defineField({
      name: 'template',
      title: 'Template',
      type: 'string',
      options: {list: [
        {title: 'Standaard pagina', value: 'default'},
        {title: 'Over ons', value: 'about'},
        {title: 'Contact', value: 'contact'},
        {title: 'Landingpage', value: 'landing'}
      ]},
      initialValue: 'default'
    }),
    defineField({name: 'hero', title: 'Hero', type: 'hero'}),
    defineField({
      name: 'galleryImages',
      title: 'Extra foto’s / galerij',
      description: 'Optioneel. Gebruik dit vooral voor projectdetailpagina’s. De foto’s verschijnen automatisch als galerij op de pagina.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', title: 'Alt-tekst', type: 'string'}),
            defineField({name: 'caption', title: 'Bijschrift', type: 'string'})
          ]
        })
      ]
    }),
    defineField({
      name: 'blocks',
      title: 'Contentblokken',
      type: 'array',
      of: [
        defineArrayMember({type: 'textBlock'}),
        defineArrayMember({type: 'imageBlock'}),
        defineArrayMember({type: 'imageTextBlock'}),
        defineArrayMember({type: 'specList'}),
        defineArrayMember({type: 'faqBlock'})
      ]
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'})
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}}
})