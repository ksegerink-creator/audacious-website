import {NavItem, resolveHref} from './linkResolver'

export function SiteNavigation({navigation}: {navigation: {items?: NavItem[]} | null}) {
  const items = navigation?.items || []

  return (
    <nav className="cms-nav" aria-label="Hoofdnavigatie">
      {items.map((item) => (
        <a key={item.label} href={resolveHref(item)}>
          {item.label}
        </a>
      ))}
    </nav>
  )
}
