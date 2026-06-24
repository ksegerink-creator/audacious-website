function applyAudaciousLivegangFixes() {
  const SITE_ORIGIN = 'https://www.audacious.com';
  const CONTACT_ANCHOR = '/contact#offerte-aanvragen';
  const CONTACT_ANCHOR_SAME_PAGE = '#offerte-aanvragen';
  const ADDRESS = 'Mega 16, 6902 KL Zevenaar';

  const cleanPathByFile = new Map([
    ['index.html', '/'],
    ['productievoorbereiding.html', '/productievoorbereiding'],
    ['engineering.html', '/engineering'],
    ['materialen.html', '/materialen'],
    ['werkzaamheden.html', '/werkzaamheden'],
    ['projecten.html', '/projecten'],
    ['nieuws.html', '/nieuws'],
    ['over-ons.html', '/over-ons'],
    ['markten.html', '/markten-en-diensten'],
    ['werken-bij-audacious.html', '/werken-bij-audacious'],
    ['contact.html', '/contact'],
    ['lasersnijden.html', '/lasersnijden'],
    ['kanten.html', '/kanten'],
    ['walsen.html', '/walsen'],
    ['persen.html', '/persen'],
    ['lassen.html', '/lassen'],
    ['oppervlaktebehandelingen.html', '/oppervlaktebehandelingen'],
    ['assembleren.html', '/assembleren'],
    ['cleanroom-verpakken.html', '/cleanroom-verpakken'],
    ['project-food-frame.html', '/projecten/food-frame'],
    ['project-plaatwerk-behuizingen.html', '/projecten/plaatwerk-behuizingen'],
    ['project-rontgenarm.html', '/projecten/rontgenarm'],
    ['project-verpakkingsframes.html', '/projecten/verpakkingsframes'],
    ['project-behuizing.html', '/projecten/behuizing'],
    ['project-schuifdeuren.html', '/projecten/schuifdeuren'],
    ['project-transportwagen-kooi.html', '/projecten/transportwagen-kooi'],
    ['nieuws-iso-9001-vervolg.html', '/nieuws/iso-9001-vervolg'],
    ['nieuws-vervanging-klein-transport.html', '/nieuws/vervanging-klein-transport'],
    ['nieuws-nieuwe-glasparel-straalcabine.html', '/nieuws/nieuwe-glasparel-straalcabine'],
    ['nieuws-grotere-stikstoftank.html', '/nieuws/grotere-stikstoftank'],
    ['nieuws-nieuwe-afzuiging-nedermann.html', '/nieuws/nieuwe-afzuiging-nedermann'],
    ['halfgeleiderindustrie.html', '/halfgeleiderindustrie'],
    ['medische-industrie.html', '/medische-industrie'],
    ['voedingsmiddelenindustrie.html', '/voedingsmiddelenindustrie'],
    ['drank-zuivelindustrie.html', '/drank-zuivelindustrie'],
    ['verpakkingsindustrie.html', '/verpakkingsindustrie'],
    ['bouw-meubelindustrie.html', '/bouw-meubelindustrie']
  ]);

  const getCurrentCleanPath = () => {
    const pathname = window.location.pathname.replace(/\/$/, '') || '/';
    const file = pathname.split('/').pop() || 'index.html';
    return cleanPathByFile.get(file) || pathname;
  };

  const isContactPage = () => getCurrentCleanPath() === '/contact' || Boolean(document.querySelector('[data-audacious-contact-form]'));
  const quoteHref = () => isContactPage() ? CONTACT_ANCHOR_SAME_PAGE : CONTACT_ANCHOR;

  const setText = (selector, value, root = document) => {
    const element = root.querySelector(selector);
    if (element) element.textContent = value;
  };

  const setHtml = (selector, value, root = document) => {
    const element = root.querySelector(selector);
    if (element) element.innerHTML = value;
  };

  const normalizeHref = (href) => {
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return href;

    const [pathPart, hashPart] = href.split('#');
    const file = pathPart.split('/').pop();
    let clean = cleanPathByFile.get(file) || pathPart;

    if (clean === '/projecten' && /producten\.html$/.test(pathPart)) clean = '/projecten';
    if (file === 'blog.html' || file === 'blog-detail.html') clean = '/nieuws';
    if (hashPart === 'contact') return '/contact#offerte-aanvragen';
    if (hashPart) return `${clean}#${hashPart}`;
    return clean;
  };

  const normalizeLinks = () => {
    document.querySelectorAll('a[href]').forEach((link) => {
      const originalHref = link.getAttribute('href');
      let href = normalizeHref(originalHref);
      const label = link.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
      const isQuoteLink = link.classList.contains('nav-cta') || label.includes('offerte') || label.includes('aanvraag starten') || label.includes('contact opnemen');

      if (isQuoteLink && !href?.startsWith('mailto:') && !href?.startsWith('tel:')) {
        href = quoteHref();
        if (link.classList.contains('nav-cta')) link.textContent = 'Contact';
      }

      if (href && href !== originalHref) link.setAttribute('href', href);
      if (link.textContent.trim() === 'Hero') link.remove();
      if (link.textContent.trim() === 'Producten') link.textContent = 'Projecten';
    });
  };

  const normalizeHeadUrls = () => {
    const cleanPath = getCurrentCleanPath();
    const canonicalUrl = `${SITE_ORIGIN}${cleanPath === '/' ? '/' : cleanPath}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', canonicalUrl);

    let twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (!twitterUrl) {
      twitterUrl = document.createElement('meta');
      twitterUrl.setAttribute('name', 'twitter:url');
      document.head.appendChild(twitterUrl);
    }
    twitterUrl.setAttribute('content', canonicalUrl);
  };

  const replaceTextNodes = () => {
    const replacements = [
      [/© 2024 Audacious Sheet Metal International B\.V\./g, '© 2026 Audacious Sheet Metal International B.V.'],
      [/Inttelligent/g, 'Intelligent'],
      [/Voor intelligent\s*plaatwerk\.?/gi, 'Voor intelligent en gedurfd plaatwerk.'],
      [/Van jobber naar ketenregisseur/gi, 'Ketenregisseur'],
      [/\bSCM\b/g, 'Keten'],
      [/Werkzaahmeid/gi, 'Werkzaamheden'],
      [/Werkzaamheiden/gi, 'Werkzaamheden'],
      [/\bWerkzaamheid\b/g, 'Werkzaamheden'],
      [/Einsteinstraat 7, 6902 PB Zevenaar, Nederland/g, ADDRESS],
      [/Einsteinstraat 7/g, 'Mega 16'],
      [/6902 PB Zevenaar/g, '6902 KL Zevenaar'],
      [/Mega 16, 6902 KL Zevenaar, Nederland/g, ADDRESS]
    ];

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SELECT'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      let text = node.nodeValue;
      replacements.forEach(([pattern, replacement]) => {
        text = text.replace(pattern, replacement);
      });
      node.nodeValue = text;
    });
  };

  const applyHomeCopy = () => {
    if (!document.querySelector('.hero')) return;

    setText('.hero-badge span', 'Zevenaar - intelligent en gedurfd plaatwerk');
    setHtml('.hero-title', 'Voor intelligent<br><em>en gedurfd plaatwerk.</em>');
    setText('.hero-sub', 'Audacious Sheet Metal ontwikkelt en vervaardigt plaatwerkproducten uit roestvaststaal, aluminium en staal. Van enkelstuks tot kleine series, van lasersnij-, kant- en laswerk tot constructiewerk, cleanroom verpakken en complete assemblage.');

    setText('.hero-proof-stars', 'Keten');
    setText('.hero-proof strong', 'Ketenregisseur');
    setText('.hero-proof span', 'Plaatwerk, constructiewerk, cleanroom verpakken, assemblage en vaste partners in één keten');
  };

  const forceAddress = () => {
    document.querySelectorAll('.footer-col, .sidebar-contact, .contact-info-list, .page-panel-list, .technical-list, .simple-footer').forEach((section) => {
      if (!section.textContent.toLowerCase().includes('zevenaar') && !section.textContent.toLowerCase().includes('adres')) return;
      section.querySelectorAll('span, strong, p, a').forEach((element) => {
        const text = element.textContent.replace(/\s+/g, ' ').trim();
        if (/einsteinstraat|6902 pb|mega 16|6902 kl|zevenaar/i.test(text) && !/@/.test(text) && !/0316|\+31|kvk|btw|iban/i.test(text)) {
          element.textContent = ADDRESS;
        }
      });
    });

    document.querySelectorAll('.footer-col:nth-child(4) span, .sidebar-contact span, .simple-footer span:last-child').forEach((element) => {
      element.textContent = ADDRESS;
    });

    document.querySelectorAll('.page-panel-row').forEach((row) => {
      const label = row.querySelector('span')?.textContent.trim().toLowerCase();
      if (label === 'adres') {
        const value = row.querySelector('strong');
        if (value) value.textContent = ADDRESS;
      }
    });
  };

  const ensureContactFormAnchor = () => {
    const section = document.querySelector('.contact-form-section') || document.querySelector('[data-audacious-contact-form]')?.closest('section');
    if (!section) return;
    section.id = 'offerte-aanvragen';

    if (window.location.hash === '#offerte-aanvragen' && !section.dataset.scrolledToQuote) {
      section.dataset.scrolledToQuote = 'true';
      window.setTimeout(() => section.scrollIntoView({behavior: 'smooth', block: 'start'}), 180);
    }
  };

  const ensureCleanroomLinks = () => {
    const footerWork = document.querySelector('.footer-col:nth-child(3)');
    if (footerWork && !footerWork.textContent.toLowerCase().includes('cleanroom')) {
      const link = document.createElement('a');
      link.href = '/cleanroom-verpakken';
      link.textContent = 'Cleanroom verpakken';
      const assemblage = Array.from(footerWork.querySelectorAll('a, span')).find((item) => item.textContent.toLowerCase().includes('assemblage'));
      if (assemblage) footerWork.insertBefore(link, assemblage);
      else footerWork.appendChild(link);
    }

    const specStrip = document.querySelector('.page-spec-strip');
    if (specStrip && document.body.textContent.includes('Werkzaamheden') && !specStrip.textContent.toLowerCase().includes('cleanroom')) {
      const span = document.createElement('span');
      span.textContent = 'CLEANROOM VERPAKKEN';
      specStrip.appendChild(span);
    }

    const technicalList = document.querySelector('.technical-list');
    if (technicalList && document.querySelector('.page-title')?.textContent.includes('Plaatwerk van voorbereiding') && !technicalList.textContent.toLowerCase().includes('cleanroom')) {
      const article = document.createElement('article');
      article.innerHTML = '<span class="num">07</span><h3><a href="/cleanroom-verpakken" style="color:inherit;text-decoration:none">Cleanroom verpakken</a></h3><p>Reinigen, controleren en verpakken van onderdelen volgens de gevraagde specificatie, zodat producten schoon en beschermd aankomen.</p>';
      technicalList.appendChild(article);
    }
  };

  const removeContactCmsIntro = () => {
    if (!isContactPage()) return;
    document.querySelectorAll('.cms-rendered-section').forEach((section) => {
      const text = section.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
      if (text.includes('intro') || text.includes('contact')) section.remove();
    });
  };

  const serviceDepth = {
    '/lasersnijden': {
      eyebrow: 'Werkzaamheden / Lasersnijden',
      introTitle: 'Meer dan alleen contouren snijden',
      intro: 'Lasersnijden is de basis van het verdere productieproces. Daarom wordt vooraf gekeken naar materiaal, toleranties, gaten, uitsparingen, zetlijnen, lasnaden en de bewerkingen die daarna volgen.',
      points: [
        ['Uitslagcontrole', 'Controle op maatvoering, toleranties, gaten, sleuven en verbindingen voordat het onderdeel naar productie gaat.'],
        ['Materiaalkeuze', 'Afstemming tussen staal, RVS en aluminium op toepassing, afwerking, corrosiebestendigheid en vervolgproces.'],
        ['Voorbereid op kanten', 'Snijdelen worden zo voorbereid dat buigradius, zetvolgorde en passing in de volgende stap kloppen.'],
        ['Ketenlogica', 'De snede wordt afgestemd op lassen, montage, oppervlaktebehandeling en eventuele assemblage.']
      ],
      cardsTitle: 'Typische toepassingen',
      cards: [
        ['Monodelen', 'Losse plaatwerkdelen voor machinebouw, apparatenbouw en technische samenstellingen.'],
        ['Uitslagen', 'Vlakke snijdelen die aansluitend worden gezet, gelast of gemonteerd.'],
        ['Behuizingen', 'Nauwkeurige onderdelen voor kasten, omkastingen en technische modules.'],
        ['Kleine series', 'Herhaalbaar snijwerk waarbij planning, nesting en ordersturing belangrijk zijn.']
      ],
      specs: ['STAAL', 'RVS', 'ALUMINIUM', 'VERVOLGBEWERKING']
    },
    '/kanten': {
      eyebrow: 'Werkzaamheden / Kanten',
      introTitle: 'Zetten met controle op passing en herhaalbaarheid',
      intro: 'Bij kanten draait het niet alleen om buigen, maar om de juiste volgorde, radius, maatvoering en aansluiting op het eindproduct. Audacious stemt kantwerk af op het ontwerp en de vervolgstappen.',
      points: [
        ['Zetvolgorde', 'De volgorde wordt bepaald op bereikbaarheid, maatvoering en minimale kans op vervorming.'],
        ['Buigradius', 'Materiaal, plaatdikte en radius worden op elkaar afgestemd voor een voorspelbaar resultaat.'],
        ['Passing', 'Aansluitingen met andere onderdelen worden meegenomen in de voorbereiding.'],
        ['Herhaalbaarheid', 'Kleine series worden zo voorbereid dat ieder deel consistent uit de machine komt.']
      ],
      cardsTitle: 'Waarvoor ingezet',
      cards: [
        ['Behuizingen', 'Gezette plaatdelen voor kasten, schermen en omkastingen.'],
        ['Frames', 'Kantwerk als onderdeel van constructieve samenstellingen.'],
        ['Montagedelen', 'Onderdelen die direct aansluiten op montage of assemblage.'],
        ['Precisiedelen', 'Plaatwerk waarbij radius, maatvoering en passing leidend zijn.']
      ],
      specs: ['CNC-KANTEN', 'RADIUS', 'PASSING', 'SERIEWERK']
    },
    '/walsen': {
      eyebrow: 'Werkzaamheden / Walsen',
      introTitle: 'Rondingen en radiusdelen uit plaatwerk',
      intro: 'Walsen wordt toegepast wanneer plaatwerk een gecontroleerde ronding of radius nodig heeft. De vorm wordt afgestemd op passing, constructie en het verdere productieproces.',
      points: [
        ['Radiuscontrole', 'De gewenste ronding wordt afgestemd op materiaal, plaatdikte en toepassing.'],
        ['Vormvastheid', 'Er wordt gelet op vervorming, spanning en aansluiting op andere onderdelen.'],
        ['Combinatie met lassen', 'Gewalste delen worden vaak voorbereid voor laswerk of verdere montage.'],
        ['Praktische maakbaarheid', 'De gekozen vorm wordt beoordeeld op haalbaarheid, toleranties en eindgebruik.']
      ],
      cardsTitle: 'Toepassingen',
      cards: [
        ['Ronde delen', 'Plaatwerkdelen met gecontroleerde radius of cilindrische vorm.'],
        ['Machinebouw', 'Onderdelen voor machines, installaties en technische modules.'],
        ['Constructies', 'Vormdelen die onderdeel zijn van een frame of behuizing.'],
        ['Maatwerk', 'Specifieke rondingen op basis van tekening of model.']
      ],
      specs: ['RADIUS', 'PLAATVORMING', 'CONSTRUCTIE', 'MAATWERK']
    },
    '/persen': {
      eyebrow: 'Werkzaamheden / Persen',
      introTitle: 'Vormbewerkingen voor functioneel plaatwerk',
      intro: 'Persen en vormen worden ingezet wanneer plaatwerk een functionele vorm, passing of versteviging nodig heeft. De bewerking wordt afgestemd op materiaal, onderdeelgeometrie en toepassing.',
      points: [
        ['Vormfunctie', 'De persbewerking ondersteunt passing, sterkte, montage of technische functie.'],
        ['Materiaalgedrag', 'Er wordt rekening gehouden met plaatdikte, rek, spanning en mogelijke vervorming.'],
        ['Herhaalbaar proces', 'Vormdelen worden voorbereid op consistent resultaat bij enkelstuks en kleine series.'],
        ['Samenhang', 'Perswerk wordt afgestemd op snijden, kanten, lassen en assemblage.']
      ],
      cardsTitle: 'Voorbeelden',
      cards: [
        ['Verstevigingen', 'Vormen die sterkte of stijfheid toevoegen aan plaatwerk.'],
        ['Passingen', 'Plaatwerkvormen die aansluiten op montage of verbindingen.'],
        ['Functionele delen', 'Onderdelen waarbij de vorm direct bijdraagt aan gebruik.'],
        ['Specials', 'Specifieke vormbewerkingen volgens tekening of toepassing.']
      ],
      specs: ['VORMEN', 'PERSEN', 'PASSING', 'FUNCTIE']
    },
    '/lassen': {
      eyebrow: 'Werkzaamheden / Lassen',
      introTitle: 'Samenstellen met aandacht voor constructie en afwerking',
      intro: 'Laswerk vraagt om controle op passing, vervorming, lasvolgorde en afwerking. Audacious verwerkt plaatwerkdelen tot stabiele samenstellingen, frames, behuizingen en modules.',
      points: [
        ['Voorbereiding', 'Onderdelen worden beoordeeld op passing, lasnaad, opspanning en bereikbaarheid.'],
        ['Vervormingsbeheersing', 'Lasvolgorde en constructie worden afgestemd om vervorming te beperken.'],
        ['Materiaal', 'Staal, RVS en aluminium vragen ieder om een passende aanpak.'],
        ['Afwerking', 'Laswerk wordt afgestemd op de gewenste afwerking en eindtoepassing.']
      ],
      cardsTitle: 'Laswerk in praktijk',
      cards: [
        ['Frames', 'Constructieve samenstellingen voor machines en installaties.'],
        ['Behuizingen', 'Gelaste kasten, omkastingen en plaatwerkmodules.'],
        ['RVS werk', 'Samenstellingen waarbij hygiëne, afwerking of corrosiebestendigheid belangrijk is.'],
        ['Assemblage', 'Laswerk als onderdeel van complete montageklare producten.']
      ],
      specs: ['MIG/MAG', 'TIG', 'STAAL/RVS/ALU', 'SAMENSTELLING']
    },
    '/oppervlaktebehandelingen': {
      eyebrow: 'Werkzaamheden / Oppervlaktebehandeling',
      introTitle: 'Afwerking afgestemd op gebruik en omgeving',
      intro: 'Oppervlaktebehandeling wordt gekozen op basis van uitstraling, corrosiebestendigheid, hygiëne en gebruiksomgeving. Audacious stemt dit af met vaste specialistische partners.',
      points: [
        ['Functie', 'Afwerking wordt gekozen op bescherming, reinigbaarheid, uitstraling of technische eisen.'],
        ['Partnerketen', 'Specialistische behandelingen worden gecoördineerd met vaste partners.'],
        ['Voorbehandeling', 'Lasnaden, randen en oppervlakken worden voorbereid op de gekozen behandeling.'],
        ['Kwaliteitsbewaking', 'De afwerking wordt meegenomen in planning, controle en uitlevering.']
      ],
      cardsTitle: 'Mogelijke behandelingen',
      cards: [
        ['Poedercoaten', 'Duurzame laklaag voor uitstraling en bescherming.'],
        ['Beitsen/passiveren', 'RVS-behandeling voor corrosiebestendigheid en reinheid.'],
        ['Verzinken', 'Bescherming van staal in zwaardere omgevingen.'],
        ['Specifieke afwerking', 'Afwerking afgestemd op klantvraag, toepassing en normering.']
      ],
      specs: ['COATING', 'RVS', 'BESCHERMING', 'PARTNERS']
    },
    '/assembleren': {
      eyebrow: 'Werkzaamheden / Assembleren',
      introTitle: 'Van plaatwerkdeel naar compleet product',
      intro: 'Assemblage brengt losse onderdelen samen tot submodules, montageklare producten of complete samenstellingen. Audacious combineert productie, controle, montage en logistiek in één proces.',
      points: [
        ['Samenstelling', 'Plaatwerk, bevestigers, onderdelen en partners worden samengebracht in een eindproduct.'],
        ['Controle', 'Passing, maatvoering en compleetheid worden tijdens assemblage bewaakt.'],
        ['Logistiek', 'Onderdelen worden voorbereid op levering, montage of vervolgproces.'],
        ['Ketenregie', 'Audacious kan meerdere productiestappen en partners coördineren.']
      ],
      cardsTitle: 'Assemblagevormen',
      cards: [
        ['Submodules', 'Samengestelde delen die direct in een groter systeem passen.'],
        ['Behuizingen', 'Plaatwerkdelen met montage, bevestiging en afwerking.'],
        ['Machineframes', 'Constructieve delen die montageklaar worden geleverd.'],
        ['Complete producten', 'Producten waarbij productie en samenstelling in één keten vallen.']
      ],
      specs: ['MONTAGE', 'SUBMODULES', 'KETENREGIE', 'LEVERING']
    },
    '/cleanroom-verpakken': {
      eyebrow: 'Werkzaamheden / Cleanroom verpakken',
      introTitle: 'Schoon, gecontroleerd en beschermd afleveren',
      intro: 'Cleanroom verpakken is bedoeld voor onderdelen die schoon en beschermd moeten aankomen. Audacious stemt reinigen, controleren, verpakken en logistiek af op de gevraagde specificatie.',
      points: [
        ['Reiniging', 'Onderdelen worden voorbereid op een schoon en gecontroleerd vervolgtraject.'],
        ['Controle', 'Visuele controle, compleetheid en verpakkingswijze worden meegenomen.'],
        ['Bescherming', 'Verpakking beschermt onderdelen tegen vervuiling en beschadiging tijdens transport.'],
        ['Specificatie', 'De werkwijze wordt afgestemd op klantvraag, sector en toepassing.']
      ],
      cardsTitle: 'Wanneer relevant',
      cards: [
        ['Hightech onderdelen', 'Plaatwerkdelen voor gevoelige technische toepassingen.'],
        ['Medische sector', 'Onderdelen waarbij reinheid en bescherming belangrijk zijn.'],
        ['Semicon', 'Componenten voor omgevingen met hogere reinheidseisen.'],
        ['Assemblages', 'Samengestelde producten die schoon en beschermd geleverd moeten worden.']
      ],
      specs: ['REINIGEN', 'CONTROLEREN', 'VERPAKKEN', 'BESCHERMEN']
    }
  };

  const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));

  const ensureServiceDepth = () => {
    const cleanPath = getCurrentCleanPath();
    const data = serviceDepth[cleanPath];
    if (!data) return;

    const main = document.querySelector('.page-shell');
    const hero = document.querySelector('.page-hero');
    if (!main || !hero) return;

    setText('.page-kicker', data.eyebrow);

    main.querySelectorAll('.cms-rendered-section').forEach((section) => section.remove());

    if (main.querySelector('.page-section[data-service-depth="true"]')) return;
    if (main.querySelector('.page-section')) return;

    const technical = data.points.map((item, index) => `<article><span class="num">${String(index + 1).padStart(2, '0')}</span><h3>${escapeHtml(item[0])}</h3><p>${escapeHtml(item[1])}</p></article>`).join('');
    const cards = data.cards.map((item, index) => `<article class="page-card"><span>${String(index + 1).padStart(2, '0')}</span><div><h3>${escapeHtml(item[0])}</h3><p>${escapeHtml(item[1])}</p></div></article>`).join('');
    const specs = data.specs.map((item) => `<span>${escapeHtml(item)}</span>`).join('');

    hero.insertAdjacentHTML('afterend', `
      <section class="page-section" data-service-depth="true">
        <div class="container page-section-grid">
          <div><h2>${escapeHtml(data.introTitle)}</h2><p class="page-subcopy">${escapeHtml(data.intro)}</p></div>
          <div class="technical-list">${technical}</div>
        </div>
      </section>
      <section class="page-section" data-service-depth="true">
        <div class="container page-section-grid">
          <div><h2>${escapeHtml(data.cardsTitle)}</h2><p class="page-subcopy">Concrete voorbeelden waarvoor deze bewerking binnen Audacious wordt ingezet.</p></div>
          <div><div class="page-card-grid">${cards}</div><div class="page-spec-strip">${specs}</div></div>
        </div>
      </section>
    `);
  };

  const normalizeFooter = () => {
    document.querySelectorAll('.footer-brand p').forEach((paragraph) => {
      if (!paragraph.textContent.trim() || paragraph.textContent.includes('Voor intelligent')) {
        paragraph.textContent = 'Audacious Sheet Metal International B.V. ontwikkelt en produceert plaatwerkoplossingen in enkelstuks en kleine series.';
      }
    });

    document.querySelectorAll('.footer-bottom span:first-child, .simple-footer span:first-child').forEach((span) => {
      span.textContent = '© 2026 Audacious Sheet Metal International B.V.';
    });

    document.querySelectorAll('.footer-bottom span:last-child').forEach((span) => {
      span.textContent = 'Plaatbewerking · CAD/CAM · CNC-machinepark · cleanroom verpakken · assemblage';
    });
  };

  normalizeHeadUrls();
  normalizeLinks();
  replaceTextNodes();
  applyHomeCopy();
  ensureContactFormAnchor();
  ensureCleanroomLinks();
  removeContactCmsIntro();
  ensureServiceDepth();
  normalizeFooter();
  forceAddress();
}

window.addEventListener('DOMContentLoaded', () => {
  applyAudaciousLivegangFixes();
  window.setTimeout(applyAudaciousLivegangFixes, 250);
  window.setTimeout(applyAudaciousLivegangFixes, 900);
  window.setTimeout(applyAudaciousLivegangFixes, 1800);
  window.setTimeout(applyAudaciousLivegangFixes, 3000);
});

window.addEventListener('load', () => {
  applyAudaciousLivegangFixes();
  window.setTimeout(applyAudaciousLivegangFixes, 500);
  window.setTimeout(applyAudaciousLivegangFixes, 1500);
  window.setTimeout(applyAudaciousLivegangFixes, 3500);
});
