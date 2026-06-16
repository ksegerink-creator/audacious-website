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
      S.documentTypeListItem('page').title('Pagina’s'),
      S.documentTypeListItem('service').title('Werkzaamheden'),
      S.documentTypeListItem('market').title('Markten'),
      S.documentTypeListItem('productGroup').title('Productgroepen'),
      S.divider(),
      S.documentTypeListItem('blogPost').title('Nieuwsitems'),
      S.documentTypeListItem('blogCategory').title('Nieuwscategorieën')
    ])