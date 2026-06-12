import {defineArrayMember, defineField, defineType} from 'sanity'

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigatie',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string', initialValue: 'Hoofdnavigatie', validation: Rule => Rule.required()}),
    defineField({
      name: 'items',
      title: 'Menu items',
      description: 'De volgorde in deze lijst is de volgorde op de website.',
      type: 'array',
      of: [defineArrayMember({type: 'navigationItem'})]
    })
  ],
  preview: {select: {title: 'title'}}
})
