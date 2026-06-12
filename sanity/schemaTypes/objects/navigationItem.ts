import {defineArrayMember, defineField, defineType} from 'sanity'

const linkFields = [
  defineField({name: 'label', title: 'Label', type: 'string', validation: Rule => Rule.required()}),
  defineField({
    name: 'linkType',
    title: 'Linktype',
    type: 'string',
    options: {list: [
      {title: 'Interne pagina', value: 'internal'},
      {title: 'Externe URL', value: 'external'},
      {title: 'Anchor', value: 'anchor'},
      {title: 'Geen link / alleen submenu', value: 'none'}
    ], layout: 'radio'},
    initialValue: 'internal'
  }),
  defineField({name: 'internalPage', title: 'Interne pagina', type: 'reference', to: [{type: 'page'}, {type: 'service'}, {type: 'market'}, {type: 'productGroup'}, {type: 'blogPost'}], hidden: ({parent}) => parent?.linkType !== 'internal'}),
  defineField({name: 'url', title: 'Externe URL', type: 'url', hidden: ({parent}) => parent?.linkType !== 'external'}),
  defineField({name: 'anchor', title: 'Anchor', type: 'string', hidden: ({parent}) => parent?.linkType !== 'anchor'}),
  defineField({name: 'openInNewTab', title: 'Openen in nieuw tabblad', type: 'boolean', initialValue: false})
]

export const navigationChild = defineType({
  name: 'navigationChild',
  title: 'Submenu item',
  type: 'object',
  fields: linkFields,
  preview: {select: {title: 'label', subtitle: 'linkType'}}
})

export const navigationItem = defineType({
  name: 'navigationItem',
  title: 'Menu item',
  type: 'object',
  fields: [
    ...linkFields,
    defineField({
      name: 'children',
      title: 'Submenu items',
      type: 'array',
      of: [defineArrayMember({type: 'navigationChild'})]
    })
  ],
  preview: {select: {title: 'label', subtitle: 'linkType'}}
})
