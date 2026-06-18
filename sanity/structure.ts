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
    .title('Audacious CMS')
    .items([
      singleton(S, 'siteSettings', 'Site instellingen'),
      singleton(S, 'navigation', 'Navigatie'),
      singleton(S, 'homePage', 'Homepage'),
      S.divider(),
      S.listItem()
        .title('Pagina’s')
        .schemaType('page')
        .child(
          S.list()
            .title('Pagina’s')
            .items([
              S.listItem()
                .title('Algemene pagina’s')
                .schemaType('page')
                .child(
                  S.documentList()
                    .title('Algemene pagina’s')
                    .schemaType('page')
                    .filter('_type == "page" && slug.current in ["over-ons", "contact"]')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                ),
              S.listItem()
                .title('Overige / verborgen pagina’s')
                .schemaType('page')
                .child(
                  S.documentList()
                    .title('Overige / verborgen pagina’s')
                    .schemaType('page')
                    .filter('_type == "page" && !(slug.current in ["over-ons", "contact", "productievoorbereiding", "engineering", "materialen", "werkzaamheden", "markten", "projecten", "nieuws"]) && !(slug.current match "project-*")')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                )
            ])
        ),
      S.listItem()
        .title('Productievoorbereiding')
        .schemaType('page')
        .child(
          S.list()
            .title('Productievoorbereiding')
            .items([
              pageBySlug(S, 'Overzichtspagina', 'productievoorbereiding'),
              S.listItem()
                .title('Subpagina’s')
                .schemaType('page')
                .child(
                  S.documentList()
                    .title('Subpagina’s productievoorbereiding')
                    .schemaType('page')
                    .filter('_type == "page" && slug.current in ["engineering", "materialen"]')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                )
            ])
        ),
      S.listItem()
        .title('Werkzaamheden')
        .schemaType('service')
        .child(
          S.list()
            .title('Werkzaamheden')
            .items([
              pageBySlug(S, 'Overzichtspagina', 'werkzaamheden'),
              S.listItem()
                .title('Bewerkingen')
                .schemaType('service')
                .child(
                  S.documentList()
                    .title('Bewerkingen')
                    .schemaType('service')
                    .filter('_type == "service"')
                    .defaultOrdering([{field: 'order', direction: 'asc'}, {field: 'title', direction: 'asc'}])
                )
            ])
        ),
      S.listItem()
        .title('Markten')
        .schemaType('market')
        .child(
          S.list()
            .title('Markten')
            .items([
              pageBySlug(S, 'Overzichtspagina', 'markten'),
              S.listItem()
                .title('Marktdetailpagina’s')
                .schemaType('market')
                .child(
                  S.documentList()
                    .title('Marktdetailpagina’s')
                    .schemaType('market')
                    .filter('_type == "market"')
                    .defaultOrdering([{field: 'order', direction: 'asc'}, {field: 'title', direction: 'asc'}])
                )
            ])
        ),
      S.listItem()
        .title('Projecten')
        .schemaType('page')
        .child(
          S.list()
            .title('Projecten')
            .items([
              pageBySlug(S, 'Overzichtspagina', 'projecten'),
              S.listItem()
                .title('Projectdetailpagina’s')
                .schemaType('page')
                .child(
                  S.documentList()
                    .title('Projectdetailpagina’s')
                    .schemaType('page')
                    .filter('_type == "page" && slug.current match "project-*"')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                )
            ])
        ),
      S.listItem()
        .title('Nieuws')
        .schemaType('blogPost')
        .child(
          S.list()
            .title('Nieuws')
            .items([
              pageBySlug(S, 'Overzichtspagina', 'nieuws'),
              S.documentTypeListItem('blogPost').title('Nieuwsitems'),
              S.documentTypeListItem('blogCategory').title('Nieuwscategorieën')
            ])
        )
    ])