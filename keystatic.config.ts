import { collection, config, fields, singleton } from '@keystatic/core';

const imageField = (label: string, directory: string, publicPath: string) =>
  fields.image({ label, directory, publicPath });

const seo = (directory: string, publicPath: string) =>
  fields.object(
    {
      metaTitle: fields.text({ label: 'SEO titel' }),
      metaDescription: fields.text({ label: 'SEO beschrijving', multiline: true }),
      ogImage: imageField('Afbeelding voor delen', directory, publicPath),
      noIndex: fields.checkbox({ label: 'Verbergen voor zoekmachines', defaultValue: false }),
    },
    { label: 'SEO' }
  );

const cta = fields.object(
  {
    label: fields.text({ label: 'Tekst op de knop' }),
    linkType: fields.select({
      label: 'Type link',
      options: [
        { label: 'Interne pagina', value: 'internal' },
        { label: 'Externe website', value: 'external' },
        { label: 'Anker op dezelfde pagina', value: 'anchor' },
        { label: 'E-mail', value: 'email' },
        { label: 'Telefoon', value: 'phone' },
      ],
      defaultValue: 'internal',
    }),
    internalPath: fields.text({ label: 'Interne URL', description: 'Bijvoorbeeld /contact of /lasersnijden' }),
    url: fields.url({ label: 'Externe URL' }),
    anchor: fields.text({ label: 'Anker', description: 'Bijvoorbeeld #offerte-aanvragen' }),
    email: fields.text({ label: 'E-mailadres' }),
    phone: fields.text({ label: 'Telefoonnummer' }),
    openInNewTab: fields.checkbox({ label: 'Open in nieuw tabblad', defaultValue: false }),
  },
  { label: 'Knop / link' }
);

const hero = (directory: string, publicPath: string, withVideo = false) =>
  fields.object(
    {
      eyebrow: fields.text({ label: 'Kleine oranje tekst boven de titel' }),
      title: fields.text({ label: 'Grote titel' }),
      highlight: fields.text({ label: 'Oranje deel van de titel' }),
      intro: fields.text({ label: 'Intro onder de titel', multiline: true }),
      image: imageField('Hero-afbeelding', directory, publicPath),
      ...(withVideo
        ? {
            videoFile: fields.file({
              label: 'Homepage video',
              directory: 'public/media/cms/homepage',
              publicPath: '/media/cms/homepage/',
            }),
            videoUrl: fields.url({ label: 'Externe video-URL' }),
            videoPoster: imageField('Video poster', 'public/images/cms/homepage', '/images/cms/homepage/'),
          }
        : {}),
      primaryCta: cta,
      secondaryCta: cta,
    },
    { label: 'Hero / bovenkant pagina' }
  );

const heroPanel = fields.object(
  {
    eyebrow: fields.text({ label: 'Kleine titel' }),
    title: fields.text({ label: 'Grote tekst' }),
    text: fields.text({ label: 'Korte uitleg', multiline: true }),
    panelLabel: fields.text({ label: 'Label links boven specificaties' }),
    panelCode: fields.text({ label: 'Label rechts boven specificaties' }),
    rows: fields.array(
      fields.object({
        label: fields.text({ label: 'Label links' }),
        value: fields.text({ label: 'Tekst rechts' }),
      }),
      { label: 'Specificatieregels', itemLabel: props => props.fields.label.value || 'Regel' }
    ),
  },
  { label: 'Rechter informatieblok bovenaan' }
);

const specList = fields.object(
  {
    title: fields.text({ label: 'Titel' }),
    intro: fields.text({ label: 'Korte uitleg', multiline: true }),
    items: fields.array(
      fields.object({
        label: fields.text({ label: 'Label' }),
        value: fields.text({ label: 'Waarde' }),
      }),
      { label: 'Specificaties', itemLabel: props => props.fields.label.value || 'Specificatie' }
    ),
  },
  { label: 'Specificaties' }
);

