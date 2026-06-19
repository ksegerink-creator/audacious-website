const AUDACIOUS_PAGE_IMAGE_PROJECT_ID = 'wehjzlhm';
const AUDACIOUS_PAGE_IMAGE_DATASET = 'production';
const AUDACIOUS_PAGE_IMAGE_API_VERSION = '2025-02-19';

function audaciousEscape(value) {
  return String(value || '').replace(/[&<>"]/g, (char) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[char]));
}

function audaciousTextToHtml(value) {
  return String(value || '').split('\n').map((line) => line.trim()).filter(Boolean).map(audaciousEscape).join('<br>');
}

function audaciousPortableTextToHtml(blocks = []) {
  if (!Array.isArray(blocks)) return '';
  return blocks.map((block) => {
    if (block._type !== 'block') return '';
    const text = (block.children || []).map((child) => child.text || '').join('');
    if (!text.trim()) return '';
    const html = audaciousTextToHtml(text);
    if (block.style === 'h2') return `<h2>${html}</h2>`;
    if (block.style === 'h3') return `<h3>${html}</h3>`;
    if (block.style === 'blockquote') return `<blockquote>${html}</blockquote>`;
    return `<p>${html}</p>`;
  }).join('');
}

function audaciousResolveCtaHref(cta = {}) {
  if (!cta) return '';
  if (cta.linkType === 'external') return cta.url || '';
  if (cta.linkType === 'anchor') return cta.anchor || '';
  if (cta.linkType === 'email') return cta.email ? `mailto:${cta.email}` : '';
  if (cta.linkType === 'phone') return cta.phone ? `tel:${String(cta.phone).replace(/[^+0-9]/g, '')}` : '';
  const target = cta.internalPage;
  if (!target) return '';
  const slug = target.slug;
  if (!slug) return '';
  if (target._type === 'service') return `../pages/${slug}.html`;
  if (target._type === 'market') return `../pages/${slug}.html`;
  if (target._type === 'blogPost') return `../html/${slug}.html`;
  return slug === 'index' ? '../html/index.html' : `../html/${slug}.html`;
}

function audaciousSanityImageUrl(url, width = 2200) {
  if (!url) return '';
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}auto=format&fit=crop&w=${width}&q=88`;
}

function audaciousCurrentSlug() {
  const filename = window.location.pathname.split('/').pop() || 'index.html';
  return filename.replace(/\.html$/, '');
}

function audaciousSetText(selector, value, root = document) {
  const element = root.querySelector(selector);
  if (element && value !== undefined && value !== null && String(value).trim()) element.textContent = value;
}

function audaciousSetHtml(selector, value, root = document) {
  const element = root.querySelector(selector);
  if (element && value !== undefined && value !== null && String(value).trim()) element.innerHTML = value;
}

function audaciousSetMeta(selector, value) {
  const element = document.querySelector(selector);
  if (element && value) element.setAttribute('content', value);
}

function audaciousSetPageHeroImage(url) {
  if (!url) return false;
  const imageUrl = audaciousSanityImageUrl(url, 2400);
  const escaped = `url('${imageUrl}')`;
  document.documentElement.style.setProperty('--page-image', escaped);
  document.querySelectorAll('.page-hero, .page-hero-media').forEach((element) => {
    element.style.setProperty('--page-image', escaped);
    element.dataset.sanityHeroImage = imageUrl;
  });
  document.querySelector('.page-hero')?.classList.add('has-sanity-hero-image');
  document.querySelector('.page-hero-media')?.classList.add('has-sanity-hero-image');
  return true;
}

function audaciousApplySeo(doc) {
  const metaTitle = doc?.seo?.metaTitle || doc?.title;
  const metaDescription = doc?.seo?.metaDescription || doc?.hero?.intro || doc?.intro || doc?.excerpt;
  if (metaTitle) document.title = metaTitle;
  audaciousSetMeta('meta[name="description"]', metaDescription);
  audaciousSetMeta('meta[property="og:title"]', metaTitle);
  audaciousSetMeta('meta[property="og:description"]', metaDescription);
  audaciousSetMeta('meta[name="twitter:title"]', metaTitle);
  audaciousSetMeta('meta[name="twitter:description"]', metaDescription);
}

function audaciousApplyHero(doc, type) {
  if (!doc) return;
  const hero = doc.hero || {};
  const title = hero.title || doc.title;
  const highlight = hero.highlight;
  const intro = hero.intro || doc.intro || doc.excerpt || doc.summary;
  const eyebrow = hero.eyebrow || doc.categoryTitle || (type === 'service' ? 'Werkzaamheid' : type === 'market' ? 'Markt' : type === 'news' ? 'Nieuws' : 'Pagina');

  audaciousSetText('.page-kicker', eyebrow);
  if (title) {
    const titleHtml = audaciousTextToHtml(title);
    audaciousSetHtml('.page-title', highlight ? `${titleHtml} <span>${audaciousEscape(highlight)}</span>` : titleHtml);
  }
  audaciousSetText('.page-lead', intro);

  const imageUrl = hero.imageUrl || doc.imageUrl || doc.heroImageUrl || doc.featuredImageUrl;
  if (imageUrl) audaciousSetPageHeroImage(imageUrl);

  const primary = hero.primaryCta || doc.closingCta?.button;
  const primaryHref = audaciousResolveCtaHref(primary);
  if (primary?.label && document.querySelector('.page-cta a')) {
    audaciousSetText('.page-cta a', primary.label);
    document.querySelector('.page-cta a').setAttribute('href', primaryHref || '#');
  }
}

function audaciousApplyHeroPanel(panel) {
  if (!panel) return;
  audaciousSetText('.page-hero-media-label', panel.eyebrow);
  audaciousSetText('.page-hero-media-copy strong', panel.title);
  audaciousSetText('.page-hero-media-copy span', panel.text);
  audaciousSetText('.page-panel-head span:first-child', panel.panelLabel);
  audaciousSetText('.page-panel-head span:last-child', panel.panelCode);
  if (Array.isArray(panel.rows) && panel.rows.length) {
    const list = document.querySelector('.page-panel-list');
    if (list) list.innerHTML = panel.rows.map((row) => `<div class="page-panel-row"><span>${audaciousEscape(row.label)}</span><strong>${audaciousEscape(row.value)}</strong></div>`).join('');
  }
}

function audaciousEnsureCmsStyles() {
  if (document.getElementById('audacious-cms-renderer-styles')) return;
  const style = document.createElement('style');
  style.id = 'audacious-cms-renderer-styles';
  style.textContent = `
    .cms-rendered-section{padding:clamp(4.5rem,7vw,7rem) 0;border-top:1px solid rgba(17,17,15,.08);background:#f8f6f2;color:#11110f}.cms-rendered-section:nth-of-type(even){background:#fff}.cms-grid{display:grid;grid-template-columns:minmax(220px,.55fr) 1fr;gap:clamp(2rem,5vw,6rem);align-items:start}.cms-kicker{margin:0 0 .9rem;color:#f58220;font-family:'Courier New',monospace;font-size:.78rem;font-weight:800;letter-spacing:.13em;text-transform:uppercase}.cms-title{margin:0;font-family:var(--font-display);font-size:clamp(2.8rem,5.8vw,6.25rem);line-height:.92;letter-spacing:-.08em;color:#11110f}.cms-copy{max-width:760px;color:#5f5d58;font-size:1.02rem;line-height:1.7}.cms-copy p{margin:0 0 1rem}.cms-copy h2,.cms-copy h3{color:#11110f;line-height:1.05;letter-spacing:-.05em}.cms-image{margin:0}.cms-image img{width:100%;display:block;min-height:360px;object-fit:cover;border:1px solid rgba(17,17,15,.16)}.cms-image figcaption{margin-top:.75rem;color:#77736d;font-size:.9rem}.cms-specs,.cms-cards{display:grid;gap:1px;background:rgba(17,17,15,.14);border:1px solid rgba(17,17,15,.14)}.cms-spec-row,.cms-card{background:rgba(255,255,255,.8);padding:clamp(1.2rem,2.5vw,2rem)}.cms-spec-row{display:grid;grid-template-columns:1fr 2fr;gap:1rem}.cms-spec-row span,.cms-card-number{color:#f58220;font-size:.78rem;font-weight:800}.cms-spec-row strong,.cms-card h3{color:#11110f;font-size:clamp(1.35rem,2vw,2rem);line-height:1.05;letter-spacing:-.05em}.cms-cards{grid-template-columns:repeat(3,minmax(0,1fr))}.cms-card p{color:#5f5d58;line-height:1.6}.cms-card a{display:inline-flex;margin-top:1rem;color:#11110f;font-weight:800;text-decoration:none;border-bottom:1px solid #f58220}.cms-cta{background:#11110f;color:#fff}.cms-cta .cms-title,.cms-cta .cms-copy{color:#fff}.project-gallery-section{padding:clamp(4rem,7vw,7rem) 0;background:#f8f6f2;color:#11110f;border-top:1px solid rgba(17,17,15,.08)}.project-gallery-head{display:block;margin-bottom:clamp(2rem,4vw,3rem)}.project-gallery-kicker{margin:0 0 .8rem;color:#f58220;font-family:'Courier New',monospace;font-size:.78rem;font-weight:800;letter-spacing:.13em;text-transform:uppercase}.project-gallery-title{max-width:760px;margin:0;font-family:var(--font-display);font-size:clamp(3rem,6vw,6.5rem);line-height:.9;letter-spacing:-.08em;color:#11110f}.project-gallery-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:rgba(17,17,15,.16);border:1px solid rgba(17,17,15,.16)}.project-gallery-item{position:relative;min-height:clamp(260px,32vw,520px);overflow:hidden;background:#11110f}.project-gallery-item:first-child{grid-column:span 2}.project-gallery-item img{width:100%;height:100%;object-fit:cover;display:block}.project-gallery-caption{position:absolute;left:1rem;right:1rem;bottom:1rem;display:flex;justify-content:space-between;gap:1rem;padding:.8rem 1rem;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(0,0,0,.42);backdrop-filter:blur(14px);color:#fff;font-size:.82rem;font-weight:700}@media(max-width:900px){.cms-grid,.cms-cards{grid-template-columns:1fr}.project-gallery-grid{grid-template-columns:1fr}.project-gallery-item:first-child{grid-column:auto}.cms-spec-row{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
}

function audaciousRenderBlock(block, index) {
  if (!block) return '';
  const left = `<div>${block.eyebrow ? `<p class="cms-kicker">${audaciousEscape(block.eyebrow)}</p>` : ''}${block.title ? `<h2 class="cms-title">${audaciousTextToHtml(block.title)}</h2>` : ''}${block.intro ? `<p class="cms-copy">${audaciousEscape(block.intro)}</p>` : ''}</div>`;
  if (block._type === 'textBlock') return `<section class="cms-rendered-section"><div class="container cms-grid">${left}<div class="cms-copy">${audaciousPortableTextToHtml(block.text)}</div></div></section>`;
  if (block._type === 'imageBlock') return `<section class="cms-rendered-section"><div class="container"><figure class="cms-image"><img src="${audaciousSanityImageUrl(block.imageUrl, 1800)}" alt="${audaciousEscape(block.alt || block.caption || '')}" loading="lazy">${block.caption ? `<figcaption>${audaciousEscape(block.caption)}</figcaption>` : ''}</figure></div></section>`;
  if (block._type === 'imageTextBlock') {
    const image = `<figure class="cms-image"><img src="${audaciousSanityImageUrl(block.imageUrl, 1400)}" alt="${audaciousEscape(block.alt || block.title || '')}" loading="lazy"></figure>`;
    const text = `<div>${block.eyebrow ? `<p class="cms-kicker">${audaciousEscape(block.eyebrow)}</p>` : ''}${block.title ? `<h2 class="cms-title">${audaciousTextToHtml(block.title)}</h2>` : ''}<div class="cms-copy">${audaciousPortableTextToHtml(block.text)}</div>${block.cta?.label ? `<p><a href="${audaciousResolveCtaHref(block.cta)}">${audaciousEscape(block.cta.label)}</a></p>` : ''}</div>`;
    return `<section class="cms-rendered-section"><div class="container cms-grid">${block.imagePosition === 'left' ? image + text : text + image}</div></section>`;
  }
  if (block._type === 'specList') return `<section class="cms-rendered-section"><div class="container cms-grid">${left}<div class="cms-specs">${(block.items || []).map((item) => `<div class="cms-spec-row"><span>${audaciousEscape(item.label)}</span><strong>${audaciousEscape(item.value)}</strong></div>`).join('')}</div></div></section>`;
  if (block._type === 'cardGrid') return `<section class="cms-rendered-section"><div class="container cms-grid">${left}<div class="cms-cards">${(block.items || []).map((item, cardIndex) => `<article class="cms-card"><span class="cms-card-number">${String(cardIndex + 1).padStart(2, '0')}</span><h3>${audaciousEscape(item.title)}</h3><p>${audaciousEscape(item.text)}</p>${item.cta?.label ? `<a href="${audaciousResolveCtaHref(item.cta)}">${audaciousEscape(item.cta.label)} →</a>` : ''}</article>`).join('')}</div></div></section>`;
  if (block._type === 'ctaBlock') return `<section class="cms-rendered-section cms-cta"><div class="container cms-grid">${left}<div class="cms-copy">${block.text ? `<p>${audaciousEscape(block.text)}</p>` : ''}${block.cta?.label ? `<p><a href="${audaciousResolveCtaHref(block.cta)}">${audaciousEscape(block.cta.label)} →</a></p>` : ''}</div></div></section>`;
  if (block._type === 'faqBlock') return `<section class="cms-rendered-section"><div class="container cms-grid">${left}<div class="cms-specs">${(block.items || []).map((item) => `<div class="cms-spec-row"><span>${audaciousEscape(item.question)}</span><strong>${audaciousEscape(item.answer)}</strong></div>`).join('')}</div></div></section>`;
  return '';
}

function audaciousRenderBlocks(blocks = []) {
  if (!Array.isArray(blocks) || !blocks.length) return;
  const main = document.querySelector('.page-shell');
  const hero = document.querySelector('.page-hero');
  if (!main || !hero) return;
  audaciousEnsureCmsStyles();
  main.querySelectorAll('.page-section').forEach((section) => section.remove());
  const html = blocks.map(audaciousRenderBlock).join('');
  hero.insertAdjacentHTML('afterend', html);
}

function audaciousRenderPageGallery(doc) {
  const validImages = (doc?.gallery || []).filter((image) => image && image.url);
  if (!validImages.length || document.querySelector('.project-gallery-section')) return;
  const main = document.querySelector('.page-shell');
  if (!main) return;
  audaciousEnsureCmsStyles();
  const eyebrow = doc.galleryEyebrow || 'Projectfoto’s';
  const title = doc.galleryTitle || 'Beeld van het project.';
  const section = document.createElement('section');
  section.className = 'project-gallery-section';
  section.innerHTML = `<div class="container"><div class="project-gallery-head"><p class="project-gallery-kicker">${audaciousEscape(eyebrow)}</p><h2 class="project-gallery-title">${audaciousTextToHtml(title)}</h2></div><div class="project-gallery-grid">${validImages.map((image, index) => `<figure class="project-gallery-item"><img src="${audaciousSanityImageUrl(image.url, index === 0 ? 1800 : 1100)}" alt="${audaciousEscape(image.alt || image.caption || '')}" loading="lazy"><figcaption class="project-gallery-caption"><span>${audaciousEscape(image.caption || `Foto ${String(index + 1).padStart(2, '0')}`)}</span><span>${String(index + 1).padStart(2, '0')}</span></figcaption></figure>`).join('')}</div></div>`;
  const anchor = main.querySelector('.cms-rendered-section:last-of-type') || main.querySelector('.page-section:first-of-type') || main.lastElementChild;
  if (anchor) anchor.insertAdjacentElement('afterend', section);
  else main.appendChild(section);
}

function audaciousApplyClosingCta(doc) {
  const cta = doc?.closingCta;
  if (!cta) return;
  audaciousSetText('.page-cta h2', cta.title);
  if (cta.button?.label) {
    const link = document.querySelector('.page-cta a');
    if (link) {
      link.textContent = cta.button.label;
      link.href = audaciousResolveCtaHref(cta.button) || '#';
      if (cta.button.openInNewTab) {
        link.target = '_blank';
        link.rel = 'noopener';
      }
    }
  }
}

function audaciousApplyFooter(settings) {
  if (!settings) return;
  const company = settings.companyName || settings.title;
  const email = settings.email;
  const phone = settings.phone;
  const address = settings.address ? String(settings.address).split('\n').filter(Boolean).join(', ') : '';
  audaciousSetText('.simple-footer span:first-child', company ? `© 2026 ${company}` : '');
  audaciousSetText('.simple-footer span:last-child', address);
  audaciousSetText('.footer-brand p', settings.tagline || '');
  if (email) {
    document.querySelectorAll('a[href^="mailto:"]').forEach((link) => { if (link.textContent.includes('@') || link.href.includes('info@audacious.com')) { link.textContent = email; link.href = `mailto:${email}`; } });
  }
  if (phone) {
    document.querySelectorAll('a[href^="tel:"]').forEach((link) => { link.textContent = phone; link.href = `tel:${phone.replace(/[^+0-9]/g, '')}`; });
  }
}

async function audaciousFetchPageContent(slug) {
  const blockFields = `
    _type, eyebrow, title, intro, text, imagePosition, alt, caption,
    "imageUrl": image.asset->url,
    cta{label, linkType, url, anchor, email, phone, openInNewTab, internalPage->{_type, "slug": slug.current}},
    items[]{label, value, title, text, question, answer, cta{label, linkType, url, anchor, email, phone, openInNewTab, internalPage->{_type, "slug": slug.current}}}
  `;
  const query = `{
    "page": *[_type == "page" && slug.current == $slug][0]{title, slug, hero{eyebrow,title,highlight,intro,"imageUrl": image.asset->url, primaryCta{label,linkType,url,anchor,email,phone,openInNewTab,internalPage->{_type,"slug":slug.current}}, secondaryCta{label,linkType,url,anchor,email,phone,openInNewTab,internalPage->{_type,"slug":slug.current}}}, heroPanel, galleryEyebrow, galleryTitle, "gallery": galleryImages[]{"url": asset->url, alt, caption}, blocks[]{${blockFields}}, closingCta{title, button{label,linkType,url,anchor,email,phone,openInNewTab,internalPage->{_type,"slug":slug.current}}}, seo},
    "service": *[_type == "service" && slug.current == $slug][0]{_type,title, slug, intro, summary, "heroImageUrl": heroImage.asset->url, heroPanel, specs, galleryEyebrow, galleryTitle, "gallery": galleryImages[]{"url": asset->url, alt, caption}, blocks[]{${blockFields}}, closingCta{title, button{label,linkType,url,anchor,email,phone,openInNewTab,internalPage->{_type,"slug":slug.current}}}, seo},
    "market": *[_type == "market" && slug.current == $slug][0]{_type,title, slug, intro, "imageUrl": image.asset->url, heroPanel, galleryEyebrow, galleryTitle, "gallery": galleryImages[]{"url": asset->url, alt, caption}, blocks[]{${blockFields}}, closingCta{title, button{label,linkType,url,anchor,email,phone,openInNewTab,internalPage->{_type,"slug":slug.current}}}, seo},
    "news": *[_type == "blogPost" && slug.current == $slug][0]{_type,title, slug, excerpt, "featuredImageUrl": featuredImage.asset->url, "categoryTitle": category->title, galleryEyebrow, galleryTitle, "gallery": galleryImages[]{"url": asset->url, alt, caption}, "blocks": body[]{${blockFields}}, closingCta{title, button{label,linkType,url,anchor,email,phone,openInNewTab,internalPage->{_type,"slug":slug.current}}}, seo},
    "settings": *[_type == "siteSettings"][0]{title, companyName, tagline, email, phone, address}
  }`;
  const endpoint = `https://${AUDACIOUS_PAGE_IMAGE_PROJECT_ID}.api.sanity.io/v${AUDACIOUS_PAGE_IMAGE_API_VERSION}/data/query/${AUDACIOUS_PAGE_IMAGE_DATASET}?query=${encodeURIComponent(query)}&$slug=${encodeURIComponent(JSON.stringify(slug))}`;
  const response = await fetch(endpoint, {cache: 'no-store'});
  if (!response.ok) throw new Error(`Sanity page content request failed: ${response.status}`);
  return (await response.json())?.result || null;
}

async function audaciousInitPageImages() {
  const slug = audaciousCurrentSlug();
  const hasSubpageHero = Boolean(document.querySelector('.page-hero'));
  if (!hasSubpageHero) return;
  try {
    const result = await audaciousFetchPageContent(slug);
    const doc = result?.page || result?.service || result?.market || result?.news;
    const type = result?.page ? 'page' : result?.service ? 'service' : result?.market ? 'market' : result?.news ? 'news' : '';
    if (!doc) return;
    audaciousApplySeo(doc);
    audaciousApplyHero(doc, type);
    audaciousApplyHeroPanel(doc.heroPanel);
    if (doc.specs && !doc.heroPanel?.rows) audaciousApplyHeroPanel({panelLabel: doc.specs.title, rows: doc.specs.items});
    audaciousRenderBlocks(doc.blocks || []);
    audaciousRenderPageGallery(doc);
    audaciousApplyClosingCta(doc);
    audaciousApplyFooter(result?.settings);
  } catch (error) {
    console.warn('Sanity pagina-content kon niet geladen worden. Fallback content blijft actief.', error);
  }
}

window.addEventListener('DOMContentLoaded', audaciousInitPageImages);
window.addEventListener('load', audaciousInitPageImages);
window.audaciousInitPageImages = audaciousInitPageImages;