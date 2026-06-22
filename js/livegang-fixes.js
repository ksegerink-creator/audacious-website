function applyAudaciousLivegangFixes() {
  const setText = (selector, value, root = document) => {
    const element = root.querySelector(selector);
    if (element) element.textContent = value;
  };

  const setHtml = (selector, value, root = document) => {
    const element = root.querySelector(selector);
    if (element) element.innerHTML = value;
  };

  const normalizeLinks = () => {
    const replacements = new Map([
      ['../pages/werkzaamheden.html', '../html/werkzaamheden.html'],
      ['../pages/markten-en-diensten.html', '../html/markten.html'],
      ['../pages/markten.html', '../html/markten.html'],
      ['../pages/projecten.html', '../html/projecten.html'],
      ['../pages/over-ons.html', '../html/over-ons.html'],
      ['../pages/contact.html', '../html/contact.html'],
      ['../html/producten.html', '../html/projecten.html'],
      ['producten.html', 'projecten.html'],
      ['../pages/producten.html', '../html/projecten.html']
    ]);

    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (replacements.has(href)) link.setAttribute('href', replacements.get(href));
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

    document.querySelectorAll('.hero-proof, .hero-micro, .footer-brand, .footer-bottom').forEach((element) => {
      element.innerHTML = element.innerHTML
        .replace(/SCM/g, 'Keten')
        .replace(/Van jobber naar ketenregisseur/g, 'Ketenregisseur')
        .replace(/Inttelligent/g, 'Intelligent')
        .replace(/Voor intelligent\s*plaatwerk\.?/gi, 'Voor intelligent en gedurfd plaatwerk.');
    });
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

  normalizeLinks();
  applyHomeCopy();
  ensureCleanroomLinks();
}

window.addEventListener('DOMContentLoaded', () => {
  applyAudaciousLivegangFixes();
  window.setTimeout(applyAudaciousLivegangFixes, 250);
  window.setTimeout(applyAudaciousLivegangFixes, 900);
  window.setTimeout(applyAudaciousLivegangFixes, 1800);
});

window.addEventListener('load', () => {
  applyAudaciousLivegangFixes();
  window.setTimeout(applyAudaciousLivegangFixes, 500);
  window.setTimeout(applyAudaciousLivegangFixes, 1500);
});
