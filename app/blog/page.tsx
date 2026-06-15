import {sanityClient} from '@/sanity/lib/client'
import {blogPostsQuery} from '@/sanity/lib/queries'
import {CardGrid} from '@/components/CardGrid'

export default async function BlogPage() {
  const posts = await sanityClient.fetch(blogPostsQuery)

  return (
    <main className="cms-shell">
      <section className="cms-section">
        <div className="container">
          <p className="cms-kicker">Kennisbank</p>
          <h1 className="page-title">Plaatwerkkennis voor <span>betere keuzes.</span></h1>
          <p className="page-lead">Artikelen over maakbaarheid, materiaalkeuze, engineering, productieplanning en ketenregie.</p>
        </div>
      </section>
      <section className="cms-section">
        <div className="container">
          <CardGrid items={posts || []} type="blogPost" />
        </div>
      </section>
    </main>
  )
}
