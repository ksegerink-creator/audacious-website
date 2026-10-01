export function Hero({hero}: {hero: any}) {
  const image = typeof hero?.image === 'string' ? hero.image : undefined
  return <section className="page-hero cms-shell"><div className="container page-hero-grid"><div>{hero?.eyebrow && <p className="page-kicker">{hero.eyebrow}</p>}<h1 className="page-title">{hero?.title || 'Audacious'} {hero?.highlight && <span>{hero.highlight}</span>}</h1>{hero?.intro && <p className="page-lead">{hero.intro}</p>}</div><div className="page-hero-side"><div className="page-hero-media" style={{backgroundImage:image ? `url(${image})` : undefined}} /></div></div></section>
}
