function applyAudaciousLivegangFixes() {
  const SITE_ORIGIN = 'https://www.audacious.com';
  const CONTACT_ANCHOR = '/contact#offerte-aanvragen';
  const CONTACT_ANCHOR_SAME_PAGE = '#offerte-aanvragen';
  const CORRECT_ADDRESS = 'Mega 16, 6902 KL Zevenaar';

  const cleanPathByFile = new Map([
    ['index.html', '/'], ['productievoorbereiding.html', '/productievoorbereiding'], ['engineering.html', '/engineering'], ['materialen.html', '/materialen'], ['werkzaamheden.html', '/werkzaamheden'], ['projecten.html', '/projecten'], ['nieuws.html', '/nieuws'], ['over-ons.html', '/over-ons'], ['markten.html', '/markten-en-diensten'], ['werken-bij-audacious.html', '/werken-bij-audacious'], ['contact.html', '/contact'], ['lasersnijden.html', '/lasersnijden'], ['lasergraveren.html', '/lasergraveren'], ['kanten.html', '/kanten'], ['walsen.html', '/walsen'], ['persen.html', '/persen'], ['lassen.html', '/lassen'], ['oppervlaktebehandelingen.html', '/oppervlaktebehandelingen'], ['assembleren.html', '/assembleren'], ['cleanroom-verpakken.html', '/cleanroom-verpakken'], ['project-food-frame.html', '/projecten/food-frame'], ['project-plaatwerk-behuizingen.html', '/projecten/plaatwerk-behuizingen'], ['project-rontgenarm.html', '/projecten/rontgenarm'], ['project-verpakkingsframes.html', '/projecten/verpakkingsframes'], ['project-behuizing.html', '/projecten/behuizing'], ['project-schuifdeuren.html', '/projecten/schuifdeuren'], ['project-transportwagen-kooi.html', '/projecten/transportwagen-kooi'], ['nieuws-iso-9001-vervolg.html', '/nieuws/iso-9001-vervolg'], ['nieuws-vervanging-klein-transport.html', '/nieuws/vervanging-klein-transport'], ['nieuws-nieuwe-glasparel-straalcabine.html', '/nieuws/nieuwe-glasparel-straalcabine'], ['nieuws-grotere-stikstoftank.html', '/nieuws/grotere-stikstoftank'], ['nieuws-nieuwe-afzuiging-nedermann.html', '/nieuws/nieuwe-afzuiging-nedermann'], ['halfgeleiderindustrie.html', '/halfgeleiderindustrie'], ['medische-industrie.html', '/medische-industrie'], ['voedingsmiddelenindustrie.html', '/voedingsmiddelenindustrie'], ['drank-zuivelindustrie.html', '/drank-zuivelindustrie'], ['verpakkingsindustrie.html', '/verpakkingsindustrie'], ['bouw-meubelindustrie.html', '/bouw-meubelindustrie']
  ]);

  const getCurrentCleanPath = () => {
    const pathname = window.location.pathname.replace(/\/$/, '') || '/';
    const file = pathname.split('/').pop() || 'index.html';
    return cleanPathByFile.get(file) || pathname;
  };

  const isContactPage = () => getCurrentCleanPath() === '/contact' || Boolean(document.querySelector('[data-audacious-contact-form]'));
  const quoteHref = () => isContactPage() ? CONTACT_ANCHOR_SAME_PAGE : CONTACT_ANCHOR;

  const ensureFavicons = () => {
    document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach((link) => link.remove());
    [{ rel: 'icon' }, { rel: 'shortcut icon' }].forEach((item) => {
      const link = document.createElement('link');
      link.rel = item.rel;
      link.href = '/favicon.svg';
      link.type = 'image/svg+xml';
      document.head.appendChild(link);
    });
  };

  const ensureHomeServicesSync = () => {
    if (!document.querySelector('.aud-services-slider') || document.querySelector('script[data-sanity-home-services]')) return;
    const script = document.createElement('script');
    script.src = '../js/sanity-home-services.js';
    script.defer = true;
    script.dataset.sanityHomeServices = 'true';
    document.head.appendChild(script);
  };

  const ensureCorrectFooterAddress = () => {
    document.querySelectorAll('.site-footer span, .simple-footer span, .footer-col span, .contact-info-item strong').forEach((node) => {
      const text = node.textContent || '';
      if (text.includes('Einsteinstraat') || text.includes('6902 PB') || text.includes('Zevenaar, Nederland')) node.textContent = CORRECT_ADDRESS;
    });
  };

  const ensureHomeFooterCta = () => {
    if (getCurrentCleanPath() !== '/') return;
    const footer = document.querySelector('.site-footer, .simple-footer');
    if (!footer) return;

    if (!document.getElementById('home-footer-cta-style')) {
      const style = document.createElement('style');
      style.id = 'home-footer-cta-style';
      style.textContent = '.home-footer-cta{padding:5rem 0;background:#f8f6f2;border-top:1px solid rgba(17,17,15,.12)}.home-footer-cta .container{width:min(calc(100vw - clamp(2rem,5vw,6rem)),1480px);margin:0 auto}.home-footer-cta-card{display:grid;grid-template-columns:1fr auto;gap:2rem;align-items:end;padding:3rem;background:#11110f;color:#fff}.home-footer-cta h2{margin:0;font-family:var(--font-display);font-size:clamp(2.4rem,5vw,5.8rem);line-height:.9;letter-spacing:-.08em;color:#fff}.home-footer-cta p{max-width:720px;margin:1rem 0 0;color:rgba(255,255,255,.72);line-height:1.7}.home-footer-cta a{display:inline-flex;align-items:center;justify-content:center;min-height:54px;padding:0 1.35rem;border-radius:999px;background:#f58220;color:#11110f;font-weight:850;text-decoration:none}@media(max-width:900px){.home-footer-cta-card{grid-template-columns:1fr;padding:1.5rem}}';
      document.head.appendChild(style);
    }

    let cta = document.getElementById('home-footer-cta');
    if (!cta) {
      cta = document.createElement('section');
      cta.id = 'home-footer-cta';
      cta.className = 'home-footer-cta';
      cta.innerHTML = '<div class="container"><div class="home-footer-cta-card"><div><h2>Een vergelijkbaar project bespreken?</h2><p>Stuur uw tekening, bestand of omschrijving mee. Audacious kijkt mee naar materiaalkeuze, maakbaarheid, bewerkingen en de beste productieroute.</p></div><a href="/contact#offerte-aanvragen">Aanvraag starten</a></div></div>';
    }
    if (cta.nextElementSibling !== footer) footer.parentNode.insertBefore(cta, footer);
  };

  const normalizeHref = (href) => {
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return href;
    const [pathPart, hashPart] = href.split('#');
    const file = pathPart.split('/').pop();
    let clean = cleanPathByFile.get(file) || pathPart;
    if (/producten\.html$/.test(pathPart)) clean = '/projecten';
    if (file === 'blog.html' || file === 'blog-detail.html') clean = '/nieuws';
    if (hashPart === 'contact') return CONTACT_ANCHOR;
    if (hashPart) return `${clean}#${hashPart}`;
    return clean;
  };

  const normalizeLinks = () => {
    document.querySelectorAll('a[href]').forEach((link) => {
      const originalHref = link.getAttribute('href');
      let href = normalizeHref(originalHref);
      const label = link.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
      const isQuoteLink = link.classList.contains('nav-cta') || label.includes('offerte') || label.includes('aanvraag starten');
      if (isQuoteLink && !href?.startsWith('mailto:') && !href?.startsWith('tel:')) href = quoteHref();
      if (href && href !== originalHref) link.setAttribute('href', href);
      if (link.textContent.trim() === 'Hero') link.remove();
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

  const ensureContactFormAnchor = () => {
    const section = document.querySelector('.contact-form-section') || document.querySelector('[data-audacious-contact-form]')?.closest('section');
    if (!section) return;
    section.id = 'offerte-aanvragen';
    if (window.location.hash === '#offerte-aanvragen' && !section.dataset.scrolledToQuote) {
      section.dataset.scrolledToQuote = 'true';
      window.setTimeout(() => section.scrollIntoView({behavior: 'smooth', block: 'start'}), 180);
    }
  };

  ensureFavicons();
  ensureHomeServicesSync();
  normalizeHeadUrls();
  normalizeLinks();
  ensureContactFormAnchor();
  ensureHomeFooterCta();
  ensureCorrectFooterAddress();
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