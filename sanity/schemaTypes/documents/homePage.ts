import {defineArrayMember, defineField, defineType} from 'sanity'

const editableBlocks = [
  defineArrayMember({type: 'textBlock'}),
  defineArrayMember({type: 'imageBlock'}),
  defineArrayMember({type: 'imageTextBlock'}),
  defineArrayMember({type: 'specList'}),
  defineArrayMember({type: 'cardGrid'}),
  defineArrayMember({type: 'ctaBlock'}),
  defineArrayMember({type: 'faqBlock'})
]

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'intro', title: 'Intro'},
    {name: 'process', title: 'Over ons / procesblok'},
    {name: 'projects', title: 'Projecten'},
    {name: 'media', title: 'Afbeeldingen / uitgelicht'},
    {name: 'footer', title: 'Footer'},
    {name: 'seo', title: 'SEO'}
  ],
  fields: [
    defineField({name: 'title', title: 'Interne titel', type: 'string', initialValue: 'Homepage'}),
    defineField({name: 'hero', title: 'Hero', type: 'hero', group: 'hero'}),
    defineField({name: 'introTitle', title: 'Intro titel', type: 'string', group: 'intro'}),
    defineField({name: 'introText', title: 'Intro tekst', type: 'text', rows: 4, group: 'intro'}),
    defineField({name: 'processEyebrow', title: 'Over ons label', type: 'string', group: 'process'}),
    defineField({name: 'processTitle', title: 'Over ons titel', type: 'string', group: 'process', description: 'Grote titel links in het homepageblok, bijvoorbeeld: Voorbereiden, produceren en regisseren.'}),
    defineField({name: 'processText', title: 'Over ons tekst', type: 'text', rows: 4, group: 'process'}),
    defineField({name: 'processTags', title: 'Over ons tags', type: 'array', group: 'process', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'processPanelTitle', title: 'Proceskaart titel rechts', type: 'string', group: 'process'}),
    defineField({name: 'processPanelIntro', title: 'Proceskaart intro rechts', type: 'text', rows: 2, group: 'process'}),
    defineField({name: 'processPanelCode', title: 'Proceskaart code', type: 'string', group: 'process'}),
    defineField({
      name: 'processItems',
      title: 'Processtappen',
      type: 'array',
      group: 'process',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'stepLabel', title: 'Stap label', type: 'string'}),
            defineField({name: 'title', title: 'Titel', type: 'string'}),
            defineField({name: 'text', title: 'Tekst', type: 'text', rows: 3})
          ],
          preview: {select: {title: 'title', subtitle: 'stepLabel'}}
        })
      ]
    }),
    defineField({name: 'projectsEyebrow', title: 'Projecten label', type: 'string', group: 'projects'}),
    defineField({name: 'projectsTitle', title: 'Projecten titel', type: 'string', group: 'projects'}),
    defineField({name: 'projectsIntro', title: 'Projecten intro', type: 'text', rows: 3, group: 'projects'}),
    defineField({name: 'projectCards', title: 'Projectkaarten', type: 'array', group: 'projects', of: [defineArrayMember({type: 'object', fields: [defineField({name: 'title', title: 'Titel', type: 'string'}), defineField({name: 'text', title: 'Tekst', type: 'text', rows: 3}), defineField({name: 'link', title: 'Link', type: 'cta'})]})]}),
    defineField({name: 'featuredServices', title: 'Werkzaamheden slider', type: 'array', group: 'media', of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})]}),
    defineField({name: 'featuredMarkets', title: 'Uitgelichte markten', type: 'array', group: 'media', of: [defineArrayMember({type: 'reference', to: [{type: 'market'}]})]}),
    defineField({name: 'featuredProductGroups', title: 'Uitgelichte productgroepen', type: 'array', group: 'media', of: [defineArrayMember({type: 'reference', to: [{type: 'productGroup'}]})]}),
    defineField({name: 'blocks', title: 'Extra contentblokken', type: 'array', group: 'media', of: editableBlocks}),
    defineField({name: 'footerIntro', title: 'Footer introductietekst', type: 'text', rows: 3, group: 'footer'}),
    defineField({name: 'footerAffiliationsTitle', title: 'Footer aangesloten bij titel', type: 'string', initialValue: 'Wij zijn aangesloten bij', group: 'footer'}),
    defineField({name: 'footerAffiliations', title: 'Footer aangesloten bij items', type: 'array', group: 'footer', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url', group: 'footer'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'})
  ],
  preview: {select: {title: 'title'}}
})