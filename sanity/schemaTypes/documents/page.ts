import {defineArrayMember, defineField, defineType} from 'sanity'

const editableBlocks = [
  defineArrayMember({type: 'textBlock'}),
  defineArrayMember({type: 'imageTextBlock'}),
  defineArrayMember({type: 'cardGrid'}),
  defineArrayMember({type: 'specList'}),
  defineArrayMember({type: 'imageBlock'}),
  defineArrayMember({type: 'ctaBlock'}),
  defineArrayMember({type: 'faqBlock'})
]

export const page = defineType({
  name: 'page',
  title: 'Pagina',
  type: 'document',
  groups: [
    {name: 'basis', title: '1. Bovenkant pagina'},
    {name: 'content', title: '2. Tekstblokken'},
    {name: 'media', title: '3. Fotos'},
    {name: 'cta', title: '4. Onderste knop'},
    {name: 'seo', title: '5. SEO'},
    {name: 'beheer', title: 'Beheer'}
  ],
  fields: [
    defineField({name: 'title', title: 'Paginanaam in het CMS', type: 'string', validation: Rule => Rule.required(), group: 'basis'}),
    defineField({name: 'slug', title: 'URL van de pagina', type: 'slug', options: {source: 'title'}, validation: Rule => Rule.required(), group: 'beheer'}),
    defineField({name: 'template', title: 'Type pagina', type: 'string', options: {list: [{title: 'Standaard pagina', value: 'default'}, {title: 'Over ons', value: 'about'}, {title: 'Contact', value: 'contact'}, {title: 'Landingpage', value: 'landing'}]}, initialValue: 'default', group: 'beheer'}),
    defineField({name: 'hero', title: 'Bovenste deel van de pagina', type: 'hero', group: 'basis'}),
    defineField({
      name: 'heroPanel',
      title: 'Rechter informatieblok bovenaan',
      type: 'object',
      group: 'basis',
      fields: [
        defineField({name: 'eyebrow', title: 'Kleine titel in het beeldblok', type: 'string'}),
        defineField({name: 'title', title: 'Grote tekst in het beeldblok', type: 'string'}),
        defineField({name: 'text', title: 'Korte uitleg in het beeldblok', type: 'text', rows: 3}),
        defineField({name: 'panelLabel', title: 'Label links boven specificaties', type: 'string'}),
        defineField({name: 'panelCode', title: 'Label rechts boven specificaties', type: 'string'}),
        defineField({name: 'rows', title: 'Specificatieregels', type: 'array', of: [defineArrayMember({type: 'object', fields: [defineField({name: 'label', title: 'Label links', type: 'string'}), defineField({name: 'value', title: 'Tekst rechts', type: 'string'})], preview: {select: {title: 'label', subtitle: 'value'}}})]})
      ]
    }),
    defineField({name: 'blocks', title: 'Tekstblokken op de pagina', description: 'Alles wat onder de bovenkant staat. Voeg blokken toe in de juiste volgorde.', type: 'array', of: editableBlocks, group: 'content'}),
    defineField({name: 'galleryEyebrow', title: 'Kleine titel boven fotogalerij', type: 'string', initialValue: 'Projectfotos', group: 'media'}),
    defineField({name: 'galleryTitle', title: 'Grote titel boven fotogalerij', type: 'string', initialValue: 'Beeld van het project.', group: 'media'}),
    defineField({name: 'galleryImages', title: 'Extra fotos / galerij', type: 'array', group: 'media', of: [defineArrayMember({type: 'image', options: {hotspot: true}, fields: [defineField({name: 'alt', title: 'Omschrijving', type: 'string'}), defineField({name: 'caption', title: 'Bijschrift', type: 'string'})]})]}),
    defineField({name: 'closingCta', title: 'Blok onderaan de pagina', type: 'object', group: 'cta', fields: [defineField({name: 'title', title: 'Titel boven de knop', type: 'string'}), defineField({name: 'button', title: 'Knop', type: 'cta'})]}),
    defineField({name: 'seo', title: 'SEO titel en beschrijving', type: 'seo', group: 'seo'})
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}}
})
