const SANITY_PROJECT_ID = 'wehjzlhm';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2026-06-12';

function textToHtml(value) {
  return String(value || '').split('\n').map((line) => line.trim()).filter(Boolean).join('<br>');
}

function setText(selector, value, root = document) {
  const element = root.querySelector(selector);
  if (element && value) element.textContent = value;
}

function setHtml(selector, value, root = document) {
  const element = root.querySelector(selector);
  if (element && value) element.innerHTML = textToHtml(value);
}

function setHref(selector, value, root = document) {
  const element = root.querySelector(selector);
  if (element && value) element.setAttribute('href', value);
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
}

function resolveSanityHref(target) {
  if (!target) return '';
  if (target.linkType === 'external') return target.url || '';
  if (target.linkType === 'anchor') return target.anchor || '';
  const type = target._type;
  const slug = target.slug;
  if (type === 'homePage') return '/';
  if (!slug) return '';
  if (type === 'service') return `/${slug}`;
  if (type === 'market') return `/${slug}`;
  if (type === 'blogPost') return `/nieuws/${slug}`;
  return `/${slug}`;
}

function imageUrlWithParams(url, width = 1400) {
  if (!url) return '';
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}auto=format&fit=crop&w=${width}&q=88`;
}

function ensureIntroImageStyles() {
  if (document.querySelector('link[href="../css/home-intro-image.css"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '../css/home-intro-image.css';
  document.head.appendChild(link);
}

function applyIntroImage(imageUrl) {
  const visual = document.querySelector('.intro-visual');
  if (!visual || !imageUrl) return;
  ensureIntroImageStyles();
  visual.classList.add('has-sanity-image');
  visual.setAttribute('aria-hidden', 'false');
  visual.innerHTML = `<img class="intro-visual-photo" src="${imageUrlWithParams(imageUrl)}" alt="" loading="lazy">`;
}

function applySanityHomeCopy(home) {
  if (!home) return;
  const hero = home.hero || {};
  setText('.hero-badge span', hero.eyebrow);
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && hero.title) {
    const titleHtml = textToHtml(hero.title);
    heroTitle.innerHTML = hero.highlight ? `${titleHtml}<br><em>${hero.highlight}</em>` : titleHtml;
  }
  setText('.hero-sub', hero.intro);
  const primaryHref = hero.primaryCta?.internalPage ? resolveSanityHref(hero.primaryCta.internalPage) : resolveSanityHref(hero.primaryCta);
  const secondaryHref = hero.secondaryCta?.internalPage ? resolveSanityHref(hero.secondaryCta.internalPage) : resolveSanityHref(hero.secondaryCta);
  setText('.hero-actions .btn-primary', hero.primaryCta?.label);
  setHref('.hero-actions .btn-primary', primaryHref);
  setText('.hero-actions .btn-outline', hero.secondaryCta?.label);
  setHref('.hero-actions .btn-outline', secondaryHref);
  setHtml('.intro-title', home.introTitle);
  setText('.intro-body', home.introText);
  applyIntroImage(home.introImageUrl);
  setText('.products-kicker', home.projectsEyebrow);
  setHtml('.products-title', home.projectsTitle);
  setText('.products-stage-head p:not(.products-kicker)', home.projectsIntro);
}

function applySanityNavigation(navigation) {
  const items = navigation?.items || [];
  if (!items.length) return;
  const links = document.querySelectorAll('nav .nav-links a');
  items.filter((item) => item.label !== 'Home').slice(0, links.length).forEach((item, index) => {
    const link = links[index];
    if (!link) return;
    link.textContent = item.label;
    const href = item.internalPage ? resolveSanityHref(item.internalPage) : resolveSanityHref(item);
    if (href) link.setAttribute('href', href);
  });
  setHref('nav .nav-logo', '/');
}

function applySanityServices(services) {
  const slides = document.querySelectorAll('.aud-service-slide');
  if (!slides.length || !services?.length) return;
  slides.forEach((slide, index) => {
    const service = services[index];
    if (!service) return;
    setText('.aud-service-title', service.title, slide);
    setText('.aud-service-description', service.summary || service.intro, slide);
    setHref('.aud-service-button', resolveSanityHref({_type: 'service', slug: service.slug}), slide);
    const counter = slide.querySelector('.aud-service-counter');
    if (counter) counter.textContent = `${String(index + 1).padStart(2, '0')}/${String(services.length).padStart(2, '0')}`;
  });
}

function applySanityMarkets(markets) {
  const cards = document.querySelectorAll('.market-card');
  if (!cards.length || !markets?.length) return;
  cards.forEach((card, index) => {
    const market = markets[index];
    if (!market) return;
    setText('h3', market.title, card);
    setText('p', market.intro, card);
    setText('.market-num', String(index + 1).padStart(2, '0'), card);
  });
}

function applySanityProducts(productGroups) {
  const tiles = document.querySelectorAll('.product-tile');
  if (!tiles.length || !productGroups?.length) return;
  tiles.forEach((tile, index) => {
    const product = productGroups[index];
    if (!product) return;
    setText('h3', product.title, tile);
    setText('p', product.intro, tile);
    setText('.product-visual span', String(index + 1).padStart(2, '0'), tile);
  });
}

function renderFooterLink(link) {
  const label = link?.label;
  const href = link?.internalPage ? resolveSanityHref(link.internalPage) : resolveSanityHref(link);
  if (!label || !href) return '';
  const target = link.openInNewTab ? ' target="_blank" rel="noopener"' : '';
  return `<a href="${escapeHtml(href)}"${target}>${escapeHtml(label)}</a>`;
}

function applyFooterColumns(settings) {
  const footerGrid = document.querySelector('.site-footer .footer-grid');
  const brand = document.querySelector('.site-footer .footer-brand');
  if (!footerGrid || !brand) return;

  const columns = Array.isArray(settings.footerColumns) ? settings.footerColumns : [];
  const address = settings.address ? String(settings.address).split('\n').filter(Boolean).join(', ') : '';
  const email = settings.email || '';
  const phone = settings.phone || '';
  const contactLinks = [
    email ? `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>` : '',
    phone ? `<a href="tel:${escapeHtml(phone.replace(/[^+0-9]/g, ''))}">${escapeHtml(phone)}</a>` : '',
    address ? `<span>${escapeHtml(address)}</span>` : ''
  ].filter(Boolean).join('');

  const renderedColumns = columns.map((column) => {
    const links = (column.links || []).map(renderFooterLink).join('');
    if (!column.title && !links) return '';
    return `<div class="footer-col"><h3>${escapeHtml(column.title)}</h3>${links}</div>`;
  }).join('');

  const contactColumn = contactLinks ? `<div class="footer-col"><h3>Contact</h3>${contactLinks}</div>` : '';
  footerGrid.innerHTML = '';
  footerGrid.appendChild(brand);
  footerGrid.insertAdjacentHTML('beforeend', `${renderedColumns}${contactColumn}`);
}

function applySanitySiteSettings(settings) {
  if (!settings) return;
  const email = settings.email;
  const phone = settings.phone;
  const company = settings.companyName;
  const address = settings.address ? String(settings.address).split('\n').filter(Boolean).join(', ') : '';
  setText('.contact-info-item:nth-child(1) strong', company);
  setText('.contact-info-item:nth-child(2) strong', address);
  setText('.contact-info-item:nth-child(3) a', email);
  if (email) setHref('.contact-info-item:nth-child(3) a', `mailto:${email}`);
  setText('.contact-info-item:nth-child(4) a', phone);
  if (phone) setHref('.contact-info-item:nth-child(4) a', `tel:${phone.replace(/[^+0-9]/g, '')}`);
  setText('.footer-brand p', settings.footerBrandText || settings.tagline);
  if (company) setText('.footer-bottom span:first-child', `© 2026 ${company}`);
  setText('.footer-bottom span:last-child', settings.footerBottomText);
  applyFooterColumns(settings);
}

async function fetchSanityContent() {
  const query = `{
    "home": *[_type == "homePage"][0]{
      hero{eyebrow,title,highlight,intro,primaryCta{label,linkType,url,anchor,internalPage->{_type,"slug":slug.current}},secondaryCta{label,linkType,url,anchor,internalPage->{_type,"slug":slug.current}}},
      introTitle,introText,"introImageUrl":introImage.asset->url,projectsEyebrow,projectsTitle,projectsIntro,
      featuredServices[]->{title,"slug":slug.current,intro,summary,order},
      featuredMarkets[]->{title,"slug":slug.current,intro,order},
      featuredProductGroups[]->{title,"slug":slug.current,intro,order,applications}
    },
    "navigation": *[_type == "navigation"][0]{items[]{label,linkType,url,anchor,openInNewTab,internalPage->{_type,"slug":slug.current},children[]{label,linkType,url,anchor,openInNewTab,internalPage->{_type,"slug":slug.current}}}},
    "settings": *[_type == "siteSettings"][0]{companyName,tagline,email,phone,address,footerBrandText,footerBottomText,linkedinUrl,footerColumns[]{title,links[]{label,linkType,url,anchor,openInNewTab,internalPage->{_type,"slug":slug.current}}}}
  }`;
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Sanity request failed: ${response.status}`);
  const data = await response.json();
  return data.result;
}

async function applySanityContent() {
  try {
    const content = await fetchSanityContent();
    applySanityHomeCopy(content?.home);
    applySanityNavigation(content?.navigation);
    applySanityServices(content?.home?.featuredServices);
    applySanityMarkets(content?.home?.featuredMarkets);
    applySanityProducts(content?.home?.featuredProductGroups);
    applySanitySiteSettings(content?.settings);
  } catch (error) {
    console.warn('Sanity content kon niet geladen worden.', error);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  applySanityContent();
  window.setTimeout(applySanityContent, 300);
});

window.addEventListener('load', () => {
  window.setTimeout(applySanityContent, 0);
  window.setTimeout(applySanityContent, 500);
});