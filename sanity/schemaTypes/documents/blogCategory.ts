import {defineField, defineType} from 'sanity'

export const blogCategory = defineType({
  name: 'blogCategory',
  title: 'Nieuwscategorie',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string', validation: Rule => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, validation: Rule => Rule.required()}),
    defineField({name: 'description', title: 'Omschrijving', type: 'text', rows: 3})
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}}
})