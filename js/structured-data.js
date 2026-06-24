(function () {
  const origin = 'https://www.audacious.com';
  const orgId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;

  const labels = {
    '/': 'Home',
    '/productievoorbereiding': 'Productievoorbereiding',
    '/engineering': 'Engineering',
    '/materialen': 'Materialen',
    '/werkzaamheden': 'Werkzaamheden',
    '/lasersnijden': 'Lasersnijden',
    '/kanten': 'Kanten',
    '/walsen': 'Walsen',
    '/persen': 'Persen',
    '/lassen': 'Lassen',
    '/oppervlaktebehandelingen': 'Oppervlaktebehandelingen',
    '/assembleren': 'Assembleren',
    '/cleanroom-verpakken': 'Cleanroom verpakken',
    '/projecten': 'Projecten',
    '/nieuws': 'Nieuws',
    '/over-ons': 'Over ons',
    '/markten-en-diensten': 'Markten en Diensten',
    '/werken-bij-audacious': 'Werken bij Audacious',
    '/contact': 'Contact'
  };

  const services = new Set([
    '/productievoorbereiding',
    '/engineering',
    '/materialen',
    '/lasersnijden',
    '/kanten',
    '/walsen',
    '/persen',
    '/lassen',
    '/oppervlaktebehandelingen',
    '/assembleren',
    '/cleanroom-verpakken'
  ]);

  function cleanPath() {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    if (path.startsWith('/html/index')) return '/';
    if (path.startsWith('/html/')) return `/${path.split('/').pop().replace(/\.html$/, '')}`;
    if (path.startsWith('/pages/project-')) return `/projecten/${path.split('/').pop().replace(/^project-/, '').replace(/\.html$/, '')}`;
    if (path.startsWith('/pages/')) return `/${path.split('/').pop().replace(/\.html$/, '')}`;
    return path;
  }

  function titleFor(path) {
    const title = document.title ? document.title.replace(/\s*[|—-]\s*Audacious.*$/i, '').trim() : '';
    return title || labels[path] || 'Audacious Sheet Metal International B.V.';
  }

  function description() {
    return document.querySelector('meta[name="description"]')?.getAttribute('content') || 'Audacious ontwikkelt en produceert plaatwerkoplossingen in staal, RVS en aluminium.';
  }

  function breadcrumbs(path) {
    const items = [{ name: 'Home', item: `${origin}/` }];
    if (path !== '/') {
      if (path.startsWith('/projecten/')) items.push({ name: 'Projecten', item: `${origin}/projecten` });
      if (path.startsWith('/nieuws/')) items.push({ name: 'Nieuws', item: `${origin}/nieuws` });
      if (services.has(path)) items.push({ name: 'Werkzaamheden', item: `${origin}/werkzaamheden` });
      items.push({ name: labels[path] || titleFor(path), item: `${origin}${path}` });
    }
    return items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.item }));
  }

  function schema() {
    const path = cleanPath();
    const url = `${origin}${path === '/' ? '/' : path}`;
    const graph = [
      {
        '@type': ['Organization', 'LocalBusiness'],
        '@id': orgId,
        name: 'Audacious Sheet Metal International B.V.',
        legalName: 'Audacious Sheet Metal International B.V.',
        url: `${origin}/`,
        email: 'info@audacious.com',
        telephone: '+31-316-581470',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Mega 16',
          postalCode: '6902 KL',
          addressLocality: 'Zevenaar',
          addressCountry: 'NL'
        },
        description: 'Audacious ontwikkelt en produceert plaatwerkoplossingen uit staal, RVS en aluminium voor technische industrieen.'
      },
      { '@type': 'WebSite', '@id': websiteId, name: 'Audacious Sheet Metal', url: `${origin}/`, publisher: { '@id': orgId }, inLanguage: 'nl-NL' },
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: titleFor(path), description: description(), isPartOf: { '@id': websiteId }, about: { '@id': orgId }, inLanguage: 'nl-NL' },
      { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: breadcrumbs(path) }
    ];

    if (services.has(path)) {
      graph.push({ '@type': 'Service', '@id': `${url}#service`, name: labels[path] || titleFor(path), serviceType: labels[path] || titleFor(path), description: description(), url, provider: { '@id': orgId } });
    }

    return { '@context': 'https://schema.org', '@graph': graph };
  }

  function inject() {
    document.querySelectorAll('script[data-audacious-structured-data]').forEach((script) => script.remove());
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.audaciousStructuredData = 'true';
    script.textContent = JSON.stringify(schema());
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
  window.addEventListener('load', () => window.setTimeout(inject, 500));
}());
