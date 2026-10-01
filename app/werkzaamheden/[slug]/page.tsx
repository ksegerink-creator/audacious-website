import {notFound} from 'next/navigation'
import {cms} from '@/lib/cms'
import {Hero} from '@/components/Hero'

export default async function ServicePage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const service: any = await cms.service(slug)
  if (!service) notFound()
  return <main><Hero hero={{eyebrow:'Werkzaamheid',title:service.title,intro:service.intro,image:service.heroImage}} /></main>
}
