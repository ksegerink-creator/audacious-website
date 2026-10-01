import {cms} from '@/lib/cms'
import {CardGrid} from '@/components/CardGrid'

export default async function BlogPage() {
  const posts = await cms.posts()
  return <main className="cms-shell"><section className="cms-section"><div className="container"><p className="cms-kicker">Kennisbank</p><h1 className="page-title">Plaatwerkkennis voor <span>betere keuzes.</span></h1></div></section><section className="cms-section"><div className="container"><CardGrid items={posts} type="blogPost" /></div></section></main>
}
