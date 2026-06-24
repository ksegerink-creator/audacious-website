import {defineField, defineType} from 'sanity'

export const cta = defineType({
  name: 'cta',
  title: 'Knop / link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Tekst op de knop',
      type: 'string',
      description: 'Bijvoorbeeld: Contact opnemen, Meer lezen of Bekijk project.'
    }),
    defineField({
      name: 'linkType',
      title: 'Waar moet de knop naartoe?',
      type: 'string',
      options: {list: [
        {title: 'Naar een pagina op deze website', value: 'internal'},
        {title: 'Naar een externe website', value: 'external'},
        {title: 'Naar een plek op dezelfde pagina', value: 'anchor'},
        {title: 'E-mail openen', value: 'email'},
        {title: 'Telefoonnummer bellen', value: 'phone'}
      ], layout: 'radio'},
      initialValue: 'internal'
    }),
    defineField({
      name: 'internalPage',
      title: 'Kies de pagina op deze website',
      type: 'reference',
      to: [{type: 'page'}, {type: 'service'}, {type: 'market'}, {type: 'productGroup'}, {type: 'blogPost'}],
      hidden: ({parent}) => parent?.linkType !== 'internal'
    }),
    defineField({name: 'url', title: 'Externe URL', type: 'url', description: 'Bijvoorbeeld: https://www.linkedin.com/...', hidden: ({parent}) => parent?.linkType !== 'external'}),
    defineField({name: 'anchor', title: 'Anker op dezelfde pagina', type: 'string', description: 'Bijvoorbeeld: #offerte-aanvragen', hidden: ({parent}) => parent?.linkType !== 'anchor'}),
    defineField({name: 'email', title: 'E-mailadres', type: 'email', hidden: ({parent}) => parent?.linkType !== 'email'}),
    defineField({name: 'phone', title: 'Telefoonnummer', type: 'string', hidden: ({parent}) => parent?.linkType !== 'phone'}),
    defineField({name: 'openInNewTab', title: 'Openen in nieuw tabblad', type: 'boolean', initialValue: false})
  ],
  preview: {select: {title: 'label', subtitle: 'linkType'}, prepare: ({title, subtitle}) => ({title: title || 'Knop / link', subtitle})}
})
