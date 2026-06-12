export type LinkTarget = {
  _type?: string
  title?: string
  slug?: string
}

export type NavItem = {
  label: string
  linkType?: string
  url?: string
  anchor?: string
  internalPage?: LinkTarget
  children?: NavItem[]
}

export function resolveHref(item: NavItem) {
  if (item.linkType === 'external') return item.url || '#'
  if (item.linkType === 'anchor') return item.anchor || '#'
  if (!item.internalPage) return '#'

  const type = item.internalPage._type
  const slug = item.internalPage.slug

  if (type === 'homePage') return '/'
  if (!slug) return '#'
  if (type === 'service') return `/werkzaamheden/${slug}`
  if (type === 'market') return `/markten/${slug}`
  if (type === 'productGroup') return `/producten/${slug}`
  if (type === 'blogPost') return `/blog/${slug}`
  return `/${slug}`
}
