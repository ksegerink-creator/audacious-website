export function Hero({hero}: {hero: any}) {
  return (
    <section className="page-hero cms-shell">
      <div className="container page-hero-grid">
        <div>
          {hero?.eyebrow && <p className="page-kicker">{hero.eyebrow}</p>}
          <h1 className="page-title">
            {hero?.title || 'Audacious'} {hero?.highlight && <span>{hero.highlight}</span>}
          </h1>
          {hero?.intro && <p className="page-lead">{hero.intro}</p>}
        </div>
        <div className="page-hero-side">
          <div className="page-hero-media" style={{backgroundImage: hero?.image?.asset?.url ? `url(${hero.image.asset.url})` : undefined}}>
            <span className="page-hero-media-label">Audacious</span>
            <div className="page-hero-media-copy">
              <strong>Voor intelligent plaatwerk.</strong>
              <span>Engineering, plaatbewerking, lassen en assemblage.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
