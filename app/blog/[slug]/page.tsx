import {notFound} from 'next/navigation'
import {PortableText} from '@portabletext/react'
import {sanityClient} from '@/sanity/lib/client'
import {blogPostBySlugQuery} from '@/sanity/lib/queries'

export default async function BlogDetailPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const post = await sanityClient.fetch(blogPostBySlugQuery, {slug})
  if (!post) notFound()

  return (
    <main className="cms-shell">
      <section className="cms-section">
        <div className="container">
          <p className="cms-kicker">{post.category?.title || 'Blog'}</p>
          <h1 className="page-title">{post.title}</h1>
          <p className="page-lead">{post.excerpt}</p>
        </div>
      </section>
      <section className="cms-section">
        <div className="container" style={{maxWidth: 860}}>
          <PortableText value={post.body || []} />
        </div>
      </section>
    </main>
  )
}