const contentBlocks = (directory: string, publicPath: string) =>
  fields.blocks(
    {
      text: {
        label: 'Tekstblok',
        schema: fields.object({
          eyebrow: fields.text({ label: 'Kleine oranje titel' }),
          title: fields.text({ label: 'Grote titel' }),
          text: fields.text({ label: 'Lopende tekst', multiline: true }),
        }),
      },
      imageText: {
        label: 'Afbeelding met tekst',
        schema: fields.object({
          image: imageField('Afbeelding', directory, publicPath),
          imagePosition: fields.select({
            label: 'Positie afbeelding',
            options: [
              { label: 'Links', value: 'left' },
              { label: 'Rechts', value: 'right' },
            ],
            defaultValue: 'right',
          }),
          eyebrow: fields.text({ label: 'Kleine oranje titel' }),
          title: fields.text({ label: 'Grote titel' }),
          text: fields.text({ label: 'Tekst', multiline: true }),
          cta,
        }),
      },
      image: {
        label: 'Brede afbeelding',
        schema: fields.object({
          image: imageField('Afbeelding', directory, publicPath),
          alt: fields.text({ label: 'Alt-tekst' }),
          caption: fields.text({ label: 'Bijschrift' }),
        }),
      },
      specs: {
        label: 'Specificatielijst',
        schema: specList,
      },
      cards: {
        label: 'Kaartenblok',
        schema: fields.object({
          eyebrow: fields.text({ label: 'Kleine oranje titel' }),
          title: fields.text({ label: 'Grote titel' }),
          intro: fields.text({ label: 'Intro', multiline: true }),
          items: fields.array(
            fields.object({
              title: fields.text({ label: 'Titel' }),
              text: fields.text({ label: 'Tekst', multiline: true }),
              cta,
            }),
            { label: 'Kaarten', itemLabel: props => props.fields.title.value || 'Kaart' }
          ),
        }),
      },
      cta: {
        label: 'Call-to-action',
        schema: fields.object({
          eyebrow: fields.text({ label: 'Kleine oranje titel' }),
          title: fields.text({ label: 'Grote titel' }),
          text: fields.text({ label: 'Korte tekst', multiline: true }),
          cta,
        }),
      },
      faq: {
        label: 'Veelgestelde vragen',
        schema: fields.object({
          title: fields.text({ label: 'Titel' }),
          items: fields.array(
            fields.object({
              question: fields.text({ label: 'Vraag' }),
              answer: fields.text({ label: 'Antwoord', multiline: true }),
            }),
            { label: 'Vragen', itemLabel: props => props.fields.question.value || 'Vraag' }
          ),
        }),
      },
    },
    { label: 'Contentblokken' }
  );

const gallery = (directory: string, publicPath: string) =>
  fields.array(
    fields.object({
      image: imageField('Afbeelding', directory, publicPath),
      alt: fields.text({ label: 'Omschrijving' }),
      caption: fields.text({ label: 'Bijschrift' }),
    }),
    { label: 'Fotogalerij', itemLabel: props => props.fields.caption.value || props.fields.alt.value || 'Foto' }
  );

