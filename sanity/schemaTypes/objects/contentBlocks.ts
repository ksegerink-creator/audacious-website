import {defineArrayMember, defineField, defineType} from 'sanity'

const blockText = [defineArrayMember({type: 'block'})]

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Tekstblok',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Kleine oranje titel',
      type: 'string',
      description: 'Kleine tekst boven de grote titel. Bijvoorbeeld: INTRO, PROCES of TOEPASSING.'
    }),
    defineField({
      name: 'title',
      title: 'Grote titel van dit blok',
      type: 'string',
      description: 'Deze titel staat groot links of bovenaan het tekstblok.'
    }),
    defineField({
      name: 'text',
      title: 'Lopende tekst',
      type: 'array',
      of: blockText,
      description: 'De normale tekst van dit blok. Dit is wat bezoekers lezen.'
    })
  ],
  preview: {select: {title: 'title', subtitle: 'eyebrow'}, prepare: ({title, subtitle}) => ({title: title || 'Tekstblok', subtitle: subtitle || 'Gewone tekstsectie'})}
})

export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Afbeelding over volle breedte',
  type: 'object',
  fields: [
    defineField({name: 'image', title: 'Afbeelding', type: 'image', options: {hotspot: true}, validation: Rule => Rule.required(), description: 'Deze afbeelding komt als brede fotosectie op de pagina.'}),
    defineField({name: 'alt', title: 'Korte omschrijving voor Google', type: 'string', description: 'Beschrijf wat er op de afbeelding staat. Bijvoorbeeld: CNC kantbank bij Audacious.'}),
    defineField({name: 'caption', title: 'Bijschrift onder de foto', type: 'string', description: 'Optioneel. Wordt klein onder de afbeelding getoond.'})
  ],
  preview: {select: {title: 'caption', media: 'image'}, prepare: ({title, media}) => ({title: title || 'Afbeelding over volle breedte', media})}
})

export const imageTextBlock = defineType({
  name: 'imageTextBlock',
  title: 'Afbeelding met tekst',
  type: 'object',
  fields: [
    defineField({name: 'image', title: 'Afbeelding', type: 'image', options: {hotspot: true}, description: 'Foto naast de tekst.'}),
    defineField({name: 'imagePosition', title: 'Waar moet de afbeelding staan?', type: 'string', options: {list: [{title: 'Links van de tekst', value: 'left'}, {title: 'Rechts van de tekst', value: 'right'}], layout: 'radio'}, initialValue: 'right'}),
    defineField({name: 'eyebrow', title: 'Kleine oranje titel', type: 'string', description: 'Kleine tekst boven de grote titel.'}),
    defineField({name: 'title', title: 'Grote titel', type: 'string'}),
    defineField({name: 'text', title: 'Tekst naast de afbeelding', type: 'array', of: blockText}),
    defineField({name: 'cta', title: 'Knop onder de tekst', type: 'cta', description: 'Optioneel. Alleen invullen als hier een knop moet komen.'})
  ],
  preview: {select: {title: 'title', subtitle: 'eyebrow', media: 'image'}, prepare: ({title, subtitle, media}) => ({title: title || 'Afbeelding met tekst', subtitle, media})}
})

export const specList = defineType({
  name: 'specList',
  title: 'Lijst met specificaties',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Titel boven de lijst', type: 'string'}),
    defineField({name: 'intro', title: 'Korte uitleg boven de lijst', type: 'text', rows: 3}),
    defineField({
      name: 'items',
      title: 'Regels in de lijst',
      description: 'Voorbeelden: Materiaal = Staal, RVS en aluminium. Productie = Enkelstuks en kleine series.',
      type: 'array',
      of: [defineArrayMember({type: 'object', fields: [
        defineField({name: 'label', title: 'Label links', type: 'string'}),
        defineField({name: 'value', title: 'Tekst rechts', type: 'string'})
      ], preview: {select: {title: 'label', subtitle: 'value'}}})]
    })
  ],
  preview: {select: {title: 'title'}, prepare: ({title}) => ({title: title || 'Lijst met specificaties'})}
})

export const cardGrid = defineType({
  name: 'cardGrid',
  title: 'Kaartenblok',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Kleine oranje titel', type: 'string'}),
    defineField({name: 'title', title: 'Grote titel boven de kaarten', type: 'string'}),
    defineField({name: 'intro', title: 'Korte intro boven de kaarten', type: 'text', rows: 3}),
    defineField({
      name: 'items',
      title: 'Kaarten',
      description: 'Elke kaart heeft een titel en korte tekst. Gebruik dit voor voordelen, toepassingen of diensten.',
      type: 'array',
      of: [defineArrayMember({type: 'object', fields: [
        defineField({name: 'title', title: 'Titel op kaart', type: 'string'}),
        defineField({name: 'text', title: 'Tekst op kaart', type: 'text', rows: 3}),
        defineField({name: 'cta', title: 'Link op kaart', type: 'cta', description: 'Optioneel.'})
      ], preview: {select: {title: 'title', subtitle: 'text'}}})]
    })
  ],
  preview: {select: {title: 'title', subtitle: 'eyebrow'}, prepare: ({title, subtitle}) => ({title: title || 'Kaartenblok', subtitle})}
})

export const ctaBlock = defineType({
  name: 'ctaBlock',
  title: 'Call-to-action blok',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Kleine oranje titel', type: 'string'}),
    defineField({name: 'title', title: 'Grote CTA titel', type: 'string', description: 'Bijvoorbeeld: Meer weten over deze oplossing?'}),
    defineField({name: 'text', title: 'Korte CTA tekst', type: 'text', rows: 3}),
    defineField({name: 'cta', title: 'Knop', type: 'cta'})
  ],
  preview: {select: {title: 'title', subtitle: 'eyebrow'}, prepare: ({title, subtitle}) => ({title: title || 'Call-to-action blok', subtitle})}
})

export const faqBlock = defineType({
  name: 'faqBlock',
  title: 'Veelgestelde vragen',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Titel boven de vragen', type: 'string'}),
    defineField({
      name: 'items',
      title: 'Vragen en antwoorden',
      type: 'array',
      of: [defineArrayMember({type: 'object', fields: [
        defineField({name: 'question', title: 'Vraag', type: 'string'}),
        defineField({name: 'answer', title: 'Antwoord', type: 'text', rows: 4})
      ], preview: {select: {title: 'question', subtitle: 'answer'}}})]
    })
  ],
  preview: {select: {title: 'title'}, prepare: ({title}) => ({title: title || 'Veelgestelde vragen'})}
})
