function applyAudaciousLivegangFixes() {
  const CONTACT_ANCHOR = '../html/contact.html#offerte-aanvragen';
  const CONTACT_ANCHOR_SAME_PAGE = '#offerte-aanvragen';
  const ADDRESS = 'Mega 16, 6902 KL Zevenaar';

  const setText = (selector, value, root = document) => {
    const element = root.querySelector(selector);
    if (element) element.textContent = value;
  };

  const setHtml = (selector, value, root = document) => {
    const element = root.querySelector(selector);
    if (element) element.innerHTML = value;
  };

  const isContactPage = () => window.location.pathname.endsWith('/contact.html') || Boolean(document.querySelector('[data-audacious-contact-form]'));
  const quoteHref = () => isContactPage() ? CONTACT_ANCHOR_SAME_PAGE : CONTACT_ANCHOR;

  const normalizeHref = (href) => {
    if (!href) return href;
    return href
      .replace('../pages/werkzaamheden.html', '../html/werkzaamheden.html')
      .replace('../pages/markten-en-diensten.html', '../html/markten.html')
      .replace('../pages/markten.html', '../html/markten.html')
      .replace('../pages/projecten.html', '../html/projecten.html')
      .replace('../pages/over-ons.html', '../html/over-ons.html')
      .replace('../pages/contact.html', '../html/contact.html')
      .replace('../html/contact.html#contact', '../html/contact.html#offerte-aanvragen')
      .replace('contact.html#contact', 'contact.html#offerte-aanvragen')
      .replace('../html/producten.html', '../html/projecten.html')
      .replace('../pages/producten.html', '../html/projecten.html')
      .replace('producten.html', 'projecten.html')
      .replace('blog.html', 'nieuws.html')
      .replace('blog-detail.html', 'nieuws.html');
  };

  const normalizeLinks = () => {
    document.querySelectorAll('a[href]').forEach((link) => {
      const originalHref = link.getAttribute('href');
      let href = normalizeHref(originalHref);
      const label = link.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
      const isQuoteLink = link.classList.contains('nav-cta') || label.includes('offerte') || label.includes('aanvraag starten') || label.includes('contact opnemen');

      if (isQuoteLink && !href?.startsWith('mailto:') && !href?.startsWith('tel:')) {
        href = quoteHref();
        if (link.classList.contains('nav-cta')) link.textContent = 'Offerte aanvragen';
      }

      if (href && href !== originalHref) link.setAttribute('href', href);
      if (link.textContent.trim() === 'Hero') link.remove();
      if (link.textContent.trim() === 'Producten') link.textContent = 'Projecten';
    });
  };

  const replaceTextNodes = () => {
    const replacements = [
      [/© 2024 Audacious Sheet Metal International B\.V\./g, '© 2026 Audacious Sheet Metal International B.V.'],
      [/Inttelligent/g, 'Intelligent'],
      [/Voor intelligent\s*plaatwerk\.?/gi, 'Voor intelligent en gedurfd plaatwerk.'],
      [/Van jobber naar ketenregisseur/gi, 'Ketenregisseur'],
      [/\bSCM\b/g, 'Keten'],
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
      link.href = '../pages/cleanroom-verpakken.html';
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
      article.innerHTML = '<span class="num">07</span><h3><a href="../pages/cleanroom-verpakken.html" style="color:inherit;text-decoration:none">Cleanroom verpakken</a></h3><p>Reinigen, controleren en verpakken van onderdelen volgens de gevraagde specificatie, zodat producten schoon en beschermd aankomen.</p>';
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

  normalizeLinks();
  replaceTextNodes();
  applyHomeCopy();
  ensureContactFormAnchor();
  ensureCleanroomLinks();
  removeContactCmsIntro();
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
