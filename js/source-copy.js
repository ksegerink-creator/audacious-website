const SANITY_PROJECT_ID = 'wehjzlhm';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2026-06-12';

function ensureProofLayout() {
  if (document.getElementById('audacious-proof-layout-fix')) return;

  const style = document.createElement('style');
  style.id = 'audacious-proof-layout-fix';
  style.textContent = `
    .proof { background: var(--black) !important; }
    .proof .container { max-width: 1200px !important; margin: 0 auto !important; padding: 0 clamp(1.25rem, 4vw, 3rem) !important; }
    .proof-grid { display: grid !important; grid-template-columns: repeat(4, minmax(0, 1fr)) !important; gap: 0 !important; border: 1px solid var(--steel-border) !important; border-radius: 4px !important; overflow: hidden !important; background: #fff !important; }
    .proof-item { display: block !important; min-height: 190px !important; padding: clamp(1.5rem, 3vw, 2.5rem) !important; border-right: 1px solid var(--steel-border) !important; position: relative !important; background: #fff !important; }
    .proof-item:last-child { border-right: none !important; }
    .proof-title { display: block !important; font-family: var(--font-display) !important; font-size: 1.1rem !important; font-weight: 600 !important; color: var(--white) !important; margin: 0 0 0.5rem !important; line-height: 1.2 !important; }
    .proof-body { display: block !important; margin: 0 !important; font-size: 0.8rem !important; color: var(--steel-text) !important; line-height: 1.5 !important; }
    .proof-accent-line { display: block !important; position: absolute !important; top: 0 !important; left: 2.5rem !important; width: 2rem !important; height: 2px !important; background: var(--accent) !important; border-radius: 0 0 2px 2px !important; }
    @media (max-width: 900px) { .proof-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } .proof-item:nth-child(2) { border-right: none !important; } .proof-item:nth-child(-n+2) { border-bottom: 1px solid var(--steel-border) !important; } }
    @media (max-width: 560px) { .proof-grid { grid-template-columns: 1fr !important; } .proof-item, .proof-item:nth-child(2) { border-right: none !important; border-bottom: 1px solid var(--steel-border) !important; } .proof-item:last-child { border-bottom: none !important; } }
  `;

  document.head.appendChild(style);
}

