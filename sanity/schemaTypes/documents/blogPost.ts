import {defineArrayMember, defineField, defineType} from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Nieuwsitem',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string', validation: Rule => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, validation: Rule => Rule.required()}),
    defineField({name: 'excerpt', title: 'Intro / samenvatting', type: 'text', rows: 4}),
    defineField({name: 'featuredImage', title: 'Afbeelding', type: 'image', options: {hotspot: true}}),
    defineField({name: 'category', title: 'Categorie', type: 'reference', to: [{type: 'blogCategory'}]}),
    defineField({name: 'publishedAt', title: 'Publicatiedatum', type: 'datetime'}),
    defineField({name: 'isFeatured', title: 'Uitlichten op nieuwsoverzicht', type: 'boolean', initialValue: false}),
    defineField({
      name: 'body',
      title: 'Nieuwsinhoud',
      type: 'array',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({type: 'imageBlock'}),
        defineArrayMember({type: 'imageTextBlock'}),
        defineArrayMember({type: 'specList'}),
        defineArrayMember({type: 'cardGrid'}),
        defineArrayMember({type: 'ctaBlock'})
      ]
    }),
    defineField({name: 'galleryEyebrow', title: 'Galerij label', type: 'string'}),
    defineField({name: 'galleryTitle', title: 'Galerij titel', type: 'string'}),
    defineField({name: 'galleryImages', title: 'Extra foto’s / galerij', type: 'array', of: [defineArrayMember({type: 'image', options: {hotspot: true}, fields: [defineField({name: 'alt', title: 'Alt-tekst', type: 'string'}), defineField({name: 'caption', title: 'Bijschrift', type: 'string'})]})]}),
    defineField({name: 'closingCta', title: 'Onderste CTA', type: 'object', fields: [defineField({name: 'title', title: 'Titel', type: 'string'}), defineField({name: 'button', title: 'Knop', type: 'cta'})]}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'})
  ],
  orderings: [{title: 'Nieuwste eerst', name: 'publishedAtDesc', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'category.title', media: 'featuredImage'}}
})