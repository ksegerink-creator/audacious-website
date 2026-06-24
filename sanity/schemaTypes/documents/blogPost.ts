import {defineArrayMember, defineField, defineType} from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Nieuwsitem',
  type: 'document',
  groups: [
    {name: 'basis', title: '1. Bovenkant nieuwsitem'},
    {name: 'content', title: '2. Nieuwsinhoud'},
    {name: 'media', title: '3. Fotos'},
    {name: 'cta', title: '4. Onderste knop'},
    {name: 'seo', title: '5. SEO'},
    {name: 'beheer', title: 'Beheer'}
  ],
  fields: [
    defineField({name: 'title', title: 'Titel van het nieuwsitem', type: 'string', validation: Rule => Rule.required(), group: 'basis'}),
    defineField({name: 'slug', title: 'URL van het nieuwsitem', type: 'slug', options: {source: 'title'}, validation: Rule => Rule.required(), group: 'beheer'}),
    defineField({name: 'excerpt', title: 'Korte intro / samenvatting', type: 'text', rows: 4, group: 'basis'}),
    defineField({name: 'featuredImage', title: 'Afbeelding bovenaan', type: 'image', options: {hotspot: true}, group: 'basis'}),
    defineField({name: 'category', title: 'Categorie', type: 'reference', to: [{type: 'blogCategory'}], group: 'beheer'}),
    defineField({name: 'publishedAt', title: 'Publicatiedatum', type: 'datetime', group: 'beheer'}),
    defineField({name: 'isFeatured', title: 'Uitlichten op nieuwsoverzicht', type: 'boolean', initialValue: false, group: 'beheer'}),
    defineField({
      name: 'body',
      title: 'Tekst en blokken van het nieuwsitem',
      description: 'Hier staat de inhoud van het nieuwsbericht. Gebruik gewone tekst of voeg extra blokken toe.',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({type: 'imageBlock'}),
        defineArrayMember({type: 'imageTextBlock'}),
        defineArrayMember({type: 'specList'}),
        defineArrayMember({type: 'cardGrid'}),
        defineArrayMember({type: 'ctaBlock'})
      ]
    }),
    defineField({name: 'galleryEyebrow', title: 'Kleine titel boven fotogalerij', type: 'string', group: 'media'}),
    defineField({name: 'galleryTitle', title: 'Grote titel boven fotogalerij', type: 'string', group: 'media'}),
    defineField({name: 'galleryImages', title: 'Extra fotos / galerij', type: 'array', group: 'media', of: [defineArrayMember({type: 'image', options: {hotspot: true}, fields: [defineField({name: 'alt', title: 'Omschrijving', type: 'string'}), defineField({name: 'caption', title: 'Bijschrift', type: 'string'})]})]}),
    defineField({name: 'closingCta', title: 'Blok onderaan het nieuwsitem', type: 'object', group: 'cta', fields: [defineField({name: 'title', title: 'Titel boven de knop', type: 'string'}), defineField({name: 'button', title: 'Knop', type: 'cta'})]}),
    defineField({name: 'seo', title: 'SEO titel en beschrijving', type: 'seo', group: 'seo'})
  ],
  orderings: [{title: 'Nieuwste eerst', name: 'publishedAtDesc', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'category.title', media: 'featuredImage'}}
})
