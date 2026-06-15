import {resolveHref} from './linkResolver'

export function CardGrid({items, type}: {items: any[]; type: 'service' | 'market' | 'productGroup' | 'blogPost'}) {
  const hrefType = type === 'service' ? 'service' : type === 'market' ? 'market' : type === 'productGroup' ? 'productGroup' : 'blogPost'

  return (
    <div className="cms-grid">
      {(items || []).map((item) => (
        <a
          className="cms-card"
          key={item._id || item.slug}
          href={resolveHref({label: item.title, linkType: 'internal', internalPage: {_type: hrefType, slug: item.slug}})}
        >
          <div>
            <span>{item.category?.title || item.readTime || item.order || 'Audacious'}</span>
            <h3>{item.title}</h3>
            <p>{item.intro || item.summary || item.excerpt}</p>
          </div>
        </a>
      ))}
    </div>
  )
}
