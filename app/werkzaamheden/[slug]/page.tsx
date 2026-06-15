import {notFound} from 'next/navigation'
import {sanityClient} from '@/sanity/lib/client'
import {serviceBySlugQuery} from '@/sanity/lib/queries'
import {Hero} from '@/components/Hero'

export default async function ServicePage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const service = await sanityClient.fetch(serviceBySlugQuery, {slug})
  if (!service) notFound()

  return (
    <main>
      <Hero hero={{eyebrow: 'Werkzaamheid', title: service.title, intro: service.intro, image: service.heroImage}} />
      <section className="cms-section">
        <div className="container">
          <p className="cms-kicker">Specificaties</p>
          <h2 className="page-title">{service.specs?.title || service.title}</h2>
          <div className="cms-grid">
            {(service.specs?.items || []).map((item: any) => (
              <div className="cms-card" key={item.label}>
                <span>{item.label}</span>
                <h3>{item.value}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
