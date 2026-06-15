import {NavItem, resolveHref} from './linkResolver'

export function SiteNavigation({navigation}: {navigation: {items?: NavItem[]} | null}) {
  const items = navigation?.items || []

  return (
    <header className="cms-nav-shell">
      <a className="cms-brand-pill" href="/" aria-label="Audacious homepage">
        <span className="cms-brand-mark" aria-hidden="true">◆</span>
        <span>Audacious</span>
      </a>
      <div className="cms-menu-wrap">
        <button className="cms-menu-pill" type="button">
          <span>Menu</span>
          <i aria-hidden="true" />
        </button>
        <nav className="cms-menu-panel" aria-label="Hoofdnavigatie">
          {items.map((item) => (
            <div className="cms-menu-group" key={item.label}>
              <a href={resolveHref(item)}>{item.label}</a>
              {item.children && item.children.length > 0 && (
                <div className="cms-menu-children">
                  {item.children.map((child) => (
                    <a key={child.label} href={resolveHref(child)}>{child.label}</a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  )
}
