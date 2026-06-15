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

function resolveSanityHref(target) {
  if (!target) return '#';
  const type = target._type;
  const slug = target.slug;
  if (type === 'homePage') return '../html/index.html';
  if (!slug) return '#';
  if (type === 'service') return `../pages/${slug}.html`;
  if (type === 'blogPost') return `../html/blog-detail.html`;
  return `../html/${slug}.html`;
}

function applyFallbackCopy() {
  ensureProofLayout();

  const heroBadge = document.querySelector('.hero-badge span');
  if (heroBadge) heroBadge.textContent = 'Zevenaar - intelligent plaatwerk';

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) heroTitle.innerHTML = 'Voor intelligent<br>plaatwerk.';

  const heroSub = document.querySelector('.hero-sub');
  if (heroSub) {
    heroSub.textContent = 'Audacious Sheet Metal ontwikkelt en vervaardigt plaatwerkproducten uit roestvaststaal, aluminium en staal. Van enkelstuks tot meerstuks, van rechttoe rechtaan tot gecompliceerd lasersnij-, kant- en laswerk, constructiewerk en complete assemblage.';
  }

  const introTitle = document.querySelector('.intro-title');
  if (introTitle) introTitle.innerHTML = 'Slim werken.<br>Sneller en beter produceren.';

  const introBody = document.querySelector('.intro-body');
  if (introBody) {
    introBody.textContent = 'De kracht van Audacious zit in de organisatie: goed voorbereiden, doelmatig calculeren en elke schakel in de keten optimaliseren. Niet geleefd worden, maar anticiperen. Zo houden we grip op kwaliteit, kosten en levertijd.';
  }

  const proofUpdates = [
    ['Ketenregisseur voor OEM', 'Audacious neemt desgewenst de hele productieketen voor zijn rekening: van productie tot assemblage, montage en afstemming met vaste specialistische partners.'],
    ['Enkelstuks en kleine series', 'Omdat we veel enkelstuks en kleine series maken, sturen we scherp op korte steltijden, slimme planning en foutloze productie.'],
    ['RVS, aluminium en staal', 'Van lasergesneden monodelen tot samengestelde precisieproducten, behuizingen, plaatwerkframes, machineframes en modules.'],
    ['ERP-gestuurde productie', 'Van offerte tot voorraadbeheer, productie, levering en facturering: de voortgang is per order te volgen en bij te sturen.']
  ];

  document.querySelectorAll('.proof-item').forEach((item, index) => {
    const update = proofUpdates[index];
    if (!update) return;
    const title = item.querySelector('.proof-title');
    const body = item.querySelector('.proof-body');
    if (title) title.textContent = update[0];
    if (body) body.textContent = update[1];
  });

  const heroProofTitle = document.querySelector('.hero-proof strong');
  const heroProofText = document.querySelector('.hero-proof span');
  const heroProofLabel = document.querySelector('.hero-proof-stars');
  if (heroProofLabel) heroProofLabel.textContent = 'SCM';
  if (heroProofTitle) heroProofTitle.textContent = 'Van jobber naar ketenregisseur';
  if (heroProofText) heroProofText.textContent = 'Plaatwerk, constructiewerk, assemblage en vaste partners in een keten';
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

  const logo = document.querySelector('nav .nav-logo');
  if (logo) logo.setAttribute('href', '../html/index.html');
}

function applySanityHomeCopy(home) {
  if (!home) return;

  const hero = home.hero || {};

  const heroBadge = document.querySelector('.hero-badge span');
  if (heroBadge && hero.eyebrow) heroBadge.textContent = hero.eyebrow;

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && hero.title) {
    const titleHtml = textToHtml(hero.title);
    heroTitle.innerHTML = hero.highlight ? `${titleHtml}<br><em>${hero.highlight}</em>` : titleHtml;
  }

  const heroSub = document.querySelector('.hero-sub');
  if (heroSub && hero.intro) heroSub.textContent = hero.intro;

  const primaryCta = document.querySelector('.hero-actions .btn-primary');
  if (primaryCta && hero.primaryCta?.label) primaryCta.textContent = hero.primaryCta.label;
  if (primaryCta && hero.primaryCta?.internalPage) primaryCta.setAttribute('href', resolveSanityHref(hero.primaryCta.internalPage));

  const secondaryCta = document.querySelector('.hero-actions .btn-outline');
  if (secondaryCta && hero.secondaryCta?.label) secondaryCta.textContent = hero.secondaryCta.label;
  if (secondaryCta && hero.secondaryCta?.internalPage) secondaryCta.setAttribute('href', resolveSanityHref(hero.secondaryCta.internalPage));

  const introTitle = document.querySelector('.intro-title');
  if (introTitle && home.introTitle) introTitle.innerHTML = textToHtml(home.introTitle);

  const introBody = document.querySelector('.intro-body');
  if (introBody && home.introText) introBody.textContent = home.introText;
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

  const logo = document.querySelector('nav .nav-logo');
  if (logo) logo.setAttribute('href', '../html/index.html');
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
      introText
    },
    "navigation": *[_type == "navigation"][0]{
      items[]{
        label,
        linkType,
        url,
        anchor,
        internalPage->{_type, "slug": slug.current}
      }
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

window.addEventListener('DOMContentLoaded', async () => {
  ensureProofLayout();
  applyFallbackCopy();
  applyFallbackMenu();

  try {
    const content = await fetchSanityContent();
    applySanityHomeCopy(content?.home);
    applySanityNavigation(content?.navigation);
  } catch (error) {
    console.warn('Sanity content kon niet geladen worden. Fallback content blijft actief.', error);
  }
});

window.addEventListener('load', () => {
  ensureProofLayout();
  applyFallbackCopy();
  applyFallbackMenu();
});

ensureProofLayout();
applyFallbackCopy();
applyFallbackMenu();
