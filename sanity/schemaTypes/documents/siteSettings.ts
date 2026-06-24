import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Contactgegevens en footer',
  type: 'document',
  groups: [
    {name: 'company', title: 'Bedrijfsgegevens'},
    {name: 'contact', title: 'Contact'},
    {name: 'footer', title: 'Footer'},
    {name: 'seo', title: 'SEO'}
  ],
  fields: [
    defineField({name: 'title', title: 'Naam van de website', type: 'string', initialValue: 'Audacious Sheet Metal International B.V.', group: 'company'}),
    defineField({name: 'companyName', title: 'Officiele bedrijfsnaam', type: 'string', group: 'company'}),
    defineField({name: 'tagline', title: 'Korte pay-off', type: 'string', group: 'company'}),
    defineField({name: 'logo', title: 'Logo', type: 'image', options: {hotspot: true}, group: 'company'}),
    defineField({name: 'email', title: 'E-mailadres', type: 'email', group: 'contact'}),
    defineField({name: 'phone', title: 'Telefoonnummer', type: 'string', group: 'contact'}),
    defineField({name: 'address', title: 'Adres', type: 'text', rows: 3, group: 'contact'}),
    defineField({
      name: 'footerColumns',
      title: 'Footer kolommen',
      description: 'Links en teksten onderaan de website.',
      type: 'array',
      group: 'footer',
      of: [defineArrayMember({type: 'object', fields: [
        defineField({name: 'title', title: 'Titel van kolom', type: 'string'}),
        defineField({name: 'links', title: 'Links in deze kolom', type: 'array', of: [defineArrayMember({type: 'navigationChild'})]})
      ], preview: {select: {title: 'title'}}})]
    }),
    defineField({name: 'seo', title: 'Standaard SEO titel en beschrijving', type: 'seo', group: 'seo'})
  ],
  preview: {select: {title: 'title'}}
})
