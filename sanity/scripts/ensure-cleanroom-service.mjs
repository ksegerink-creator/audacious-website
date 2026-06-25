import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-02-19'})

const block = (text, key = 'copy') => ({
  _key: key,
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: [{_key: `${key}-span`, _type: 'span', text, marks: []}]
})

const cleanroomReference = {_type: 'reference', _ref: 'service-cleanroom-verpakken'}
const cleanroomChild = {
  _key: 'nav-cleanroom-verpakken',
  _type: 'navigationChild',
  label: 'Cleanroom verpakken',
  linkType: 'internal',
  internalPage: cleanroomReference,
  openInNewTab: false
}

await client.createIfNotExists({
  _id: 'service-cleanroom-verpakken',
  _type: 'service',
  title: 'Cleanroom verpakken',
  slug: {_type: 'slug', current: 'cleanroom-verpakken'},
  order: 8,
  intro: 'Reinigen, controleren en cleanroom verpakken van plaatwerkdelen, samenstellingen en modules volgens de gevraagde productspecificatie.',
  summary: 'Cleanroom verpakken van onderdelen en modules zodat producten schoon, beschermd en traceerbaar worden geleverd.',
  blocks: [
    {
      _key: 'cleanroom-copy',
      _type: 'textBlock',
      eyebrow: 'Werkzaamheid',
      title: 'Cleanroom verpakken als onderdeel van de keten',
      text: [block('Schoon en beschermd leveren is onderdeel van een beheerste productieketen. Audacious stemt reiniging, controle, verpakking en levering af op productspecificatie, toepassing en vervolgstap.', 'cleanroom-copy-text')]
    }
  ],
  seo: {
    _type: 'seo',
    metaTitle: 'Cleanroom verpakken | Audacious Sheet Metal',
    metaDescription: 'Cleanroom verpakken, reinigen en controleren van plaatwerkonderdelen, samenstellingen en modules volgens specificatie.',
    noIndex: false
  }
})

const navigation = await client.fetch('*[_id == "navigation"][0]')

if (navigation) {
  const items = Array.isArray(navigation.items) ? [...navigation.items] : []
  let werkzaamhedenIndex = items.findIndex((item) => String(item.label || '').toLowerCase() === 'werkzaamheden')

  if (werkzaamhedenIndex === -1) {
    items.push({
      _key: 'nav-werkzaamheden',
      _type: 'navigationItem',
      label: 'Werkzaamheden',
      linkType: 'internal',
      internalPage: {_type: 'reference', _ref: 'page-werkzaamheden'},
      openInNewTab: false,
      children: []
    })
    werkzaamhedenIndex = items.length - 1
  }

  const werkzaamhedenItem = {...items[werkzaamhedenIndex]}
  const children = Array.isArray(werkzaamhedenItem.children) ? [...werkzaamhedenItem.children] : []
  const alreadyExists = children.some((child) => child?.internalPage?._ref === 'service-cleanroom-verpakken' || String(child?.label || '').toLowerCase() === 'cleanroom verpakken')

  if (!alreadyExists) {
    children.push(cleanroomChild)
    werkzaamhedenItem.children = children
    items[werkzaamhedenIndex] = werkzaamhedenItem
    await client.patch('navigation').set({items}).commit()
  }
}

const settings = await client.fetch('*[_id == "siteSettings"][0]')

if (settings) {
  const footerColumns = Array.isArray(settings.footerColumns) ? [...settings.footerColumns] : []
  const footerIndex = footerColumns.findIndex((column) => String(column.title || '').toLowerCase() === 'werkzaamheden')

  if (footerIndex !== -1) {
    const column = {...footerColumns[footerIndex]}
    const links = Array.isArray(column.links) ? [...column.links] : []
    const alreadyExists = links.some((link) => link?.internalPage?._ref === 'service-cleanroom-verpakken' || String(link?.label || '').toLowerCase() === 'cleanroom verpakken')

    if (!alreadyExists) {
      links.push({_key: 'footer-cleanroom-verpakken', ...cleanroomChild})
      column.links = links
      footerColumns[footerIndex] = column
      await client.patch('siteSettings').set({footerColumns}).commit()
    }
  }
}

console.log('Cleanroom verpakken staat weer in Sanity als werkzaamheid en in het Werkzaamheden-menu.')
