import {notFound} from 'next/navigation'
import {sanityClient} from '@/sanity/lib/client'
import {pageBySlugQuery, servicesQuery, marketsQuery, productGroupsQuery} from '@/sanity/lib/queries'
import {Hero} from '@/components/Hero'
import {CardGrid} from '@/components/CardGrid'

export default async function GenericPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const page = await sanityClient.fetch(pageBySlugQuery, {slug})
  if (!page) notFound()

  const extraItems = page.slug === 'werkzaamheden'
    ? await sanityClient.fetch(servicesQuery)
    : page.slug === 'markten'
      ? await sanityClient.fetch(marketsQuery)
      : page.slug === 'producten'
        ? await sanityClient.fetch(productGroupsQuery)
        : []

  const type = page.slug === 'werkzaamheden' ? 'service' : page.slug === 'markten' ? 'market' : 'productGroup'

  return (
    <main>
      <Hero hero={page.hero} />
      {extraItems.length > 0 && (
        <section className="cms-section">
          <div className="container">
            <CardGrid items={extraItems} type={type as any} />
          </div>
        </section>
      )}
    </main>
  )
}
