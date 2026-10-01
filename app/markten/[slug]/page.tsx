import {notFound} from 'next/navigation'
import {cms} from '@/lib/cms'
import {Hero} from '@/components/Hero'
import {CardGrid} from '@/components/CardGrid'

export default async function MarketPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const market: any = await cms.market(slug)
  if (!market) notFound()
  const allServices = await cms.services()
  const related = allServices.filter((item: any) => (market.relatedServices || []).includes(item.slug))
  return <main><Hero hero={{eyebrow:'Markt',title:market.title,intro:market.intro,image:market.image}} /><section className="cms-section"><div className="container"><CardGrid items={related} type="service" /></div></section></main>
}
