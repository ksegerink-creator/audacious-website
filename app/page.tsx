import {cms} from '@/lib/cms'

export default async function HomePage() {
  const home: any = await cms.homepage()
  const hero = home?.hero || {}
  return (
    <main>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge"><span>{hero.eyebrow || 'Voor intelligent en gedurfd plaatwerk'}</span></div>
            <h1 className="display-xl hero-title">{hero.title || 'Voor intelligent'}{hero.highlight ? <><br /><em>{hero.highlight}</em></> : null}</h1>
            <p className="body-lead hero-sub">{hero.intro}</p>
          </div>
        </div>
      </section>
    </main>
  )
}