function textToHtml(value) {
  return String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('<br>');
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

function resolveSanityHref(target) {
  if (!target) return '#';
  const type = target._type;
  const slug = target.slug;

  if (type === 'homePage') return '../html/index.html';
  if (!slug) return '#';
  if (type === 'service') return `../pages/${slug}.html`;
  if (type === 'market') return '../html/markten.html';
  if (type === 'productGroup') return '../html/producten.html';
  if (type === 'blogPost') return '../html/blog-detail.html';
  return `../html/${slug}.html`;
}

function applyFallbackCopy() {
  ensureProofLayout();

  setText('.hero-badge span', 'Zevenaar - intelligent plaatwerk');
  setHtml('.hero-title', 'Voor intelligent\nplaatwerk.');
  setText('.hero-sub', 'Audacious Sheet Metal ontwikkelt en vervaardigt plaatwerkproducten uit roestvaststaal, aluminium en staal. Van enkelstuks tot meerstuks, van rechttoe rechtaan tot gecompliceerd lasersnij-, kant- en laswerk, constructiewerk en complete assemblage.');

  setHtml('.intro-title', 'Slim werken.\nSneller en beter produceren.');
  setText('.intro-body', 'De kracht van Audacious zit in de organisatie: goed voorbereiden, doelmatig calculeren en elke schakel in de keten optimaliseren. Niet geleefd worden, maar anticiperen. Zo houden we grip op kwaliteit, kosten en levertijd.');

  const proofUpdates = [
    ['Ketenregisseur voor OEM', 'Audacious neemt desgewenst de hele productieketen voor zijn rekening: van productie tot assemblage, montage en afstemming met vaste specialistische partners.'],
    ['Enkelstuks en kleine series', 'Omdat we veel enkelstuks en kleine series maken, sturen we scherp op korte steltijden, slimme planning en foutloze productie.'],
    ['RVS, aluminium en staal', 'Van lasergesneden monodelen tot samengestelde precisieproducten, behuizingen, plaatwerkframes, machineframes en modules.'],
    ['ERP-gestuurde productie', 'Van offerte tot voorraadbeheer, productie, levering en facturering: de voortgang is per order te volgen en bij te sturen.']
  ];

  document.querySelectorAll('.proof-item').forEach((item, index) => {
    const update = proofUpdates[index];
    if (!update) return;
    setText('.proof-title', update[0], item);
    setText('.proof-body', update[1], item);
  });

  setText('.hero-proof-stars', 'SCM');
  setText('.hero-proof strong', 'Van jobber naar ketenregisseur');
  setText('.hero-proof span', 'Plaatwerk, constructiewerk, assemblage en vaste partners in een keten');
}

function applyFallbackMenu() {
  const links = [
    ['Werkzaamheden', '../html/werkzaamheden.html'],
    ['Markten', '../html/markten.html'],
    ['Producten', '../html/producten.html'],
    ['Over ons', '../html/over-ons.html'],
    ['Offerte aanvragen', '../html/contact.html']
  ];

  document.querySelectorAll('nav .nav-links a').forEach((link, index) => {
    const item = links[index];
    if (!item) return;
    link.textContent = item[0];
    link.setAttribute('href', item[1]);
  });

  setHref('nav .nav-logo', '../html/index.html');
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

  const primaryHref = hero.primaryCta?.internalPage ? resolveSanityHref(hero.primaryCta.internalPage) : hero.primaryCta?.url;
  const secondaryHref = hero.secondaryCta?.internalPage ? resolveSanityHref(hero.secondaryCta.internalPage) : hero.secondaryCta?.url;

  setText('.hero-actions .btn-primary', hero.primaryCta?.label);
  setHref('.hero-actions .btn-primary', primaryHref);
  setText('.hero-actions .btn-outline', hero.secondaryCta?.label);
  setHref('.hero-actions .btn-outline', secondaryHref);

  setHtml('.intro-title', home.introTitle);
  setText('.intro-body', home.introText);
}

function applySanityNavigation(navigation) {
  const items = navigation?.items || [];
  const visibleItems = items.filter((item) => item.label !== 'Home').slice(0, 5);
  const links = document.querySelectorAll('nav .nav-links a');

  links.forEach((link, index) => {
    const item = visibleItems[index];
    if (!item) return;
    link.textContent = item.label;

    if (item.linkType === 'external' && item.url) {
      link.setAttribute('href', item.url);
      return;
    }

    if (item.linkType === 'anchor' && item.anchor) {
      link.setAttribute('href', item.anchor);
      return;
    }

    if (item.internalPage) link.setAttribute('href', resolveSanityHref(item.internalPage));
  });

  setHref('nav .nav-logo', '../html/index.html');
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

function applySanitySiteSettings(settings) {
  if (!settings) return;

  const email = settings.email || 'info@audacious.com';
  const phone = settings.phone || '+31 (0)316 - 581 470';
  const company = settings.companyName || 'Audacious Sheet Metal International B.V.';
  const addressLine = settings.address ? String(settings.address).split('\n').filter(Boolean).slice(-2, -1)[0] : 'Zevenaar, Nederland';

  setText('.contact-info-item:nth-child(1) strong', company);
  setText('.contact-info-item:nth-child(2) strong', addressLine || 'Zevenaar, Nederland');
  setText('.contact-info-item:nth-child(3) a', email);
  setHref('.contact-info-item:nth-child(3) a', `mailto:${email}`);
  setText('.contact-info-item:nth-child(4) a', phone);
  setHref('.contact-info-item:nth-child(4) a', `tel:${phone.replace(/[^+0-9]/g, '')}`);

  setText('.contact-actions .contact-button', email);
  setHref('.contact-actions .contact-button', `mailto:${email}`);
  setText('.contact-actions .contact-button.is-secondary', `Bel ${phone}`);
  setHref('.contact-actions .contact-button.is-secondary', `tel:${phone.replace(/[^+0-9]/g, '')}`);

  setText('.footer-bottom span:first-child', `© 2026 ${company}`);
  setText('.footer-col:nth-child(4) a[href^="mailto"]', email);
  setHref('.footer-col:nth-child(4) a[href^="mailto"]', `mailto:${email}`);
  setText('.footer-col:nth-child(4) a[href^="tel"]', phone);
  setHref('.footer-col:nth-child(4) a[href^="tel"]', `tel:${phone.replace(/[^+0-9]/g, '')}`);
  setText('.footer-col:nth-child(4) span', addressLine || 'Zevenaar, Nederland');
}

async function fetchSanityContent() {
  const query = `{
    "home": *[_type == "homePage"][0]{
      hero{
        eyebrow,
        title,
        highlight,
        intro,
        primaryCta{label, linkType, url, anchor, internalPage->{_type, "slug": slug.current}},
        secondaryCta{label, linkType, url, anchor, internalPage->{_type, "slug": slug.current}}
      },
      introTitle,
      introText,
      featuredServices[]->{title, "slug": slug.current, intro, summary, order},
      featuredMarkets[]->{title, "slug": slug.current, intro, order},
      featuredProductGroups[]->{title, "slug": slug.current, intro, order, applications}
    },
    "navigation": *[_type == "navigation"][0]{
      items[]{
        label,
        linkType,
        url,
        anchor,
        internalPage->{_type, "slug": slug.current}
      }
    },
    "settings": *[_type == "siteSettings"][0]{
      companyName,
      email,
      phone,
      address
    }
  }`;

  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Sanity request failed: ${response.status}`);
  const data = await response.json();
  return data.result;
}

function applySourceBasedCopy() {
  applyFallbackCopy();
}

function applyMenuPages() {
  applyFallbackMenu();
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
    console.warn('Sanity content kon niet geladen worden. Fallback content blijft actief.', error);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  ensureProofLayout();
  applyFallbackCopy();
  applyFallbackMenu();
  window.setTimeout(applySanityContent, 0);
  window.setTimeout(applySanityContent, 300);
});

window.addEventListener('load', () => {
  ensureProofLayout();
  window.setTimeout(applySanityContent, 0);
  window.setTimeout(applySanityContent, 500);
});

ensureProofLayout();
applyFallbackCopy();
applyFallbackMenu();
