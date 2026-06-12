import {defineArrayMember, defineField, defineType} from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blogartikel',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string', validation: Rule => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, validation: Rule => Rule.required()}),
    defineField({name: 'excerpt', title: 'Intro / excerpt', type: 'text', rows: 4}),
    defineField({name: 'featuredImage', title: 'Uitgelichte afbeelding', type: 'image', options: {hotspot: true}}),
    defineField({name: 'category', title: 'Categorie', type: 'reference', to: [{type: 'blogCategory'}]}),
    defineField({name: 'author', title: 'Auteur', type: 'reference', to: [{type: 'author'}]}),
    defineField({name: 'publishedAt', title: 'Publicatiedatum', type: 'datetime'}),
    defineField({name: 'isFeatured', title: 'Uitlichten op blogoverzicht', type: 'boolean', initialValue: false}),
    defineField({name: 'readTime', title: 'Leestijd', type: 'string', description: 'Bijvoorbeeld: 6 min'}),
    defineField({
      name: 'body',
      title: 'Artikelinhoud',
      type: 'array',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({type: 'imageBlock'}),
        defineArrayMember({type: 'imageTextBlock'}),
        defineArrayMember({type: 'specList'})
      ]
    }),
    defineField({name: 'relatedPosts', title: 'Gerelateerde artikelen', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'blogPost'}]})]}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'})
  ],
  orderings: [{title: 'Nieuwste eerst', name: 'publishedAtDesc', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'category.title', media: 'featuredImage'}}
})
