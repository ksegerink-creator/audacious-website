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
  fields: [
    defineField({name: 'title', title: 'Interne titel', type: 'string', initialValue: 'Homepage'}),
    defineField({name: 'hero', title: 'Hero', type: 'hero'}),
    defineField({name: 'introTitle', title: 'Intro titel', type: 'string'}),
    defineField({name: 'introText', title: 'Intro tekst', type: 'text', rows: 4}),
    defineField({name: 'processEyebrow', title: 'Procesblok label', type: 'string'}),
    defineField({name: 'processTitle', title: 'Procesblok titel', type: 'string'}),
    defineField({name: 'processText', title: 'Procesblok tekst', type: 'text', rows: 4}),
    defineField({name: 'processItems', title: 'Processtappen', type: 'array', of: [defineArrayMember({type: 'object', fields: [defineField({name: 'title', title: 'Titel', type: 'string'}), defineField({name: 'text', title: 'Tekst', type: 'text', rows: 3})]})]}),
    defineField({name: 'projectsEyebrow', title: 'Projecten label', type: 'string'}),
    defineField({name: 'projectsTitle', title: 'Projecten titel', type: 'string'}),
    defineField({name: 'projectsIntro', title: 'Projecten intro', type: 'text', rows: 3}),
    defineField({name: 'projectCards', title: 'Projectkaarten', type: 'array', of: [defineArrayMember({type: 'object', fields: [defineField({name: 'title', title: 'Titel', type: 'string'}), defineField({name: 'text', title: 'Tekst', type: 'text', rows: 3}), defineField({name: 'link', title: 'Link', type: 'cta'})]})]}),
    defineField({name: 'featuredServices', title: 'Werkzaamheden slider', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})]}),
    defineField({name: 'featuredMarkets', title: 'Uitgelichte markten', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'market'}]})]}),
    defineField({name: 'featuredProductGroups', title: 'Uitgelichte productgroepen', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'productGroup'}]})]}),
    defineField({name: 'blocks', title: 'Extra contentblokken', type: 'array', of: editableBlocks}),
    defineField({name: 'footerIntro', title: 'Footer introductietekst', type: 'text', rows: 3}),
    defineField({name: 'footerAffiliationsTitle', title: 'Footer aangesloten bij titel', type: 'string', initialValue: 'Wij zijn aangesloten bij'}),
    defineField({name: 'footerAffiliations', title: 'Footer aangesloten bij items', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'})
  ],
  preview: {select: {title: 'title'}}
})