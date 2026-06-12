function loadLogoNavigationStyles() {
  if (document.querySelector('link[href="../css/logo-nav.css"]')) return;
  const logoStyles = document.createElement('link');
  logoStyles.rel = 'stylesheet';
  logoStyles.href = '../css/logo-nav.css';
  document.head.appendChild(logoStyles);
}

function initSidebarNavigation() {
  loadLogoNavigationStyles();

  const nav = document.querySelector('nav');
  if (!nav || nav.dataset.sidebarReady === 'true') return;
  nav.dataset.sidebarReady = 'true';

  const existingLinks = Array.from(nav.querySelectorAll('.nav-links a'));
  const logo = nav.querySelector('.nav-logo');
  const homeHref = logo ? logo.getAttribute('href') || 'index.html' : 'index.html';

  const items = [
    { label: 'Home', href: homeHref.includes('index.html') ? homeHref : 'index.html' },
    ...existingLinks.map((link) => ({
      label: link.textContent.trim(),
      href: link.getAttribute('href') || '#',
      cta: link.classList.contains('nav-cta')
    }))
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

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  sidebar.innerHTML = `
    <div class="sidebar-backdrop" data-sidebar-close></div>
    <aside class="sidebar-panel" aria-label="Navigatiemenu">
      <div class="sidebar-head">
        <a class="sidebar-brand" href="${homeHref}">Audacious<span>.</span></a>
        <button class="sidebar-close" type="button" aria-label="Menu sluiten" data-sidebar-close>×</button>
      </div>
      <div class="sidebar-list">
        ${items.map((item, index) => {
          const file = item.href.split('/').pop().split('#')[0] || 'index.html';
          const active = file === currentPath || (currentPath === '' && file === 'index.html');
          return `<a class="sidebar-link${active ? ' is-active' : ''}" href="${item.href}"><span class="sidebar-num">${String(index + 1).padStart(2, '0')}</span><span class="sidebar-label">${item.label.replace('Offerte aanvragen', 'Contact')}</span><span class="sidebar-arrow">→</span></a>`;
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
