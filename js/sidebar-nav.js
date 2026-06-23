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

  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  const currentHash = window.location.hash || '';

  const cleanMap = new Map([
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

  const fileName = window.location.pathname.split('/').pop() || 'index.html';
  const activePath = cleanMap.get(fileName) || pathname;
  const marketPaths = [
    '/markten-en-diensten',
    '/halfgeleiderindustrie',
    '/medische-industrie',
    '/voedingsmiddelenindustrie',
    '/drank-zuivelindustrie',
    '/verpakkingsindustrie',
    '/bouw-meubelindustrie'
  ];

  const logo = nav.querySelector('.nav-logo');
  if (logo) logo.setAttribute('href', '/');

  const primaryLinks = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'productievoorbereiding', label: 'Productievoorbereiding', href: '/productievoorbereiding' },
    { key: 'werkzaamheden', label: 'Werkzaamheden', href: '/werkzaamheden' },
    { key: 'projecten', label: 'Projecten', href: '/projecten' },
    { key: 'nieuws', label: 'Nieuws', href: '/nieuws' },
    { key: 'over-ons', label: 'Over ons', href: '/over-ons' },
    { key: 'contact', label: 'Contact', href: '/contact' }
  ];

  const prepLinks = [
    { label: 'Engineering', href: '/engineering' },
    { label: 'Materialen', href: '/materialen' }
  ];

  const werkzaamhedenLinks = [
    { label: 'Lasersnijden', href: '/lasersnijden' },
    { label: 'Kanten', href: '/kanten' },
    { label: 'Walsen', href: '/walsen' },
    { label: 'Persen', href: '/persen' },
    { label: 'Lassen', href: '/lassen' },
    { label: 'Oppervlaktebehandelingen', href: '/oppervlaktebehandelingen' },
    { label: 'Assembleren', href: '/assembleren' },
    { label: 'Cleanroom verpakken', href: '/cleanroom-verpakken' }
  ];

  const overOnsLinks = [
    { label: 'Markten en Diensten', href: '/markten-en-diensten' },
    { label: 'Werken bij Audacious', href: '/werken-bij-audacious' }
  ];

  const getChildrenForLabel = (label) => {
    if (label === 'Productievoorbereiding') return prepLinks;
    if (label === 'Werkzaamheden' || label === 'Bewerkingen') return werkzaamhedenLinks;
    if (label === 'Over ons') return overOnsLinks;
    return [];
  };

  const isActivePrimary = (item) => {
    if (item.key === 'home') return activePath === '/';
    if (item.key === 'productievoorbereiding') return ['/productievoorbereiding', '/engineering', '/materialen'].includes(activePath);
    if (item.key === 'werkzaamheden') return ['/werkzaamheden', '/lasersnijden', '/kanten', '/walsen', '/persen', '/lassen', '/oppervlaktebehandelingen', '/assembleren', '/cleanroom-verpakken'].includes(activePath);
    if (item.key === 'projecten') return activePath === '/projecten' || activePath.startsWith('/projecten/');
    if (item.key === 'nieuws') return activePath === '/nieuws' || activePath.startsWith('/nieuws/');
    if (item.key === 'over-ons') return ['/over-ons', '/werken-bij-audacious'].includes(activePath) || marketPaths.includes(activePath);
    if (item.key === 'contact') return activePath === '/contact';
    return false;
  };

  const navLinks = nav.querySelector('.nav-links');
  if (navLinks) {
    navLinks.innerHTML = primaryLinks.map((item) => {
      const classes = [isActivePrimary(item) ? 'is-active' : ''].filter(Boolean).join(' ');
      return `<li><a${classes ? ` class="${classes}"` : ''} href="${item.href}">${item.label}</a></li>`;
    }).join('');
  }

  const items = primaryLinks.map((item) => ({
    label: item.label,
    href: item.href,
    children: getChildrenForLabel(item.label)
  }));

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

  const renderSubLinks = (children) => {
    if (!children || !children.length) return '';
    return `<div class="sidebar-sublist">${children.map((child, childIndex) => {
      const active = child.href === activePath && (!child.href.includes('#') || child.href.endsWith(currentHash));
      return `<a class="sidebar-sublink${active ? ' is-active' : ''}" href="${child.href}"><span class="sidebar-subnum">${String(childIndex + 1).padStart(2, '0')}</span><span>${child.label}</span><span class="sidebar-subarrow">→</span></a>`;
    }).join('')}</div>`;
  };

  sidebar.innerHTML = `
    <div class="sidebar-backdrop" data-sidebar-close></div>
    <aside class="sidebar-panel" aria-label="Navigatiemenu">
      <div class="sidebar-head">
        <a class="sidebar-brand" href="/">Audacious<span>.</span></a>
        <button class="sidebar-close" type="button" aria-label="Menu sluiten" data-sidebar-close>×</button>
      </div>
      <div class="sidebar-list">
        ${items.map((item, index) => {
          const childActive = item.children && item.children.some((child) => child.href === activePath);
          const active = item.href === activePath || childActive || (item.href === '/projecten' && activePath.startsWith('/projecten/')) || (item.href === '/nieuws' && activePath.startsWith('/nieuws/')) || (item.href === '/over-ons' && marketPaths.includes(activePath));
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