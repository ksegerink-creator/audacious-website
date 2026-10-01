import {notFound} from 'next/navigation'
import {cms} from '@/lib/cms'

export default async function BlogDetailPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const post: any = await cms.post(slug)
  if (!post) notFound()
  return <main className="cms-shell"><section className="cms-section"><div className="container"><p className="cms-kicker">Nieuws</p><h1 className="page-title">{post.title}</h1><p className="page-lead">{post.excerpt}</p></div></section></main>
}
