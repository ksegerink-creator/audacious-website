import {sanityClient} from '@/sanity/lib/client'
import {homePageQuery, blogPostsQuery} from '@/sanity/lib/queries'
import {Hero} from '@/components/Hero'
import {CardGrid} from '@/components/CardGrid'

export default async function HomePage() {
  const [home, posts] = await Promise.all([
    sanityClient.fetch(homePageQuery),
    sanityClient.fetch(blogPostsQuery)
  ])

  return (
    <main>
      <Hero hero={home?.hero} />
      <section className="cms-section">
        <div className="container">
          <p className="cms-kicker">Organisatie</p>
          <h2 className="page-title">{home?.introTitle || 'Onze kracht zit in de organisatie.'}</h2>
          <p className="cms-copy">{home?.introText}</p>
        </div>
      </section>
      <section className="cms-section">
        <div className="container">
          <p className="cms-kicker">Werkzaamheden</p>
          <CardGrid items={home?.featuredServices || []} type="service" />
        </div>
      </section>
      <section className="cms-section">
        <div className="container">
          <p className="cms-kicker">Markten</p>
          <CardGrid items={home?.featuredMarkets || []} type="market" />
        </div>
      </section>
      <section className="cms-section">
        <div className="container">
          <p className="cms-kicker">Producten</p>
          <CardGrid items={home?.featuredProductGroups || []} type="productGroup" />
        </div>
      </section>
      <section className="cms-section">
        <div className="container">
          <p className="cms-kicker">Blog</p>
          <CardGrid items={(posts || []).slice(0, 3)} type="blogPost" />
        </div>
      </section>
    </main>
  )
}
