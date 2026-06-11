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
  `;
  servicesSection.replaceWith(slider);
}

function initServiceSlider() {
  const slider = document.querySelector('.aud-services-slider');
  if (!slider) return;

  const track = slider.querySelector('.aud-services-track');
  const slides = Array.from(slider.querySelectorAll('.aud-service-slide'));
  const total = slides.length;

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
  let wheelLocked = false;
  let lastWheelAt = 0;

  const setActive = (index) => {
    activeIndex = index;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === index);
      slide.querySelectorAll('.aud-service-dot').forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    });
  };

  const scrollToSlide = (index) => {
    const nextIndex = Math.max(0, Math.min(total - 1, index));
    track.scrollTo({ left: nextIndex * track.clientWidth, behavior: 'smooth' });
    setActive(nextIndex);
  };

  const getSliderProgress = () => {
    const rect = slider.getBoundingClientRect();
    return { rect, isActive: rect.top <= 4 && rect.bottom >= window.innerHeight - 4 };
  };

  const handleExclusiveWheel = (event) => {
    const { isActive } = getSliderProgress();
    if (!isActive) return;

    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (Math.abs(delta) < 10) return;

    const goingNext = delta > 0;
    const atStart = activeIndex === 0;
    const atEnd = activeIndex === total - 1;

    if ((goingNext && atEnd) || (!goingNext && atStart)) return;

    event.preventDefault();
    event.stopPropagation();

    const now = Date.now();
    if (wheelLocked || now - lastWheelAt < 820) return;

    wheelLocked = true;
    lastWheelAt = now;
    scrollToSlide(activeIndex + (goingNext ? 1 : -1));

    window.setTimeout(() => {
      wheelLocked = false;
    }, 820);
  };

  window.addEventListener('wheel', handleExclusiveWheel, { passive: false, capture: true });

  slider.querySelectorAll('.aud-service-control').forEach(button => {
    button.addEventListener('click', () => {
      const direction = button.dataset.direction;
      const nextIndex = direction === 'next' ? activeIndex + 1 : activeIndex - 1;
      scrollToSlide((nextIndex + total) % total);
    });
  });

  let rafId = null;
  track.addEventListener('scroll', () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const index = Math.round(track.scrollLeft / track.clientWidth);
      setActive(Math.max(0, Math.min(total - 1, index)));
    });
  }, { passive: true });

  window.addEventListener('resize', () => {
    track.scrollTo({ left: activeIndex * track.clientWidth, behavior: 'auto' });
  });

  setActive(0);
}

initServiceSlider();

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
style.textContent = '.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}';
document.head.appendChild(style);
