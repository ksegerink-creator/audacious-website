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
      name: 'heroPanel',
      title: 'Hero rechterblok / specificaties',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Label bovenin beeldblok', type: 'string'}),
        defineField({name: 'title', title: 'Titel in beeldblok', type: 'string'}),
        defineField({name: 'text', title: 'Tekst in beeldblok', type: 'text', rows: 3}),
        defineField({name: 'panelLabel', title: 'Specificatieblok label links', type: 'string'}),
        defineField({name: 'panelCode', title: 'Specificatieblok label rechts', type: 'string'}),
        defineField({
          name: 'rows',
          title: 'Specificatieregels',
          type: 'array',
          of: [defineArrayMember({type: 'object', fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'value', title: 'Waarde', type: 'string'})
          ]})]
        })
      ]
    }),
    defineField({name: 'galleryEyebrow', title: 'Galerij label', type: 'string', initialValue: 'Projectfoto’s'}),
    defineField({name: 'galleryTitle', title: 'Galerij titel', type: 'string', initialValue: 'Beeld van het project.'}),
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
      description: 'Wanneer je hier blokken toevoegt, worden de vaste tekstsecties op de pagina vervangen door deze CMS-content.',
      type: 'array',
      of: editableBlocks
    }),
    defineField({
      name: 'closingCta',
      title: 'Onderste CTA',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Titel', type: 'string'}),
        defineField({name: 'button', title: 'Knop', type: 'cta'})
      ]
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'})
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}}
})