import type {StructureResolver} from 'sanity/structure'

const singleton = (S: any, type: string, title: string) =>
  S.listItem()
    .title(title)
    .schemaType(type)
    .child(S.document().schemaType(type).documentId(type).title(title))

const pageBySlug = (S: any, title: string, slug: string) =>
  S.listItem()
    .title(title)
    .schemaType('page')
    .child(
      S.documentList()
        .title(title)
        .schemaType('page')
        .filter('_type == "page" && slug.current == $slug')
        .params({slug})
    )

const serviceBySlug = (S: any, title: string, slug: string) =>
  S.listItem()
    .title(title)
    .schemaType('service')
    .child(
      S.documentList()
        .title(title)
        .schemaType('service')
        .filter('_type == "service" && slug.current == $slug')
        .params({slug})
    )

const marketBySlug = (S: any, title: string, slug: string) =>
  S.listItem()
    .title(title)
    .schemaType('market')
    .child(
      S.documentList()
        .title(title)
        .schemaType('market')
        .filter('_type == "market" && slug.current == $slug')
        .params({slug})
    )

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Audacious beheer')
    .items([
      singleton(S, 'homePage', 'Homepage aanpassen'),
      S.divider(),
      S.listItem()
        .title('Pagina’s aanpassen')
        .schemaType('page')
        .child(
          S.list()
            .title('Pagina’s aanpassen')
            .items([
              pageBySlug(S, 'Over ons', 'over-ons'),
              pageBySlug(S, 'Contact', 'contact'),
              pageBySlug(S, 'Werken bij Audacious', 'werken-bij-audacious'),
              pageBySlug(S, 'Productievoorbereiding', 'productievoorbereiding'),
              pageBySlug(S, 'Engineering', 'engineering'),
              pageBySlug(S, 'Materialen', 'materialen'),
              pageBySlug(S, 'Werkzaamheden overzicht', 'werkzaamheden'),
              pageBySlug(S, 'Projecten overzicht', 'projecten'),
              pageBySlug(S, 'Nieuws overzicht', 'nieuws'),
              pageBySlug(S, 'Markten overzicht', 'markten')
            ])
        ),
      S.listItem()
        .title('Werkzaamheden aanpassen')
        .schemaType('service')
        .child(
          S.list()
            .title('Werkzaamheden aanpassen')
            .items([
              serviceBySlug(S, 'Lasersnijden', 'lasersnijden'),
              serviceBySlug(S, 'Kanten', 'kanten'),
              serviceBySlug(S, 'Walsen', 'walsen'),
              serviceBySlug(S, 'Persen', 'persen'),
              serviceBySlug(S, 'Lassen', 'lassen'),
              serviceBySlug(S, 'Oppervlaktebehandelingen', 'oppervlaktebehandelingen'),
              serviceBySlug(S, 'Assembleren', 'assembleren'),
              serviceBySlug(S, 'Cleanroom verpakken', 'cleanroom-verpakken'),
              S.divider(),
              S.documentTypeListItem('service').title('Alle werkzaamheden')
            ])
        ),
      S.listItem()
        .title('Projecten aanpassen')
        .schemaType('page')
        .child(
          S.list()
            .title('Projecten aanpassen')
            .items([
              pageBySlug(S, 'Projecten overzicht', 'projecten'),
              S.documentListItem().schemaType('page').title('Food frame').id('page-project-food-frame'),
              S.documentListItem().schemaType('page').title('Plaatwerk behuizingen').id('page-project-plaatwerk-behuizingen'),
              S.documentListItem().schemaType('page').title('Röntgenarm').id('page-project-rontgenarm'),
              S.documentListItem().schemaType('page').title('Verpakkingsframes').id('page-project-verpakkingsframes'),
              S.documentListItem().schemaType('page').title('Behuizing').id('page-project-behuizing'),
              S.documentListItem().schemaType('page').title('Schuifdeuren').id('page-project-schuifdeuren'),
              S.documentListItem().schemaType('page').title('Transportwagen kooi').id('page-project-transportwagen-kooi'),
              S.divider(),
              S.documentList()
                .title('Alle projectpagina’s')
                .schemaType('page')
                .filter('_type == "page" && slug.current match "project-*"')
                .defaultOrdering([{field: 'title', direction: 'asc'}])
            ])
        ),
      S.listItem()
        .title('Nieuws aanpassen')
        .schemaType('blogPost')
        .child(
          S.list()
            .title('Nieuws aanpassen')
            .items([
              pageBySlug(S, 'Nieuws overzicht', 'nieuws'),
              S.documentTypeListItem('blogPost').title('Nieuwsitems'),
              S.documentTypeListItem('blogCategory').title('Categorieën')
            ])
        ),
      S.listItem()
        .title('Markten aanpassen')
        .schemaType('market')
        .child(
          S.list()
            .title('Markten aanpassen')
            .items([
              pageBySlug(S, 'Markten overzicht', 'markten'),
              marketBySlug(S, 'Halfgeleiderindustrie', 'halfgeleiderindustrie'),
              marketBySlug(S, 'Medische industrie', 'medische-industrie'),
              marketBySlug(S, 'Voedingsmiddelenindustrie', 'voedingsmiddelenindustrie'),
              marketBySlug(S, 'Drank- en zuivelindustrie', 'drank-zuivelindustrie'),
              marketBySlug(S, 'Verpakkingsindustrie', 'verpakkingsindustrie'),
              marketBySlug(S, 'Bouw- en meubelindustrie', 'bouw-meubelindustrie'),
              S.divider(),
              S.documentTypeListItem('market').title('Alle markten')
            ])
        ),
      S.divider(),
      singleton(S, 'siteSettings', 'Contactgegevens en footer'),
      singleton(S, 'navigation', 'Menu aanpassen'),
      S.divider(),
      S.listItem()
        .title('Alles / beheer')
        .child(
          S.list()
            .title('Alles / beheer')
            .items([
              S.documentTypeListItem('page').title('Alle pagina’s'),
              S.documentTypeListItem('service').title('Alle werkzaamheden'),
              S.documentTypeListItem('market').title('Alle markten'),
              S.documentTypeListItem('blogPost').title('Alle nieuwsitems'),
              S.documentTypeListItem('productGroup').title('Productgroepen'),
              S.documentTypeListItem('author').title('Auteurs')
            ])
        )
    ])
