import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site instellingen',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string', initialValue: 'Audacious Sheet Metal International B.V.'}),
    defineField({name: 'companyName', title: 'Bedrijfsnaam', type: 'string'}),
    defineField({name: 'tagline', title: 'Pay-off', type: 'string'}),
    defineField({name: 'logo', title: 'Logo', type: 'image', options: {hotspot: true}}),
    defineField({name: 'email', title: 'E-mail', type: 'email'}),
    defineField({name: 'phone', title: 'Telefoon', type: 'string'}),
    defineField({name: 'address', title: 'Adres', type: 'text', rows: 3}),
    defineField({
      name: 'footerColumns',
      title: 'Footer kolommen',
      type: 'array',
      of: [defineArrayMember({type: 'object', fields: [
        defineField({name: 'title', title: 'Titel', type: 'string'}),
        defineField({name: 'links', title: 'Links', type: 'array', of: [defineArrayMember({type: 'navigationChild'})]})
      ]})]
    }),
    defineField({name: 'seo', title: 'Standaard SEO', type: 'seo'})
  ],
  preview: {select: {title: 'title'}}
})
