import {sanityClient} from '@/sanity/lib/client'
import {homePageQuery} from '@/sanity/lib/queries'

export default async function HomePage() {
  const home = await sanityClient.fetch(homePageQuery)
  const hero = home?.hero || {}

  return (
    <main>
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grid-pattern" />
          <div className="hero-noise" />
          <div className="hero-glow" />
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge"><div className="hero-badge-dot" /><span>{hero.eyebrow || 'Voor intelligent plaatwerk'}</span></div>
            <h1 className="display-xl hero-title">{hero.title || 'Plaatwerkproductie voor industriele OEM-bedrijven'}{hero.highlight ? <><br /><em>{hero.highlight}</em></> : null}</h1>
            <p className="body-lead hero-sub">{hero.intro}</p>
            <div className="hero-actions"><a href="/contact" className="btn btn-primary btn-arrow">Offerte aanvragen</a><a href="/werkzaamheden" className="btn btn-outline">Bekijk werkzaamheden</a></div>
            <div className="hero-micro"><div className="hero-micro-item"><div className="hero-micro-dot" /><span>Engineering</span></div><div className="hero-micro-item"><div className="hero-micro-dot" /><span>Plaatbewerking</span></div><div className="hero-micro-item"><div className="hero-micro-dot" /><span>Lassen</span></div><div className="hero-micro-item"><div className="hero-micro-dot" /><span>Assemblage</span></div></div>
          </div>
        </div>
      </section>

      <section className="section intro" id="intro"><div className="container"><div className="intro-inner"><div className="intro-left fade-up"><div className="intro-overline"><div className="intro-overline-line" /><span className="eyebrow">Wie wij zijn</span></div><h2 className="display-md intro-title">{home?.introTitle || 'Onze kracht zit in de organisatie.'}</h2><p className="body-lead intro-body">{home?.introText}</p><a href="/over-ons" className="btn btn-outline btn-arrow">Meer over Audacious</a></div><div className="intro-visual fade-up fade-up-delay-2"><div className="intro-visual-inner"><div className="intro-visual-bg" /><div className="intro-visual-centerpiece"><div className="metal-shape"><div className="metal-frame"><div className="metal-corner tl" /><div className="metal-corner tr" /><div className="metal-corner bl" /><div className="metal-corner br" /><div className="crosshair" /></div><div className="metal-label">ASSY-2024 / STAAL / RVS / ALU</div></div></div></div></div></div></div></section>

      <section className="section--tight proof" id="kernpunten"><div className="container"><div className="proof-grid"><div className="proof-item fade-up"><div className="proof-accent-line" /><div className="proof-title">OEM-productiepartner</div><p className="proof-body">Vaste productierelaties met machinebouwers, system integrators en industriele OEM-bedrijven.</p></div><div className="proof-item fade-up fade-up-delay-1"><div className="proof-accent-line" /><div className="proof-title">Enkelstuks en kleine series</div><p className="proof-body">Flexibele productie zonder minimale afnameverplichtingen. Vanaf een onderdeel.</p></div><div className="proof-item fade-up fade-up-delay-2"><div className="proof-accent-line" /><div className="proof-title">Staal, RVS en aluminium</div><p className="proof-body">Volledig bewerkingspakket in gangbare constructiematerialen voor industriële toepassing.</p></div><div className="proof-item fade-up fade-up-delay-3"><div className="proof-accent-line" /><div className="proof-title">Engineering tot assemblage</div><p className="proof-body">Een aanspreekpunt voor het volledige traject: van tekening tot afgeleverd product.</p></div></div></div></section>
      <section className="section services" id="werkzaamheden"><div className="container"><h2>Werkzaamheden</h2></div></section>
    </main>
  )
}
