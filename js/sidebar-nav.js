function loadLogoNavigationStyles() {
  ['../css/logo-nav.css', '../css/sidebar-subnav.css'].forEach((href) => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = href;
    document.head.appendChild(stylesheet);
  });
}

function initSidebarNavigation() {
  loadLogoNavigationStyles();

  const nav = document.querySelector('nav');
  if (!nav || nav.dataset.sidebarReady === 'true') return;
  nav.dataset.sidebarReady = 'true';

  const existingLinks = Array.from(nav.querySelectorAll('.nav-links a'));
  const logo = nav.querySelector('.nav-logo');
  const homeHref = logo ? logo.getAttribute('href') || 'index.html' : 'index.html';
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const inPagesFolder = window.location.pathname.includes('/pages/');
  const htmlPrefix = inPagesFolder ? '../html/' : '';
  const pagesPrefix = inPagesFolder ? '' : '../pages/';

  const detailLinks = [
    { label: 'Kanten', href: `${pagesPrefix}kanten.html` },
    { label: 'Lasersnijden', href: `${pagesPrefix}lasersnijden.html` },
    { label: 'Lassen', href: `${pagesPrefix}lassen.html` },
    { label: 'Walsen', href: `${pagesPrefix}walsen.html` },
    { label: 'Persen', href: `${pagesPrefix}persen.html` },
    { label: 'Oppervlaktebehandeling', href: `${pagesPrefix}oppervlaktebehandelingen.html` },
    { label: 'Assembleren', href: `${pagesPrefix}assembleren.html` }
  ];

  const items = [
    { label: 'Home', href: inPagesFolder ? '../html/index.html' : homeHref.includes('index.html') ? homeHref : 'index.html' },
    ...existingLinks.map((link) => {
      const label = link.textContent.trim();
      let href = link.getAttribute('href') || '#';
      if (inPagesFolder && href && !href.startsWith('../') && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        href = `${htmlPrefix}${href}`;
      }
      return {
        label,
        href,
        cta: link.classList.contains('nav-cta'),
        children: label === 'Werkzaamheden' ? detailLinks : []
      };
    })
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

  const renderSubLinks = (children) => {
    if (!children || !children.length) return '';
    return `<div class="sidebar-sublist">${children.map((child, childIndex) => {
      const childFile = child.href.split('/').pop().split('#')[0] || '';
      const active = childFile === currentFile;
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
          const file = item.href.split('/').pop().split('#')[0] || 'index.html';
          const childActive = item.children && item.children.some((child) => child.href.split('/').pop().split('#')[0] === currentFile);
          const active = file === currentFile || childActive || (currentFile === '' && file === 'index.html');
          return `<div class="sidebar-item"><a class="sidebar-link${active ? ' is-active' : ''}${item.children && item.children.length ? ' has-sub' : ''}" href="${item.href}"><span class="sidebar-num">${String(index + 1).padStart(2, '0')}</span><span class="sidebar-label">${item.label.replace('Offerte aanvragen', 'Contact')}</span><span class="sidebar-arrow">→</span></a>${renderSubLinks(item.children)}</div>`;
        }).join('')}
      </div>
      <div class="sidebar-foot">
        <div class="sidebar-contact">
          <a href="mailto:info@audacious.com">info@audacious.com</a>
          <a href="tel:+31316581470">+31 (0)316 - 581 470</a>
          <span>Zevenaar, Nederland</span>
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
initSidebarNavigation();
