(function () {
  const PROJECT_ID = 'wehjzlhm';
  const DATASET = 'production';
  const API_VERSION = '2025-02-19';

  function setText(selector, value, root = document) {
    const element = root.querySelector(selector);
    if (element && value) element.textContent = value;
  }

  function setHtml(selector, value, root = document) {
    const element = root.querySelector(selector);
    if (!element || !value) return;
    element.innerHTML = String(value).split('\n').map((line) => line.trim()).filter(Boolean).join('<br>');
  }

  function setHref(selector, value, root = document) {
    const element = root.querySelector(selector);
    if (element && value) element.setAttribute('href', value);
  }

  function normalizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function setHtmlIfDefault(selector, value, defaultFragments) {
    const element = document.querySelector(selector);
    if (!element || !value) return;
    const current = normalizeText(element.textContent);
    const isDefault = !current || defaultFragments.some((fragment) => current.includes(fragment));
    if (isDefault) setHtml(selector, value);
  }

  function setTextIfDefault(selector, value, defaultFragments) {
    const element = document.querySelector(selector);
    if (!element || !value) return;
    const current = normalizeText(element.textContent);
    const isDefault = !current || defaultFragments.some((fragment) => current.includes(fragment));
    if (isDefault) setText(selector, value);
  }

  function resolveCtaHref(cta = {}) {
    if (!cta) return '';
    if (cta.linkType === 'external') return cta.url || '';
    if (cta.linkType === 'anchor') return cta.anchor || '';
    if (cta.linkType === 'email') return cta.email ? `mailto:${cta.email}` : '';
    if (cta.linkType === 'phone') return cta.phone ? `tel:${String(cta.phone).replace(/[^+0-9]/g, '')}` : '';
    const target = cta.internalPage;
    if (!target?.slug) return '';
    if (target._type === 'service' || target._type === 'market') return `../pages/${target.slug}.html`;
    if (target._type === 'blogPost') return `../html/${target.slug}.html`;
    if (target._type === 'page' && target.slug.startsWith('project-')) return `../pages/${target.slug}.html`;
    return target.slug === 'index' ? '../html/index.html' : `../html/${target.slug}.html`;
  }

  function ensureHomeSimplifiedStyles() {
    if (document.querySelector('link[href="../css/home-simplified.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../css/home-simplified.css';
    document.head.appendChild(link);
  }

  function ensureHeroVideoCard() {
    if (document.querySelector('.home-video-card')) return;
    const actions = document.querySelector('.hero-actions');
    if (!actions) return;
    const card = document.createElement('a');
    card.className = 'home-video-card';
    card.href = '../html/contact.html';
    card.innerHTML = '<span class="home-video-icon">→</span><span class="home-video-copy"><strong>Contact opnemen</strong><span>Bespreek uw plaatwerkvraag met Audacious</span></span>';
    actions.insertAdjacentElement('afterend', card);
  }

  function ensureFooterAffiliations() {
    const footerGrid = document.querySelector('.site-footer .footer-grid');
    if (!footerGrid || document.querySelector('.footer-affiliations')) return;
    const block = document.createElement('div');
    block.className = 'footer-affiliations';
    block.innerHTML = '<h3>Wij zijn aangesloten bij</h3><div class="footer-affiliation-list"><span>Kenteq</span><span>Metaalunie</span><span>OOM</span><span>NEVAT</span><span>FDP</span></div>';
    footerGrid.appendChild(block);
  }

  function applyHomeNav() {
    const links = document.querySelectorAll('nav .nav-links a');
    const items = [
      ['Over ons', '#over-ons'],
      ['Projecten', '#projecten'],
      ['Bewerkingen', '#werkzaamheden'],
      ['Nieuws', '../html/nieuws.html'],
      ['Contact', '../html/contact.html']
    ];
    links.forEach((link, index) => {
      const item = items[index];
      if (!item) return;
      link.textContent = item[0];
      link.setAttribute('href', item[1]);
      link.classList.toggle('nav-cta', index === 4);
    });
  }

  function applyFallbackHomeCopy() {
    setTextIfDefault('.hero-badge span', 'Zevenaar - plaatbewerking', ['precisieplaatwerk', 'zevenaar, nederland']);
    setHtmlIfDefault('.hero-title', 'Voor intelligent\nplaatwerk.', ['precisieplaatwerk voor', 'plaatbewerking met lef', 'hoogwaardig plaatwerk']);
    setTextIfDefault('.hero-sub', 'Audacious Sheet Metal International B.V. ontwikkelt en produceert hoogwaardige plaatwerkoplossingen in staal, roestvaststaal en aluminium. Van enkelstuks tot kleine series, mono-delen, samengestelde plaatwerkconstructies en complete assemblages.', ['oem', 'samengestelde constructies', 'complete assemblages']);
    setText('.hero-actions .btn-primary', 'Contact opnemen');
    setHref('.hero-actions .btn-primary', '../html/contact.html');
    setText('.hero-actions .btn-outline', 'Bekijk bewerkingen');
    setHref('.hero-actions .btn-outline', '#werkzaamheden');

    setHtml('.intro-title', 'Audacious Sheet Metal\nInternational B.V.');
    setText('.intro-body', 'Audacious ontwikkelt en produceert plaatwerkoplossingen uit staal, roestvaststaal en aluminium. In een moderne CAD/CAM-omgeving, met een CNC-machinepark en productie-besturing, werken vakmensen aan mono-delen, plaatwerkconstructies en assemblages.');
    setHref('.intro-left .btn', '../html/over-ons.html');
    setText('.intro-left .btn', 'Meer over Audacious');

    setText('.org-control-eyebrow', 'Over ons');
    setHtml('.org-control-title', 'Voorbereiden, produceren\nen regisseren.');
    setText('.org-control-copy', 'Audacious kijkt vooraf naar maakbaarheid, materiaal, lasnaden, afwerking en productieroute. Zo blijven kwaliteit, kosten en levertijd beheersbaar, juist bij enkelstuks en kleine series.');

    const roadmap = [
      ['Maakbaarheid beoordelen', 'Controle op plaatdikte, buigradius, toleranties, lasnaden en materiaalkeuze.'],
      ['CAD/CAM voorbereiden', '3D CAD, STEP-controle, nesting en NC-programmering voor laser en kantbank.'],
      ['Plaatwerk produceren', 'Lasersnijden, kanten, walsen, persen, lassen en afwerken volgens de gekozen route.'],
      ['Assembleren en leveren', 'Mechanische montage, afstemming met partners en levering van mono-deel tot samenstelling.']
    ];
    document.querySelectorAll('.org-roadmap-item').forEach((item, index) => {
      const row = roadmap[index];
      if (!row) return;
      setText('strong', row[0], item);
      setText('p', row[1], item);
    });

    setText('.products-kicker', 'Projecten');
    setHtml('#products-title', 'Voorbeelden van\nplaatwerkprojecten.');
    const productHead = document.querySelector('.products-stage-head p:not(.products-kicker)');
    if (productHead) productHead.textContent = 'Een selectie van projecttypen uit het werk van Audacious: frames, RVS-behuizingen, technische samenstellingen en maatwerkconstructies.';

    const projectCards = [
      ['Frame voor de food-industrie', 'Frameconstructie voor toepassing in de voedingsmiddelenindustrie.', '../pages/project-food-frame.html'],
      ['Plaatwerk behuizingen', 'Plaatwerkbehuizingen uit RVS 316L.', '../pages/project-plaatwerk-behuizingen.html'],
      ['Project röntgenarm', 'Technische samenstelling met plaatwerkcomponenten.', '../pages/project-rontgenarm.html'],
      ['Frames voor verpakkingsmachines', 'Precisieframes uit RVS 316L, gelast en afgewerkt.', '../pages/project-verpakkingsframes.html'],
      ['Schuifdeuren / cold corridor', 'Schuifdeuren voor luchtdichte cold corridors in serverruimtes.', '../pages/project-schuifdeuren.html']
    ];
    applyProjectCards(projectCards);

    setText('#services-title', 'Bewerkingen');

    const footerLogo = document.querySelector('.footer-logo');
    if (footerLogo) {
      footerLogo.href = '../html/index.html';
      footerLogo.setAttribute('aria-label', 'Audacious homepage');
      footerLogo.innerHTML = '<span class="footer-logo-mark" aria-hidden="true"></span><span class="footer-logo-word">Audacious</span>';
    }
    setText('.footer-brand p', 'Audacious Sheet Metal International B.V. ontwikkelt en produceert plaatwerkoplossingen in enkelstuks en kleine series.');
    const footerNav = document.querySelector('.footer-col:nth-child(2)');
    if (footerNav) footerNav.innerHTML = '<h3>Navigatie</h3><a href="#over-ons">Over ons</a><a href="#projecten">Projecten</a><a href="#werkzaamheden">Bewerkingen</a><a href="../html/nieuws.html">Nieuws</a><a href="../html/contact.html">Contact</a>';
    const footerWork = document.querySelector('.footer-col:nth-child(3)');
    if (footerWork) footerWork.innerHTML = '<h3>Bewerkingen</h3><a href="../pages/lasersnijden.html">Lasersnijden</a><a href="../pages/kanten.html">Kanten</a><a href="../pages/lassen.html">Lassen</a><a href="../pages/assembleren.html">Assemblage</a>';
    const footerContact = document.querySelector('.footer-col:nth-child(4)');
    if (footerContact) footerContact.innerHTML = '<h3>Contact</h3><a href="mailto:info@audacious.com">info@audacious.com</a><a href="tel:+31316581470">0316-581470</a><span>Mega 16, 6902 KL Zevenaar</span><a class="footer-linkedin" href="https://www.linkedin.com/company/audacious-sheet-metal-services-bv/" target="_blank" rel="noopener">LinkedIn →</a>';
    setText('.footer-bottom span:first-child', '© 2026 Audacious Sheet Metal International B.V.');
    setText('.footer-bottom span:last-child', 'Plaatbewerking · CAD/CAM · CNC-machinepark · assemblage');
  }

  function applyProjectCards(cards) {
    document.querySelectorAll('.product-tile').forEach((tile, index) => {
      const row = cards[index];
      if (!row) return;
      const title = Array.isArray(row) ? row[0] : row.title;
      const text = Array.isArray(row) ? row[1] : row.text;
      const href = Array.isArray(row) ? row[2] : resolveCtaHref(row.link);
      setText('h3', title, tile);
      setText('p', text, tile);
      tile.classList.add('is-clickable');
      if (href) tile.setAttribute('data-href', href);
      let link = tile.querySelector('.project-card-link');
      if (!link) {
        link = document.createElement('a');
        link.className = 'project-card-link';
        tile.appendChild(link);
      }
      link.href = href || '#';
      link.setAttribute('aria-label', `Bekijk project: ${title}`);
    });
  }

  async function fetchHomeContent() {
    const query = `{
      "home": *[_type == "homePage"][0]{
        hero{eyebrow,title,highlight,intro,primaryCta{label,linkType,url,anchor,email,phone,internalPage->{_type,"slug":slug.current}},secondaryCta{label,linkType,url,anchor,email,phone,internalPage->{_type,"slug":slug.current}}},
        introTitle,introText,processEyebrow,processTitle,processText,processItems[]{title,text},projectsEyebrow,projectsTitle,projectsIntro,projectCards[]{title,text,link{label,linkType,url,anchor,email,phone,internalPage->{_type,"slug":slug.current}}},footerIntro,footerAffiliationsTitle,footerAffiliations,linkedinUrl,seo
      },
      "settings": *[_type == "siteSettings"][0]{companyName,email,phone,address,tagline}
    }`;
    const endpoint = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
    const response = await fetch(endpoint, {cache: 'no-store'});
    if (!response.ok) throw new Error(`Sanity homepage request failed: ${response.status}`);
    return (await response.json())?.result || null;
  }

  function applySanityHomeContent(result) {
    const home = result?.home;
    const settings = result?.settings;
    if (!home) return;
    const hero = home.hero || {};
    setText('.hero-badge span', hero.eyebrow);
    if (hero.title) setHtml('.hero-title', hero.highlight ? `${hero.title}\n<em>${hero.highlight}</em>` : hero.title);
    setText('.hero-sub', hero.intro);
    setText('.hero-actions .btn-primary', hero.primaryCta?.label);
    setHref('.hero-actions .btn-primary', resolveCtaHref(hero.primaryCta));
    setText('.hero-actions .btn-outline', hero.secondaryCta?.label);
    setHref('.hero-actions .btn-outline', resolveCtaHref(hero.secondaryCta));
    setHtml('.intro-title', home.introTitle);
    setText('.intro-body', home.introText);
    setText('.org-control-eyebrow', home.processEyebrow);
    setHtml('.org-control-title', home.processTitle);
    setText('.org-control-copy', home.processText);
    if (Array.isArray(home.processItems) && home.processItems.length) {
      document.querySelectorAll('.org-roadmap-item').forEach((item, index) => {
        const row = home.processItems[index];
        if (!row) return;
        setText('strong', row.title, item);
        setText('p', row.text, item);
      });
    }
    setText('.products-kicker', home.projectsEyebrow);
    setHtml('#products-title', home.projectsTitle);
    const productHead = document.querySelector('.products-stage-head p:not(.products-kicker)');
    if (productHead && home.projectsIntro) productHead.textContent = home.projectsIntro;
    if (Array.isArray(home.projectCards) && home.projectCards.length) applyProjectCards(home.projectCards);
    setText('.footer-brand p', home.footerIntro || settings?.tagline);
    const affiliation = document.querySelector('.footer-affiliations');
    if (affiliation) {
      setText('h3', home.footerAffiliationsTitle, affiliation);
      if (Array.isArray(home.footerAffiliations) && home.footerAffiliations.length) {
        const list = affiliation.querySelector('.footer-affiliation-list');
        if (list) list.innerHTML = home.footerAffiliations.map((item) => `<span>${String(item)}</span>`).join('');
      }
    }
    const linkedin = document.querySelector('.footer-linkedin');
    if (linkedin && home.linkedinUrl) linkedin.href = home.linkedinUrl;
    if (settings?.companyName) setText('.footer-bottom span:first-child', `© 2026 ${settings.companyName}`);
    if (settings?.email) {
      const email = document.querySelector('.footer-col:nth-child(4) a[href^="mailto"]');
      if (email) { email.textContent = settings.email; email.href = `mailto:${settings.email}`; }
    }
    if (settings?.phone) {
      const phone = document.querySelector('.footer-col:nth-child(4) a[href^="tel"]');
      if (phone) { phone.textContent = settings.phone; phone.href = `tel:${settings.phone.replace(/[^+0-9]/g, '')}`; }
    }
    if (settings?.address) {
      const address = document.querySelector('.footer-col:nth-child(4) span');
      if (address) address.textContent = String(settings.address).split('\n').filter(Boolean).join(', ');
    }
  }

  async function applySanityHomeAfterFallback() {
    try {
      const result = await fetchHomeContent();
      applySanityHomeContent(result);
    } catch (error) {
      console.warn('Sanity homepage content kon niet geladen worden. Fallback blijft actief.', error);
    }
  }

  function applyAudaciousCopy() {
    if (!document.querySelector('.hero')) return;
    ensureHomeSimplifiedStyles();
    ensureHeroVideoCard();
    ensureFooterAffiliations();
    applyHomeNav();
    applyFallbackHomeCopy();
    applySanityHomeAfterFallback();
  }

  window.addEventListener('DOMContentLoaded', () => {
    applyAudaciousCopy();
    window.setTimeout(applyAudaciousCopy, 250);
    window.setTimeout(applyAudaciousCopy, 750);
  });

  window.addEventListener('load', () => {
    applyAudaciousCopy();
    window.setTimeout(applyAudaciousCopy, 500);
    window.setTimeout(applyAudaciousCopy, 1200);
  });
}());