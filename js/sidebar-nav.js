function loadLogoNavigationStyles() {
  ['../css/logo-nav.css', '../css/sidebar-subnav.css'].forEach((href) => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = href;
    document.head.appendChild(stylesheet);
  });
}

function loadSanityPageImages() {
  if (document.querySelector('script[data-sanity-page-images]')) return;
  const script = document.createElement('script');
  script.src = '../js/sanity-page-images.js';
  script.defer = true;
  script.dataset.sanityPageImages = 'true';
  document.head.appendChild(script);
}

function loadLivegangFixes() {
  if (document.querySelector('script[data-livegang-fixes]')) return;
  const script = document.createElement('script');
  script.src = '../js/livegang-fixes.js';
  script.defer = true;
  script.dataset.livegangFixes = 'true';
  document.head.appendChild(script);
}

function initSidebarNavigation() {
  loadLogoNavigationStyles();
  loadSanityPageImages();
  loadLivegangFixes();

  const nav = document.querySelector('nav');
  if (!nav || nav.dataset.sidebarReady === 'true') return;
  nav.dataset.sidebarReady = 'true';

  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const currentHash = window.location.hash || '';
  const inPagesFolder = window.location.pathname.includes('/pages/');
  const htmlPrefix = inPagesFolder ? '../html/' : '';
  const pagesPrefix = inPagesFolder ? '' : '../pages/';

  const logo = nav.querySelector('.nav-logo');
  const homeHref = `${htmlPrefix}index.html`;
  if (logo) logo.setAttribute('href', homeHref);

  const werkzaamhedenFiles = [
    'werkzaamheden.html',
    'lasersnijden.html',
    'kanten.html',
    'lassen.html',
    'cleanroom-verpakken.html',
    'assembleren.html'
  ];
  const projectFiles = [
    'projecten.html',
    'project-food-frame.html',
    'project-plaatwerk-behuizingen.html',
    'project-rontgenarm.html',
    'project-verpakkingsframes.html',
    'project-behuizing.html',
    'project-schuifdeuren.html',
    'project-transportwagen-kooi.html'
  ];
  const nieuwsFiles = [
    'nieuws.html',
    'nieuws-iso-9001-vervolg.html',
    'nieuws-vervanging-klein-transport.html',
    'nieuws-nieuwe-glasparel-straalcabine.html',
    'nieuws-grotere-stikstoftank.html',
    'nieuws-nieuwe-afzuiging-nedermann.html'
  ];

  const isActivePrimary = (key) => {
    if (key === 'productievoorbereiding') return ['productievoorbereiding.html', 'engineering.html', 'materialen.html'].includes(currentFile);
    if (key === 'werkzaamheden') return werkzaamhedenFiles.includes(currentFile);
    if (key === 'projecten') return projectFiles.includes(currentFile);
    if (key === 'nieuws') return nieuwsFiles.includes(currentFile);
    if (key === 'contact') return currentFile === 'contact.html';
    return false;
  };

  const primaryLinks = [
    { key: 'productievoorbereiding', label: 'Productievoorbereiding', href: `${htmlPrefix}productievoorbereiding.html` },
    { key: 'werkzaamheden', label: 'Werkzaamheden', href: `${htmlPrefix}werkzaamheden.html` },
    { key: 'projecten', label: 'Projecten', href: `${htmlPrefix}projecten.html` },
    { key: 'nieuws', label: 'Nieuws', href: `${htmlPrefix}nieuws.html` },
    { key: 'contact', label: 'Offerte aanvragen', href: `${htmlPrefix}contact.html`, cta: true }
  ];

  const navLinks = nav.querySelector('.nav-links');
  if (navLinks) {
    navLinks.innerHTML = primaryLinks.map((item) => {
      const classes = [isActivePrimary(item.key) ? 'is-active' : '', item.cta ? 'nav-cta' : ''].filter(Boolean).join(' ');
      return `<li><a${classes ? ` class="${classes}"` : ''} href="${item.href}">${item.label}</a></li>`;
    }).join('');
  }

  const existingLinks = Array.from(nav.querySelectorAll('.nav-links a'));

  const prepLinks = [
    { label: 'Productievoorbereiding', href: `${htmlPrefix}productievoorbereiding.html` },
    { label: 'Engineering & CAD/CAM', href: `${htmlPrefix}engineering.html` },
    { label: 'Materialen', href: `${htmlPrefix}materialen.html` }
  ];

  const werkzaamhedenLinks = [
    { label: 'Lasersnijden', href: `${pagesPrefix}lasersnijden.html` },
    { label: 'Kanten', href: `${pagesPrefix}kanten.html` },
    { label: 'Lassen', href: `${pagesPrefix}lassen.html` },
    { label: 'Cleanroom verpakken', href: `${pagesPrefix}cleanroom-verpakken.html` },
    { label: 'Assemblage', href: `${pagesPrefix}assembleren.html` }
  ];

  const projectLinks = [
    { label: 'Alle projecten', href: `${htmlPrefix}projecten.html` },
    { label: 'Food-industrie frame', href: `${pagesPrefix}project-food-frame.html` },
    { label: 'Plaatwerkbehuizingen', href: `${pagesPrefix}project-plaatwerk-behuizingen.html` },
    { label: 'Röntgenarm', href: `${pagesPrefix}project-rontgenarm.html` },
    { label: 'Verpakkingsframes', href: `${pagesPrefix}project-verpakkingsframes.html` },
    { label: 'Behuizing', href: `${pagesPrefix}project-behuizing.html` },
    { label: 'Schuifdeuren', href: `${pagesPrefix}project-schuifdeuren.html` },
    { label: 'Transportwagen en kooi', href: `${pagesPrefix}project-transportwagen-kooi.html` }
  ];

  const newsLinks = [
    { label: 'Alle nieuwsitems', href: `${htmlPrefix}nieuws.html` },
    { label: 'ISO 9001 vervolg', href: `${htmlPrefix}nieuws-iso-9001-vervolg.html` },
    { label: 'Vervanging klein transport', href: `${htmlPrefix}nieuws-vervanging-klein-transport.html` },
    { label: 'Nieuwe glasparel straalcabine', href: `${htmlPrefix}nieuws-nieuwe-glasparel-straalcabine.html` },
    { label: 'Grotere stikstoftank', href: `${htmlPrefix}nieuws-grotere-stikstoftank.html` },
    { label: 'Nieuwe afzuiging Nedermann', href: `${htmlPrefix}nieuws-nieuwe-afzuiging-nedermann.html` }
  ];

  const getChildrenForLabel = (label) => {
    if (label === 'Productievoorbereiding') return prepLinks;
    if (label === 'Werkzaamheden' || label === 'Bewerkingen') return werkzaamhedenLinks;
    if (label === 'Projecten') return projectLinks;
    if (label === 'Nieuws') return newsLinks;
    return [];
  };

  const normalizeHref = (href) => {
    if (!href) return '#';
    return href
      .replace('../pages/werkzaamheden.html', '../html/werkzaamheden.html')
      .replace('../pages/projecten.html', '../html/projecten.html')
      .replace('../pages/over-ons.html', '../html/over-ons.html')
      .replace('../pages/contact.html', '../html/contact.html')
      .replace('../html/producten.html', '../html/projecten.html')
      .replace('producten.html', 'projecten.html')
      .replace('blog.html', 'nieuws.html')
      .replace('blog-detail.html', 'nieuws.html');
  };

  const items = [
    { label: 'Home', href: homeHref },
    ...existingLinks
      .map((link) => {
        let label = link.textContent.trim();
        let href = normalizeHref(link.getAttribute('href') || '#');

        if (label === 'Blog') label = 'Nieuws';
        if (label === 'Offerte aanvragen') label = 'Contact';
        if (label === 'Producten') {
          label = 'Projecten';
          href = `${htmlPrefix}projecten.html`;
        }

        if (inPagesFolder && href && !href.startsWith('../') && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('#')) {
          href = `${htmlPrefix}${href}`;
        }

        return {
          label,
          href: normalizeHref(href),
          cta: link.classList.contains('nav-cta'),
          children: getChildrenForLabel(label)
        };
      })
      .filter((item) => item.label !== 'Blog' && item.label !== 'Producten')
  ];

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-menu-toggle';
  toggle.setAttribute('aria-label', 'Menu openen');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.textContent = 'Menu';
  nav.appendChild(toggle);

  const sidebar = document.createElement('div');
  sidebar.className = 'sidebar-menu';
  sidebar.setAttribute('aria-hidden', 'true');

  const getFile = (href) => href.split('/').pop().split('#')[0] || '';
  const getHash = (href) => href.includes('#') ? `#${href.split('#')[1]}` : '';

  const renderSubLinks = (children) => {
    if (!children || !children.length) return '';
    return `<div class="sidebar-sublist">${children.map((child, childIndex) => {
      const childFile = getFile(child.href);
      const childHash = getHash(child.href);
      const active = childFile === currentFile && (!childHash || childHash === currentHash);
      return `<a class="sidebar-sublink${active ? ' is-active' : ''}" href="${child.href}"><span class="sidebar-subnum">${String(childIndex + 1).padStart(2, '0')}</span><span>${child.label}</span><span class="sidebar-subarrow">→</span></a>`;
    }).join('')}</div>`;
  };

  sidebar.innerHTML = `
    <div class="sidebar-backdrop" data-sidebar-close></div>
    <aside class="sidebar-panel" aria-label="Navigatiemenu">
      <div class="sidebar-head">
        <a class="sidebar-brand" href="${items[0].href}">Audacious<span>.</span></a>
        <button class="sidebar-close" type="button" aria-label="Menu sluiten" data-sidebar-close>×</button>
      </div>
      <div class="sidebar-list">
        ${items.map((item, index) => {
          const file = getFile(item.href) || 'index.html';
          const childActive = item.children && item.children.some((child) => getFile(child.href) === currentFile && (!getHash(child.href) || getHash(child.href) === currentHash));
          const active = file === currentFile || childActive || (currentFile === '' && file === 'index.html');
          return `<div class="sidebar-item"><a class="sidebar-link${active ? ' is-active' : ''}${item.children && item.children.length ? ' has-sub' : ''}" href="${item.href}"><span class="sidebar-num">${String(index + 1).padStart(2, '0')}</span><span class="sidebar-label">${item.label}</span><span class="sidebar-arrow">→</span></a>${renderSubLinks(item.children)}</div>`;
        }).join('')}
      </div>
      <div class="sidebar-foot">
        <div class="sidebar-contact">
          <a href="mailto:info@audacious.com">info@audacious.com</a>
          <a href="tel:+31316581470">+31 (0)316 - 581 470</a>
          <span>Mega 16, 6902 KL Zevenaar</span>
        </div>
        <div class="sidebar-meta"><span>ASM / MENU</span><span>2026</span></div>
      </div>
    </aside>
  `;

  document.body.appendChild(sidebar);

  const openMenu = () => {
    sidebar.classList.add('is-open');
    sidebar.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('sidebar-locked');
  };

  const closeMenu = () => {
    sidebar.classList.remove('is-open');
    sidebar.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('sidebar-locked');
  };

  toggle.addEventListener('click', openMenu);
  sidebar.querySelectorAll('[data-sidebar-close]').forEach((button) => button.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

window.addEventListener('DOMContentLoaded', initSidebarNavigation);
loadLogoNavigationStyles();
loadSanityPageImages();
loadLivegangFixes();
initSidebarNavigation();
