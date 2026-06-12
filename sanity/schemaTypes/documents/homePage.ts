import {defineArrayMember, defineField, defineType} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Interne titel', type: 'string', initialValue: 'Homepage'}),
    defineField({name: 'hero', title: 'Hero', type: 'hero'}),
    defineField({name: 'introTitle', title: 'Intro titel', type: 'string'}),
    defineField({name: 'introText', title: 'Intro tekst', type: 'text', rows: 4}),
    defineField({name: 'featuredServices', title: 'Werkzaamheden slider', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})]}),
    defineField({name: 'featuredMarkets', title: 'Uitgelichte markten', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'market'}]})]}),
    defineField({name: 'featuredProductGroups', title: 'Uitgelichte productgroepen', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'productGroup'}]})]}),
    defineField({name: 'blocks', title: 'Extra contentblokken', type: 'array', of: [defineArrayMember({type: 'textBlock'}), defineArrayMember({type: 'imageBlock'}), defineArrayMember({type: 'imageTextBlock'}), defineArrayMember({type: 'specList'}), defineArrayMember({type: 'faqBlock'})]}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'})
  ],
  preview: {select: {title: 'title'}}
})
