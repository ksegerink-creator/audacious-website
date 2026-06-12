import {groq} from 'sanity'

export const imageFields = groq`
  asset->{_id, url, metadata {dimensions, lqip}},
  alt,
  caption,
  hotspot,
  crop
`

export const seoFields = groq`
  metaTitle,
  metaDescription,
  noIndex,
  ogImage {${imageFields}}
`

export const ctaFields = groq`
  label,
  linkType,
  url,
  anchor,
  email,
  phone,
  openInNewTab,
  internalPage->{
    _type,
    title,
    "slug": slug.current
  }
`

export const heroFields = groq`
  eyebrow,
  title,
  highlight,
  intro,
  image {${imageFields}},
  primaryCta {${ctaFields}},
  secondaryCta {${ctaFields}}
`

export const navigationQuery = groq`
  *[_type == "navigation"][0]{
    title,
    items[]{
      label,
      linkType,
      url,
      anchor,
      openInNewTab,
      internalPage->{_type, title, "slug": slug.current},
      children[]{
        label,
        linkType,
        url,
        anchor,
        openInNewTab,
        internalPage->{_type, title, "slug": slug.current}
      }
    }
  }
`

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    title,
    companyName,
    tagline,
    email,
    phone,
    address,
    logo {${imageFields}},
    footerColumns[]{
      title,
      links[]{
        label,
        linkType,
        url,
        anchor,
        openInNewTab,
        internalPage->{_type, title, "slug": slug.current}
      }
    },
    seo {${seoFields}}
  }
`

export const homePageQuery = groq`
  *[_type == "homePage"][0]{
    title,
    hero {${heroFields}},
    introTitle,
    introText,
    featuredServices[]->{_id, title, "slug": slug.current, order, intro, summary, heroImage {${imageFields}}} | order(order asc),
    featuredMarkets[]->{_id, title, "slug": slug.current, order, intro, image {${imageFields}}} | order(order asc),
    featuredProductGroups[]->{_id, title, "slug": slug.current, order, intro, image {${imageFields}}} | order(order asc),
    blocks[],
    seo {${seoFields}}
  }
`

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    template,
    hero {${heroFields}},
    blocks[],
    seo {${seoFields}}
  }
`

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    order,
    intro,
    summary,
    heroImage {${imageFields}},
    specs,
    blocks[],
    seo {${seoFields}}
  }
`

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    order,
    intro,
    summary,
    heroImage {${imageFields}}
  }
`

export const marketBySlugQuery = groq`
  *[_type == "market" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    order,
    intro,
    image {${imageFields}},
    relatedServices[]->{_id, title, "slug": slug.current},
    blocks[],
    seo {${seoFields}}
  }
`

export const marketsQuery = groq`
  *[_type == "market"] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    order,
    intro,
    image {${imageFields}}
  }
`

export const productGroupBySlugQuery = groq`
  *[_type == "productGroup" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    order,
    intro,
    image {${imageFields}},
    applications,
    blocks[],
    seo {${seoFields}}
  }
`

export const productGroupsQuery = groq`
  *[_type == "productGroup"] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    order,
    intro,
    image {${imageFields}},
    applications
  }
`

export const blogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    featuredImage {${imageFields}},
    category->{title, "slug": slug.current},
    author->{name, role, image {${imageFields}}},
    publishedAt,
    isFeatured,
    readTime
  }
`

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    featuredImage {${imageFields}},
    category->{title, "slug": slug.current},
    author->{name, role, image {${imageFields}}, bio},
    publishedAt,
    isFeatured,
    readTime,
    body[],
    relatedPosts[]->{title, "slug": slug.current, excerpt, featuredImage {${imageFields}}},
    seo {${seoFields}}
  }
`
