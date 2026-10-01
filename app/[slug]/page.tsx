import {notFound} from 'next/navigation'
import {cms} from '@/lib/cms'
import {Hero} from '@/components/Hero'
import {CardGrid} from '@/components/CardGrid'

export default async function GenericPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const page: any = await cms.page(slug)
  if (!page) notFound()

  const extraItems = slug === 'werkzaamheden'
    ? await cms.services()
    : slug === 'markten'
      ? await cms.markets()
      : slug === 'producten'
        ? await cms.productGroups()
        : []

  const type = slug === 'werkzaamheden' ? 'service' : slug === 'markten' ? 'market' : 'productGroup'

  return <main><Hero hero={page.hero} />{extraItems.length > 0 && <section className="cms-section"><div className="container"><CardGrid items={extraItems} type={type as any} /></div></section>}</main>
}