export default config({
  storage: {
    kind: 'github',
    repo: 'ksegerink-creator/audacious-website',
  },
  ui: {
    brand: { name: 'Audacious CMS' },
    navigation: {
      'Website': ['homepage', 'pages', 'services', 'markets', 'productGroups'],
      'Nieuws': ['posts', 'categories'],
      'Instellingen': ['navigation', 'settings'],
    },
  },
  singletons: {
    homepage: singleton({
      label: 'Homepage',
      path: 'public/cms/homepage',
      format: { data: 'json' },
      schema: {
        internalTitle: fields.text({ label: 'Interne naam' }),
        hero: hero('public/images/cms/homepage', '/images/cms/homepage/', true),
        introTitle: fields.text({ label: 'Intro titel' }),
        introText: fields.text({ label: 'Intro tekst', multiline: true }),
        introImage: imageField('Foto rechts naast intro', 'public/images/cms/homepage', '/images/cms/homepage/'),
        processEyebrow: fields.text({ label: 'Kleine titel procesblok' }),
        processTitle: fields.text({ label: 'Titel procesblok' }),
        processText: fields.text({ label: 'Tekst procesblok', multiline: true }),
        processTags: fields.array(fields.text({ label: 'Tag' }), { label: 'Proces-tags', itemLabel: props => props.value || 'Tag' }),
        processPanelTitle: fields.text({ label: 'Titel kaart rechts' }),
        processPanelIntro: fields.text({ label: 'Intro kaart rechts', multiline: true }),
        processPanelCode: fields.text({ label: 'Code kaart rechts' }),
        processItems: fields.array(
          fields.object({
            stepLabel: fields.text({ label: 'Stapnummer / label' }),
            title: fields.text({ label: 'Titel' }),
            text: fields.text({ label: 'Tekst', multiline: true }),
          }),
          { label: 'Processtappen', itemLabel: props => props.fields.title.value || 'Stap' }
        ),
        projectsEyebrow: fields.text({ label: 'Kleine titel projecten' }),
        projectsTitle: fields.text({ label: 'Titel projecten' }),
        projectsIntro: fields.text({ label: 'Intro projecten', multiline: true }),
        projectCards: fields.array(
          fields.object({
            title: fields.text({ label: 'Titel' }),
            text: fields.text({ label: 'Tekst', multiline: true }),
            href: fields.text({ label: 'Interne URL' }),
          }),
          { label: 'Projectkaarten', itemLabel: props => props.fields.title.value || 'Project' }
        ),
        featuredServices: fields.array(fields.relationship({ label: 'Werkzaamheid', collection: 'services' }), { label: 'Uitgelichte werkzaamheden', itemLabel: props => props.value || 'Werkzaamheid' }),
        featuredMarkets: fields.array(fields.relationship({ label: 'Markt', collection: 'markets' }), { label: 'Uitgelichte markten', itemLabel: props => props.value || 'Markt' }),
        featuredProductGroups: fields.array(fields.relationship({ label: 'Productgroep', collection: 'productGroups' }), { label: 'Uitgelichte productgroepen', itemLabel: props => props.value || 'Productgroep' }),
        blocks: contentBlocks('public/images/cms/homepage/blocks', '/images/cms/homepage/blocks/'),
        footerIntro: fields.text({ label: 'Footer introductietekst', multiline: true }),
        footerAffiliationsTitle: fields.text({ label: 'Titel aangesloten bij' }),
        footerAffiliations: fields.array(fields.text({ label: 'Item' }), { label: 'Aangesloten bij', itemLabel: props => props.value || 'Item' }),
        linkedinUrl: fields.url({ label: 'LinkedIn URL' }),
        seo: seo('public/images/cms/homepage/seo', '/images/cms/homepage/seo/'),
      },
    }),
    settings: singleton({
      label: 'Contactgegevens en footer',
      path: 'public/cms/settings',
      format: { data: 'json' },
      schema: {
        companyName: fields.text({ label: 'Bedrijfsnaam' }),
        tagline: fields.text({ label: 'Pay-off' }),
        logo: imageField('Logo', 'public/images/cms/settings', '/images/cms/settings/'),
        email: fields.text({ label: 'E-mailadres' }),
        phone: fields.text({ label: 'Telefoonnummer' }),
        address: fields.text({ label: 'Adres', multiline: true }),
        footerBrandText: fields.text({ label: 'Tekst onder logo', multiline: true }),
        footerBottomText: fields.text({ label: 'Kleine tekst onderaan footer' }),
        linkedinUrl: fields.url({ label: 'LinkedIn URL' }),
        seo: seo('public/images/cms/settings/seo', '/images/cms/settings/seo/'),
      },
    }),
    navigation: singleton({
      label: 'Navigatie',
      path: 'public/cms/navigation',
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'URL' }),
            children: fields.array(
              fields.object({
                label: fields.text({ label: 'Label' }),
                href: fields.text({ label: 'URL' }),
              }),
              { label: 'Subitems', itemLabel: props => props.fields.label.value || 'Subitem' }
            ),
          }),
          { label: 'Menu-items', itemLabel: props => props.fields.label.value || 'Menu-item' }
        ),
      },
    }),
  },
  collections: {
    services: collection({
      label: 'Werkzaamheden',
      slugField: 'title',
      path: 'public/cms/services/*',
      format: { data: 'json' },
      columns: ['title', 'order'],
      schema: {
        title: fields.slug({ name: { label: 'Naam van de werkzaamheid' }, slug: { label: 'URL-slug' } }),
        order: fields.integer({ label: 'Volgorde' }),
        intro: fields.text({ label: 'Intro onder de titel', multiline: true }),
        summary: fields.text({ label: 'Korte tekst voor kaarten', multiline: true }),
        heroImage: imageField('Hero-afbeelding', 'public/images/cms/services', '/images/cms/services/'),
        hero: hero('public/images/cms/services', '/images/cms/services/'),
        heroPanel,
        specs: specList,
        blocks: contentBlocks('public/images/cms/services/blocks', '/images/cms/services/blocks/'),
        galleryEyebrow: fields.text({ label: 'Kleine titel galerij' }),
        galleryTitle: fields.text({ label: 'Titel galerij' }),
        galleryImages: gallery('public/images/cms/services/gallery', '/images/cms/services/gallery/'),
        closingTitle: fields.text({ label: 'Titel onderaan pagina' }),
        closingButton: cta,
        seo: seo('public/images/cms/services/seo', '/images/cms/services/seo/'),
      },
    }),
    markets: collection({
      label: 'Markten',
      slugField: 'title',
      path: 'public/cms/markets/*',
      format: { data: 'json' },
      columns: ['title', 'order'],
      schema: {
        title: fields.slug({ name: { label: 'Naam van de markt' }, slug: { label: 'URL-slug' } }),
        order: fields.integer({ label: 'Volgorde' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        image: imageField('Afbeelding bovenaan', 'public/images/cms/markets', '/images/cms/markets/'),
        hero: hero('public/images/cms/markets', '/images/cms/markets/'),
        heroPanel,
        relatedServices: fields.array(fields.relationship({ label: 'Werkzaamheid', collection: 'services' }), { label: 'Gerelateerde werkzaamheden', itemLabel: props => props.value || 'Werkzaamheid' }),
        blocks: contentBlocks('public/images/cms/markets/blocks', '/images/cms/markets/blocks/'),
        galleryEyebrow: fields.text({ label: 'Kleine titel galerij' }),
        galleryTitle: fields.text({ label: 'Titel galerij' }),
        galleryImages: gallery('public/images/cms/markets/gallery', '/images/cms/markets/gallery/'),
        closingTitle: fields.text({ label: 'Titel onderaan pagina' }),
        closingButton: cta,
        seo: seo('public/images/cms/markets/seo', '/images/cms/markets/seo/'),
      },
    }),
    pages: collection({
      label: 'Pagina’s en projecten',
      slugField: 'title',
      path: 'public/cms/pages/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Paginanaam' }, slug: { label: 'URL-slug' } }),
        template: fields.select({
          label: 'Type pagina',
          options: [
            { label: 'Standaard', value: 'default' },
            { label: 'Over ons', value: 'about' },
            { label: 'Contact', value: 'contact' },
            { label: 'Landingpage', value: 'landing' },
            { label: 'Project', value: 'project' },
          ],
          defaultValue: 'default',
        }),
        hero: hero('public/images/cms/pages', '/images/cms/pages/'),
        heroPanel,
        projectOverview: fields.object({
          eyebrow: fields.text({ label: 'Kleine titel' }),
          title: fields.text({ label: 'Grote titel' }),
          intro: fields.text({ label: 'Korte tekst', multiline: true }),
          tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Labels', itemLabel: props => props.value || 'Label' }),
        }, { label: 'Projectenblok overzicht' }),
        blocks: contentBlocks('public/images/cms/pages/blocks', '/images/cms/pages/blocks/'),
        galleryEyebrow: fields.text({ label: 'Kleine titel galerij' }),
        galleryTitle: fields.text({ label: 'Titel galerij' }),
        galleryImages: gallery('public/images/cms/pages/gallery', '/images/cms/pages/gallery/'),
        closingTitle: fields.text({ label: 'Titel onderaan pagina' }),
        closingButton: cta,
        seo: seo('public/images/cms/pages/seo', '/images/cms/pages/seo/'),
      },
    }),
    productGroups: collection({
      label: 'Productgroepen',
      slugField: 'title',
      path: 'public/cms/product-groups/*',
      format: { data: 'json' },
      columns: ['title', 'order'],
      schema: {
        title: fields.slug({ name: { label: 'Titel' }, slug: { label: 'URL-slug' } }),
        order: fields.integer({ label: 'Volgorde' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        image: imageField('Afbeelding', 'public/images/cms/product-groups', '/images/cms/product-groups/'),
        applications: fields.array(fields.text({ label: 'Toepassing' }), { label: 'Toepassingen', itemLabel: props => props.value || 'Toepassing' }),
        blocks: contentBlocks('public/images/cms/product-groups/blocks', '/images/cms/product-groups/blocks/'),
        seo: seo('public/images/cms/product-groups/seo', '/images/cms/product-groups/seo/'),
      },
    }),
    categories: collection({
      label: 'Nieuwscategorieën',
      slugField: 'title',
      path: 'public/cms/categories/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Titel' }, slug: { label: 'URL-slug' } }),
        description: fields.text({ label: 'Beschrijving', multiline: true }),
      },
    }),
    posts: collection({
      label: 'Nieuws',
      slugField: 'title',
      path: 'public/cms/posts/*',
      format: { data: 'json' },
      columns: ['title', 'publishedAt', 'isFeatured'],
      schema: {
        title: fields.slug({ name: { label: 'Titel' }, slug: { label: 'URL-slug' } }),
        excerpt: fields.text({ label: 'Korte intro', multiline: true }),
        featuredImage: imageField('Afbeelding bovenaan', 'public/images/cms/posts', '/images/cms/posts/'),
        category: fields.relationship({ label: 'Categorie', collection: 'categories' }),
        publishedAt: fields.datetime({ label: 'Publicatiedatum' }),
        isFeatured: fields.checkbox({ label: 'Uitlichten op nieuwsoverzicht', defaultValue: false }),
        body: fields.markdoc({
          label: 'Nieuwsinhoud',
links: true,
          images: {
            directory: 'public/images/cms/posts/body',
            publicPath: '/images/cms/posts/body/',
          },
        }),
        galleryEyebrow: fields.text({ label: 'Kleine titel galerij' }),
        galleryTitle: fields.text({ label: 'Titel galerij' }),
        galleryImages: gallery('public/images/cms/posts/gallery', '/images/cms/posts/gallery/'),
        closingTitle: fields.text({ label: 'Titel onderaan nieuwsitem' }),
        closingButton: cta,
        seo: seo('public/images/cms/posts/seo', '/images/cms/posts/seo/'),
      },
    }),
  },
});
