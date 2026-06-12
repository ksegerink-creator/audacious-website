import {defineField, defineType} from 'sanity'

export const cta = defineType({
  name: 'cta',
  title: 'CTA knop',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string'}),
    defineField({
      name: 'linkType',
      title: 'Linktype',
      type: 'string',
      options: {list: [
        {title: 'Interne pagina', value: 'internal'},
        {title: 'Externe URL', value: 'external'},
        {title: 'Anchor', value: 'anchor'},
        {title: 'E-mail', value: 'email'},
        {title: 'Telefoon', value: 'phone'}
      ], layout: 'radio'},
      initialValue: 'internal'
    }),
    defineField({name: 'internalPage', title: 'Interne pagina', type: 'reference', to: [{type: 'page'}, {type: 'service'}, {type: 'market'}, {type: 'productGroup'}, {type: 'blogPost'}], hidden: ({parent}) => parent?.linkType !== 'internal'}),
    defineField({name: 'url', title: 'URL', type: 'url', hidden: ({parent}) => parent?.linkType !== 'external'}),
    defineField({name: 'anchor', title: 'Anchor', type: 'string', description: 'Bijvoorbeeld #contact', hidden: ({parent}) => parent?.linkType !== 'anchor'}),
    defineField({name: 'email', title: 'E-mail', type: 'email', hidden: ({parent}) => parent?.linkType !== 'email'}),
    defineField({name: 'phone', title: 'Telefoonnummer', type: 'string', hidden: ({parent}) => parent?.linkType !== 'phone'}),
    defineField({name: 'openInNewTab', title: 'Openen in nieuw tabblad', type: 'boolean', initialValue: false})
  ],
  preview: {select: {title: 'label', subtitle: 'linkType'}}
})
