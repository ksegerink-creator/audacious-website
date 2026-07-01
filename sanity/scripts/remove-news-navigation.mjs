import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-02-19'})

const blockedLabels = new Set(['nieuws', 'nieuwsitems'])

function shouldKeep(item) {
  const label = String(item?.label || '').trim().toLowerCase()
  const url = String(item?.url || item?.anchor || '').trim().toLowerCase()
  const ref = String(item?.internalPage?._ref || '').trim().toLowerCase()
  if (blockedLabels.has(label)) return false
  if (url === '/nieuws' || url.startsWith('/nieuws/')) return false
  if (ref === 'page-nieuws') return false
  return true
}

function cleanLinks(items) {
  return (items || [])
    .filter(shouldKeep)
    .map((item) => ({...item, children: cleanLinks(item.children)}))
}

const navigation = await client.fetch('*[_id == "navigation"][0]')
if (navigation) {
  await client.patch('navigation').set({items: cleanLinks(navigation.items)}).commit()
}

const settings = await client.fetch('*[_id == "siteSettings"][0]')
if (settings) {
  const footerColumns = (settings.footerColumns || [])
    .filter((column) => String(column.title || '').trim().toLowerCase() !== 'nieuws')
    .map((column) => ({...column, links: cleanLinks(column.links)}))
  await client.patch('siteSettings').set({footerColumns}).commit()
}

console.log('Nieuws is verwijderd uit Sanity navigatie en footerlinks.')
