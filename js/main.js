function ensureAudaciousFooterStyles() {
  if (document.querySelector('link[href="../css/footer-polish.css"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '../css/footer-polish.css';
  document.head.appendChild(link);
}

function renderAudaciousFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="footer-logo" href="../html/index.html" aria-label="Audacious homepage"><span class="footer-logo-mark" aria-hidden="true"></span><span class="footer-logo-word">Audacious</span></a>
            <p>Audacious Sheet Metal International B.V. ontwikkelt en produceert plaatwerkoplossingen in enkelstuks en kleine series.</p>
          </div>
          <div class="footer-col">
            <h3>Navigatie</h3>
            <a href="../html/over-ons.html">Over ons</a>
            <a href="../html/projecten.html">Projecten</a>
            <a href="../html/werkzaamheden.html">Bewerkingen</a>
            <a href="../html/nieuws.html">Nieuws</a>
            <a href="../html/contact.html">Contact</a>
          </div>
          <div class="footer-col">
            <h3>Bewerkingen</h3>
            <a href="../pages/lasersnijden.html">Lasersnijden</a>
            <a href="../pages/kanten.html">Kanten</a>
            <a href="../pages/lassen.html">Lassen</a>
            <a href="../pages/assembleren.html">Assemblage</a>
          </div>
          <div class="footer-col">
            <h3>Contact</h3>
            <a href="mailto:info@audacious.com">info@audacious.com</a>
            <a href="tel:+31316581470">0316-581470</a>
            <span>Mega 16, 6902 KL Zevenaar</span>
            <a class="footer-linkedin" href="https://www.linkedin.com/company/audacious-sheet-metal-services-bv/" target="_blank" rel="noopener">LinkedIn →</a>
          </div>
          <div class="footer-affiliations">
            <h3>Wij zijn aangesloten bij</h3>
            <div class="footer-affiliation-list"><span>Kenteq</span><span>Metaalunie</span><span>OOM</span><span>NEVAT</span><span>FDP</span></div>
          </div>
        </div>
        <div class="footer-bottom"><span>© 2026 Audacious Sheet Metal International B.V.</span><span>Plaatbewerking · CAD/CAM · CNC-machinepark · assemblage</span></div>
      </div>
    </footer>
  `;
}

function ensureAudaciousFooter() {
  const footer = document.querySelector('.site-footer, .simple-footer');
  if (!footer) {
    document.body.insertAdjacentHTML('beforeend', renderAudaciousFooter());
    return;
  }

  footer.outerHTML = renderAudaciousFooter();
}

function ensureProofLayout() {
  if (document.getElementById('audacious-proof-main-layout')) return;
  const proofStyle = document.createElement('style');
  proofStyle.id = 'audacious-proof-main-layout';
  proofStyle.textContent = `
    .proof{background:var(--black)!important}.proof .container{max-width:1200px!important;margin:0 auto!important;padding:0 clamp(1.25rem,4vw,3rem)!important}.proof-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:0!important;border:1px solid var(--steel-border)!important;border-radius:4px!important;overflow:hidden!important;background:#fff!important}.proof-item{display:block!important;min-height:190px!important;padding:clamp(1.5rem,3vw,2.5rem)!important;border-right:1px solid var(--steel-border)!important;position:relative!important;background:#fff!important}.proof-item:last-child{border-right:none!important}.proof-title{display:block!important;font-family:var(--font-display)!important;font-size:1.1rem!important;font-weight:600!important;color:var(--white)!important;margin:0 0 .5rem!important;line-height:1.2!important}.proof-body{display:block!important;margin:0!important;font-size:.8rem!important;color:var(--steel-text)!important;line-height:1.5!important}.proof-accent-line{display:block!important;position:absolute!important;top:0!important;left:2.5rem!important;width:2rem!important;height:2px!important;background:var(--accent)!important;border-radius:0 0 2px 2px!important}@media(max-width:900px){.proof-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.proof-item:nth-child(2){border-right:none!important}.proof-item:nth-child(-n+2){border-bottom:1px solid var(--steel-border)!important}}@media(max-width:560px){.proof-grid{grid-template-columns:1fr!important}.proof-item,.proof-item:nth-child(2){border-right:none!important;border-bottom:1px solid var(--steel-border)!important}.proof-item:last-child{border-bottom:none!important}}
  `;
  document.head.appendChild(proofStyle);
}

ensureAudaciousFooterStyles();
ensureAudaciousFooter();
ensureProofLayout();

const sidebarNavStyles = document.createElement('link');
sidebarNavStyles.rel = 'stylesheet';
sidebarNavStyles.href = '../css/sidebar-nav.css';
document.head.appendChild(sidebarNavStyles);

const sidebarNavScript = document.createElement('script');
sidebarNavScript.src = '../js/sidebar-nav.js';
sidebarNavScript.defer = true;
document.head.appendChild(sidebarNavScript);

const heroHeaderStyles = document.createElement('link');
heroHeaderStyles.rel = 'stylesheet';
heroHeaderStyles.href = '../css/hero-header.css';
document.head.appendChild(heroHeaderStyles);

const serviceSliderStyles = document.createElement('link');
serviceSliderStyles.rel = 'stylesheet';
serviceSliderStyles.href = '../css/service-slider.css';
document.head.appendChild(serviceSliderStyles);

const navMap = {
  '#werkzaamheden': '../pages/werkzaamheden.html',
  '#markten': '../pages/markten-en-diensten.html',
  '#projecten': '../pages/projecten.html',
  '#over-ons': '../pages/over-ons.html',
  '#contact': '../pages/contact.html'
};

document.querySelectorAll('nav a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (navMap[href]) link.setAttribute('href', navMap[href]);
});

const logo = document.querySelector('.nav-logo');
if (logo) logo.setAttribute('href', '../html/index.html');

const heroActions = document.querySelector('.hero-actions');
if (heroActions && !document.querySelector('.hero-proof')) {
  const proof = document.createElement('div');
  proof.className = 'hero-proof';

  const stars = document.createElement('div');
  stars.className = 'hero-proof-stars';
  stars.textContent = '5/5';

  const copy = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = 'Productiepartner voor industriele OEM bedrijven';
  const text = document.createElement('span');
  text.textContent = 'Engineering, plaatbewerking, lassen en assemblage';

  copy.appendChild(title);
  copy.appendChild(text);
  proof.appendChild(stars);
  proof.appendChild(copy);
  heroActions.insertAdjacentElement('afterend', proof);
}

const servicesSection = document.querySelector('#werkzaamheden');
if (servicesSection && !document.querySelector('.aud-services-slider')) {
  const slider = document.createElement('section');
  slider.className = 'aud-services-slider';
  slider.setAttribute('aria-label', 'Werkzaamheden slider');
  slider.innerHTML = `
    <div class="aud-services-sticky">
      <div class="aud-services-track">
        <article class="aud-service-slide is-active" style="--slide-bg: url('../assets/hero-press-brake.jpeg'); --slide-pos: 62% center;">
          <div class="aud-service-content">
            <div>
              <p class="aud-service-eyebrow">Werkzaamheden</p>
              <h2 class="aud-service-title">Kanten</h2>
              <p class="aud-service-description">CNC-zetten en buigen van plaatwerkdelen met controle op maatvoering, radius en reproduceerbaarheid.</p>
              <a class="aud-service-button" href="../pages/kanten.html">Meer lezen</a>
            </div>
            <div class="aud-service-meta"><div class="aud-service-counter">01/07</div><div class="aud-service-dots"></div></div>
          </div>
        </article>
        <article class="aud-service-slide" style="--slide-bg: url('../assets/hero-press-brake.jpeg'); --slide-pos: 50% center;">
          <div class="aud-service-content"><div><p class="aud-service-eyebrow">Werkzaamheden</p><h2 class="aud-service-title">Lasersnijden</h2><p class="aud-service-description">Strakke contouren en nauwkeurige uitslagen in staal, RVS en aluminium, voorbereid voor vervolgbewerkingen.</p><a class="aud-service-button" href="../pages/lasersnijden.html">Meer lezen</a></div><div class="aud-service-meta"><div class="aud-service-counter">02/07</div><div class="aud-service-dots"></div></div></div>
        </article>
        <article class="aud-service-slide" style="--slide-bg: url('../assets/hero-press-brake.jpeg'); --slide-pos: 70% center;">
          <div class="aud-service-content"><div><p class="aud-service-eyebrow">Werkzaamheden</p><h2 class="aud-service-title">Lassen</h2><p class="aud-service-description">MIG/MAG en TIG-laswerk voor plaatwerkconstructies, frames, behuizingen en samengestelde onderdelen.</p><a class="aud-service-button" href="../pages/lassen.html">Meer lezen</a></div><div class="aud-service-meta"><div class="aud-service-counter">03/07</div><div class="aud-service-dots"></div></div></div>
        </article>
        <article class="aud-service-slide" style="--slide-bg: url('../assets/hero-press-brake.jpeg'); --slide-pos: 44% center;">
          <div class="aud-service-content"><div><p class="aud-service-eyebrow">Werkzaamheden</p><h2 class="aud-service-title">Walsen</h2><p class="aud-service-description">Rondingen, radiusdelen en gevormde plaatwerkcomponenten voor technische constructies en modules.</p><a class="aud-service-button" href="../pages/walsen.html">Meer lezen</a></div><div class="aud-service-meta"><div class="aud-service-counter">04/07</div><div class="aud-service-dots"></div></div></div>
        </article>
        <article class="aud-service-slide" style="--slide-bg: url('../assets/hero-press-brake.jpeg'); --slide-pos: 58% center;">
          <div class="aud-service-content"><div><p class="aud-service-eyebrow">Werkzaamheden</p><h2 class="aud-service-title">Persen</h2><p class="aud-service-description">Vorm- en persbewerkingen voor plaatwerkdelen waarbij passing, functionaliteit en herhaalbaarheid leidend zijn.</p><a class="aud-service-button" href="../pages/persen.html">Meer lezen</a></div><div class="aud-service-meta"><div class="aud-service-counter">05/07</div><div class="aud-service-dots"></div></div></div>
        </article>
        <article class="aud-service-slide" style="--slide-bg: url('../assets/hero-press-brake.jpeg'); --slide-pos: 66% center;">
          <div class="aud-service-content"><div><p class="aud-service-eyebrow">Werkzaamheden</p><h2 class="aud-service-title">Oppervlaktebehandeling</h2><p class="aud-service-description">Coordinatie van poedercoaten, verzinken, beitsen, passiveren en andere afwerkingen via vaste partners.</p><a class="aud-service-button" href="../pages/oppervlaktebehandelingen.html">Meer lezen</a></div><div class="aud-service-meta"><div class="aud-service-counter">06/07</div><div class="aud-service-dots"></div></div></div>
        </article>
        <article class="aud-service-slide" style="--slide-bg: url('../assets/hero-press-brake.jpeg'); --slide-pos: 55% center;">
          <div class="aud-service-content"><div><p class="aud-service-eyebrow">Werkzaamheden</p><h2 class="aud-service-title">Assembleren</h2><p class="aud-service-description">Van losse plaatwerkdelen naar complete samenstellingen, submodules en montageklare producten.</p><a class="aud-service-button" href="../pages/assembleren.html">Meer lezen</a></div><div class="aud-service-meta"><div class="aud-service-counter">07/07</div><div class="aud-service-dots"></div></div></div>
        </article>
      </div>
      <div class="aud-service-controls" aria-label="Slider controls">
        <button class="aud-service-control" type="button" data-direction="prev" aria-label="Vorige service">←</button>
        <button class="aud-service-control" type="button" data-direction="next" aria-label="Volgende service">→</button>
      </div>
    </div>
  `;
  servicesSection.replaceWith(slider);
}

function initServiceSlider() {
  const slider = document.querySelector('.aud-services-slider');
  if (!slider) return;

  const track = slider.querySelector('.aud-services-track');
  const slides = Array.from(slider.querySelectorAll('.aud-service-slide'));
  const total = slides.length;
  slider.style.setProperty('--slide-count', total);

  slides.forEach((slide, slideIndex) => {
    const dots = slide.querySelector('.aud-service-dots');
    if (!dots) return;
    dots.innerHTML = '';
    slides.forEach((_, dotIndex) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'aud-service-dot';
      button.setAttribute('aria-label', `Ga naar service ${dotIndex + 1}`);
      button.addEventListener('click', () => scrollToSlide(dotIndex));
      dots.appendChild(button);
    });
    const counter = slide.querySelector('.aud-service-counter');
    if (counter) counter.textContent = `${String(slideIndex + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}`;
  });

  let activeIndex = 0;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const setActive = (index) => {
    activeIndex = clamp(index, 0, total - 1);
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
      slide.querySelectorAll('.aud-service-dot').forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    });
  };

  const updateByScroll = () => {
    const rect = slider.getBoundingClientRect();
    const scrollable = slider.offsetHeight - window.innerHeight;
    const progress = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
    const translateX = -progress * (total - 1) * window.innerWidth;
    track.style.transform = `translate3d(${translateX}px, 0, 0)`;
    setActive(Math.round(progress * (total - 1)));
  };

  const scrollToSlide = (index) => {
    const nextIndex = clamp(index, 0, total - 1);
    const sliderTop = slider.getBoundingClientRect().top + window.scrollY;
    const scrollable = slider.offsetHeight - window.innerHeight;
    const targetY = sliderTop + (scrollable * (nextIndex / Math.max(1, total - 1)));
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  slider.querySelectorAll('.aud-service-control').forEach(button => {
    button.addEventListener('click', () => {
      const direction = button.dataset.direction;
      const nextIndex = direction === 'next' ? activeIndex + 1 : activeIndex - 1;
      scrollToSlide((nextIndex + total) % total);
    });
  });

  let rafId = null;
  const requestUpdate = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      updateByScroll();
    });
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  updateByScroll();
}

initServiceSlider();

function initMaterialsSlider() {
  const track = document.querySelector('[data-materials-track]');
  const prev = document.querySelector('[data-materials-prev]');
  const next = document.querySelector('[data-materials-next]');
  if (!track || !prev || !next) return;

  const getStep = () => {
    const card = track.querySelector('.material-card');
    if (!card) return track.clientWidth * 0.8;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const updateButtons = () => {
    const maxScroll = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= maxScroll;
  };

  prev.addEventListener('click', () => {
    track.scrollBy({ left: -getStep(), behavior: 'smooth' });
  });

  next.addEventListener('click', () => {
    track.scrollBy({ left: getStep(), behavior: 'smooth' });
  });

  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let pointerId = null;

  const stopDragging = () => {
    if (!isDragging) return;
    isDragging = false;
    pointerId = null;
    track.classList.remove('is-dragging');
    updateButtons();
  };

  track.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    isDragging = true;
    pointerId = event.pointerId;
    startX = event.clientX;
    startScrollLeft = track.scrollLeft;
    track.classList.add('is-dragging');
    if (track.setPointerCapture) track.setPointerCapture(pointerId);
  });

  track.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    const distance = event.clientX - startX;
    track.scrollLeft = startScrollLeft - distance;
    event.preventDefault();
  });

  track.addEventListener('pointerup', stopDragging);
  track.addEventListener('pointercancel', stopDragging);
  track.addEventListener('lostpointercapture', stopDragging);

  track.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateButtons);
  }, { passive: true });

  window.addEventListener('resize', updateButtons);
  updateButtons();
}

initMaterialsSlider();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (!nav) return;
  nav.classList.toggle('nav-scrolled', window.scrollY > 80);
}, { passive: true });

const style = document.createElement('style');
style.textContent = '.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.materials-controls button:disabled{opacity:.35;cursor:not-allowed;transform:none;background:#f3f1ed;color:#11110f}.materials-track{cursor:grab;user-select:none}.materials-track.is-dragging{cursor:grabbing;scroll-behavior:auto}.materials-track.is-dragging *{pointer-events:none}';
document.head.appendChild(style);
