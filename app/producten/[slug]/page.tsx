import {notFound} from 'next/navigation'
import {sanityClient} from '@/sanity/lib/client'
import {productGroupBySlugQuery} from '@/sanity/lib/queries'
import {Hero} from '@/components/Hero'

export default async function ProductGroupPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const product = await sanityClient.fetch(productGroupBySlugQuery, {slug})
  if (!product) notFound()

  return (
    <main>
      <Hero hero={{eyebrow: 'Productgroep', title: product.title, intro: product.intro, image: product.image}} />
      <section className="cms-section">
        <div className="container">
          <p className="cms-kicker">Toepassingen</p>
          <div className="cms-grid">
            {(product.applications || []).map((item: string) => (
              <div className="cms-card" key={item}>
                <span>Toepassing</span>
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
