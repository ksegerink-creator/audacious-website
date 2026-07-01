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

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Audacious beheer')
    .items([
      singleton(S, 'homePage', 'Homepage aanpassen'),
      S.divider(),
      S.listItem()
        .title('Paginas aanpassen')
        .schemaType('page')
        .child(
          S.list()
            .title('Paginas aanpassen')
            .items([
              pageBySlug(S, 'Over ons', 'over-ons'),
              pageBySlug(S, 'Contact', 'contact'),
              pageBySlug(S, 'Werken bij Audacious', 'werken-bij-audacious'),
              pageBySlug(S, 'Productievoorbereiding', 'productievoorbereiding'),
              pageBySlug(S, 'Engineering', 'engineering'),
              pageBySlug(S, 'Materialen', 'materialen'),
              pageBySlug(S, 'Werkzaamheden overzicht', 'werkzaamheden'),
              pageBySlug(S, 'Projecten overzicht', 'projecten'),
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
              S.listItem()
                .title('Alle projectpaginas')
                .schemaType('page')
                .child(
                  S.documentList()
                    .title('Alle projectpaginas')
                    .schemaType('page')
                    .filter('_type == "page" && slug.current match "project-*"')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                )
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
              S.documentTypeListItem('page').title('Alle paginas'),
              S.documentTypeListItem('service').title('Alle werkzaamheden'),
              S.documentTypeListItem('market').title('Alle markten'),
              S.documentTypeListItem('productGroup').title('Productgroepen'),
              S.documentTypeListItem('author').title('Auteurs')
            ])
        )
    ])