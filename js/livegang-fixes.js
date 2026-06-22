function applyAudaciousLivegangFixes() {
  const setText = (selector, value, root = document) => {
    const element = root.querySelector(selector);
    if (element) element.textContent = value;
  };

  const setHtml = (selector, value, root = document) => {
    const element = root.querySelector(selector);
    if (element) element.innerHTML = value;
  };

  const normalizeHref = (href) => {
    if (!href) return href;
    return href
      .replace('../pages/werkzaamheden.html', '../html/werkzaamheden.html')
      .replace('../pages/markten-en-diensten.html', '../html/markten.html')
      .replace('../pages/markten.html', '../html/markten.html')
      .replace('../pages/projecten.html', '../html/projecten.html')
      .replace('../pages/over-ons.html', '../html/over-ons.html')
      .replace('../pages/contact.html', '../html/contact.html')
      .replace('../html/producten.html', '../html/projecten.html')
      .replace('../pages/producten.html', '../html/projecten.html')
      .replace('producten.html', 'projecten.html')
      .replace('blog.html', 'nieuws.html')
      .replace('blog-detail.html', 'nieuws.html');
  };

  const normalizeLinks = () => {
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      const normalized = normalizeHref(href);
      if (normalized && normalized !== href) link.setAttribute('href', normalized);
      if (link.textContent.trim() === 'Hero') link.remove();
      if (link.textContent.trim() === 'Producten') link.textContent = 'Projecten';
      if (link.textContent.trim() === 'Offerte aanvragen') link.textContent = 'Contact';
    });
  };

  const replaceTextNodes = () => {
    const replacements = [
      [/Inttelligent/g, 'Intelligent'],
      [/Voor intelligent\s*plaatwerk\.?/gi, 'Voor intelligent en gedurfd plaatwerk.'],
      [/Van jobber naar ketenregisseur/gi, 'Ketenregisseur'],
      [/\bSCM\b/g, 'Keten'],
      [/Einsteinstraat 7, 6902 PB Zevenaar, Nederland/g, 'Mega 16, 6902 KL Zevenaar'],
      [/Einsteinstraat 7/g, 'Mega 16'],
      [/6902 PB Zevenaar/g, '6902 KL Zevenaar']
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
    const isContactPage = window.location.pathname.endsWith('/contact.html') || document.querySelector('[data-audacious-contact-form]');
    if (!isContactPage) return;
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

    document.querySelectorAll('.footer-bottom span:last-child').forEach((span) => {
      span.textContent = 'Plaatbewerking · CAD/CAM · CNC-machinepark · cleanroom verpakken · assemblage';
    });
  };

  normalizeLinks();
  replaceTextNodes();
  applyHomeCopy();
  ensureCleanroomLinks();
  removeContactCmsIntro();
  normalizeFooter();
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