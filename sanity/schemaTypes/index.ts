import {siteSettings} from './documents/siteSettings'
import {navigation} from './documents/navigation'
import {homePage} from './documents/homePage'
import {page} from './documents/page'
import {service} from './documents/service'
import {market} from './documents/market'
import {productGroup} from './documents/productGroup'
import {blogPost} from './documents/blogPost'
import {blogCategory} from './documents/blogCategory'
import {author} from './documents/author'
import {seo} from './objects/seo'
import {hero} from './objects/hero'
import {cta} from './objects/cta'
import {textBlock, imageBlock, imageTextBlock, specList, faqBlock} from './objects/contentBlocks'
import {navigationItem, navigationChild} from './objects/navigationItem'

export const schemaTypes = [
  siteSettings,
  navigation,
  homePage,
  page,
  service,
  market,
  productGroup,
  blogPost,
  blogCategory,
  author,
  seo,
  hero,
  cta,
  textBlock,
  imageBlock,
  imageTextBlock,
  specList,
  faqBlock,
  navigationItem,
  navigationChild
]
