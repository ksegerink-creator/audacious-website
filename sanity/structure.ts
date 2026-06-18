import type {StructureResolver} from 'sanity/structure'

const singleton = (S: any, type: string, title: string) =>
  S.listItem()
    .title(title)
    .schemaType(type)
    .child(S.document().schemaType(type).documentId(type).title(title))

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
          S.documentList()
            .title('Pagina’s')
            .schemaType('page')
            .filter('_type == "page" && slug.current != "projecten" && !(slug.current match "project-*")')
            .defaultOrdering([{field: 'title', direction: 'asc'}])
        ),
      S.listItem()
        .title('Projecten')
        .schemaType('page')
        .child(
          S.list()
            .title('Projecten')
            .items([
              S.listItem()
                .title('Overzichtspagina')
                .schemaType('page')
                .child(
                  S.documentList()
                    .title('Projecten overzicht')
                    .schemaType('page')
                    .filter('_type == "page" && slug.current == "projecten"')
                ),
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
      S.documentTypeListItem('service').title('Werkzaamheden'),
      S.documentTypeListItem('market').title('Markten'),
      S.divider(),
      S.documentTypeListItem('blogPost').title('Nieuwsitems'),
      S.documentTypeListItem('blogCategory').title('Nieuwscategorieën')
    ])