import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Contactgegevens en footer',
  type: 'document',
  groups: [
    {name: 'company', title: '1. Bedrijfsgegevens'},
    {name: 'contact', title: '2. Contactgegevens'},
    {name: 'footer', title: '3. Footer onderaan website'},
    {name: 'seo', title: '4. SEO'}
  ],
  fields: [
    defineField({name: 'title', title: 'Interne naam', type: 'string', initialValue: 'Contactgegevens en footer', group: 'company'}),
    defineField({name: 'companyName', title: 'Bedrijfsnaam', description: 'Wordt gebruikt in contactblokken en copyrightregel.', type: 'string', group: 'company'}),
    defineField({name: 'tagline', title: 'Korte pay-off', description: 'Korte zin bij het merk, bijvoorbeeld onder het logo in de footer.', type: 'string', group: 'company'}),
    defineField({name: 'logo', title: 'Logo', type: 'image', options: {hotspot: true}, group: 'company'}),

    defineField({name: 'email', title: 'E-mailadres', description: 'E-mailadres dat in footer, contactblok en mailknoppen wordt gebruikt.', type: 'email', group: 'contact'}),
    defineField({name: 'phone', title: 'Telefoonnummer', description: 'Telefoonnummer dat in footer en contactblok wordt gebruikt.', type: 'string', group: 'contact'}),
    defineField({name: 'address', title: 'Adres in footer en contactblok', description: 'Gebruik regels zoals: Mega 16 / 6902 KL Zevenaar / Nederland.', type: 'text', rows: 3, group: 'contact'}),

    defineField({name: 'footerBrandText', title: 'Tekst onder logo in footer', description: 'Deze tekst staat links in de footer onder het Audacious logo.', type: 'text', rows: 3, group: 'footer'}),
    defineField({name: 'footerBottomText', title: 'Kleine tekst onderaan footer', description: 'De regel rechts onderaan de footer, bijvoorbeeld kernactiviteiten.', type: 'string', group: 'footer'}),
    defineField({name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url', group: 'footer'}),
    defineField({
      name: 'footerColumns',
      title: 'Footer kolommen met links',
      description: 'Hiermee pas je de linkkolommen onderaan de website aan. Contactgegevens komen uit de contactvelden hierboven.',
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