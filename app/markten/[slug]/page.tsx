import {notFound} from 'next/navigation'
import {sanityClient} from '@/sanity/lib/client'
import {marketBySlugQuery} from '@/sanity/lib/queries'
import {Hero} from '@/components/Hero'
import {CardGrid} from '@/components/CardGrid'

export default async function MarketPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const market = await sanityClient.fetch(marketBySlugQuery, {slug})
  if (!market) notFound()

  return (
    <main>
      <Hero hero={{eyebrow: 'Markt', title: market.title, intro: market.intro, image: market.image}} />
      <section className="cms-section">
        <div className="container">
          <p className="cms-kicker">Gerelateerde werkzaamheden</p>
          <CardGrid items={market.relatedServices || []} type="service" />
        </div>
      </section>
    </main>
  )
}
