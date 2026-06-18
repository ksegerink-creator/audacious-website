(function () {
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

  function applyAudaciousCopy() {
    if (!document.querySelector('.hero')) return;
    ensureHomeSimplifiedStyles();
    ensureHeroVideoCard();
    ensureFooterAffiliations();
    applyHomeNav();

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
    document.querySelectorAll('.product-tile').forEach((tile, index) => {
      const row = projectCards[index];
      if (!row) return;
      setText('h3', row[0], tile);
      setText('p', row[1], tile);
      tile.classList.add('is-clickable');
      tile.setAttribute('data-href', row[2]);

      let link = tile.querySelector('.project-card-link');
      if (!link) {
        link = document.createElement('a');
        link.className = 'project-card-link';
        tile.appendChild(link);
      }
      link.href = row[2];
      link.setAttribute('aria-label', `Bekijk project: ${row[0]}`);
    });

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