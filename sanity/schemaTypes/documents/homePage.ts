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

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  groups: [
    {name: 'hero', title: '1. Bovenkant homepage'},
    {name: 'intro', title: '2. Intro'},
    {name: 'process', title: '3. Over ons / proces'},
    {name: 'projects', title: '4. Projecten'},
    {name: 'media', title: '5. Uitgelichte onderdelen'},
    {name: 'footer', title: '6. Footer'},
    {name: 'seo', title: '7. SEO'}
  ],
  fields: [
    defineField({name: 'title', title: 'Interne naam', type: 'string', initialValue: 'Homepage', group: 'hero'}),
    defineField({name: 'hero', title: 'Bovenste deel van de homepage', type: 'hero', group: 'hero'}),
    defineField({name: 'introTitle', title: 'Intro titel', type: 'string', group: 'intro'}),
    defineField({name: 'introText', title: 'Intro tekst', type: 'text', rows: 4, group: 'intro'}),
    defineField({name: 'introImage', title: 'Foto rechts naast intro', type: 'image', options: {hotspot: true}, group: 'intro'}),
    defineField({name: 'processEyebrow', title: 'Kleine oranje titel boven procesblok', type: 'string', group: 'process'}),
    defineField({name: 'processTitle', title: 'Grote titel procesblok', type: 'string', group: 'process'}),
    defineField({name: 'processText', title: 'Tekst procesblok', type: 'text', rows: 4, group: 'process'}),
    defineField({name: 'processTags', title: 'Labels / tags in procesblok', type: 'array', group: 'process', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'processPanelTitle', title: 'Titel op kaart rechts', type: 'string', group: 'process'}),
    defineField({name: 'processPanelIntro', title: 'Korte tekst op kaart rechts', type: 'text', rows: 2, group: 'process'}),
    defineField({name: 'processPanelCode', title: 'Code op kaart rechts', type: 'string', group: 'process'}),
    defineField({
      name: 'processItems',
      title: 'Processtappen',
      type: 'array',
      group: 'process',
      of: [defineArrayMember({type: 'object', fields: [
        defineField({name: 'stepLabel', title: 'Stapnummer / label', type: 'string'}),
        defineField({name: 'title', title: 'Titel van de stap', type: 'string'}),
        defineField({name: 'text', title: 'Tekst van de stap', type: 'text', rows: 3})
      ], preview: {select: {title: 'title', subtitle: 'stepLabel'}}})]
    }),
    defineField({name: 'projectsEyebrow', title: 'Kleine oranje titel boven projecten', type: 'string', group: 'projects'}),
    defineField({name: 'projectsTitle', title: 'Grote titel boven projecten', type: 'string', group: 'projects'}),
    defineField({name: 'projectsIntro', title: 'Intro boven projecten', type: 'text', rows: 3, group: 'projects'}),
    defineField({name: 'projectCards', title: 'Projectkaarten', type: 'array', group: 'projects', of: [defineArrayMember({type: 'object', fields: [defineField({name: 'title', title: 'Titel op kaart', type: 'string'}), defineField({name: 'text', title: 'Tekst op kaart', type: 'text', rows: 3}), defineField({name: 'link', title: 'Link op kaart', type: 'cta'})], preview: {select: {title: 'title', subtitle: 'text'}}})]}),
    defineField({name: 'featuredServices', title: 'Uitgelichte werkzaamheden', type: 'array', group: 'media', of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})]}),
    defineField({name: 'featuredMarkets', title: 'Uitgelichte markten', type: 'array', group: 'media', of: [defineArrayMember({type: 'reference', to: [{type: 'market'}]})]}),
    defineField({name: 'featuredProductGroups', title: 'Uitgelichte productgroepen', type: 'array', group: 'media', of: [defineArrayMember({type: 'reference', to: [{type: 'productGroup'}]})]}),
    defineField({name: 'blocks', title: 'Extra tekstblokken', type: 'array', group: 'media', of: editableBlocks}),
    defineField({name: 'footerIntro', title: 'Footer introductietekst', type: 'text', rows: 3, group: 'footer'}),
    defineField({name: 'footerAffiliationsTitle', title: 'Titel boven aangesloten-bij lijst', type: 'string', initialValue: 'Wij zijn aangesloten bij', group: 'footer'}),
    defineField({name: 'footerAffiliations', title: 'Aangesloten-bij items', type: 'array', group: 'footer', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url', group: 'footer'}),
    defineField({name: 'seo', title: 'SEO titel en beschrijving', type: 'seo', group: 'seo'})
  ],
  preview: {select: {title: 'title'}}
})