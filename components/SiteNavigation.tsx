export function SiteNavigation({navigation}: {navigation: {items?: any[]} | null}) {
  const items = navigation?.items || []
  return <header className="cms-nav-shell"><a className="cms-brand-pill" href="/" aria-label="Audacious homepage"><span>Audacious</span></a><nav className="cms-menu-panel" aria-label="Hoofdnavigatie">{items.map(item => <div className="cms-menu-group" key={item.label}><a href={item.href || '#'}>{item.label}</a>{item.children?.length ? <div className="cms-menu-children">{item.children.map((child:any)=><a key={child.label} href={child.href || '#'}>{child.label}</a>)}</div> : null}</div>)}</nav></header>
}
