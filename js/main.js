// Load the staged header/hero redesign without touching the rest of the page yet.
const heroHeaderStyles = document.createElement('link');
heroHeaderStyles.rel = 'stylesheet';
heroHeaderStyles.href = '../css/hero-header.css';
document.head.appendChild(heroHeaderStyles);

// Add a Perform-style technical showcase to the hero.
const heroActions = document.querySelector('.hero-actions');
if (heroActions && !document.querySelector('.hero-showcase')) {
  const showcase = document.createElement('div');
  showcase.className = 'hero-showcase fade-up fade-up-delay-2';
  showcase.innerHTML = `
    <div class="hero-showcase-card" aria-label="Technische plaatwerkvisualisatie" role="img">
      <div class="hero-showcase-meta">
        <span>Audacious SMI B.V.</span>
        <span>Engineering · plaatbewerking · assemblage</span>
      </div>
      <div class="hero-sheet-visual" aria-hidden="true">
        <div class="sheet sheet-one"></div>
        <div class="sheet sheet-two"></div>
        <div class="sheet sheet-three"></div>
        <div class="dimension dimension-x">TOL. ±0.1mm</div>
        <div class="dimension dimension-y">RVS · ALU · STAAL</div>
      </div>
      <div class="hero-showcase-footer">
        <div>
          <strong>Engineering</strong>
          <span>Maakbaarheidscheck vanaf STEP-file of tekening.</span>
        </div>
        <div>
          <strong>Plaatbewerking</strong>
          <span>Lasersnijden, kanten en nauwkeurige mono-delen.</span>
        </div>
        <div>
          <strong>Assemblage</strong>
          <span>Van losse onderdelen naar complete modules.</span>
        </div>
      </div>
    </div>
  `;
  heroActions.insertAdjacentElement('afterend', showcase);
}

// Scroll-triggered fade animations
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

// FAQ accordion
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

// Header scroll state
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (!nav) return;
  nav.classList.toggle('nav-scrolled', window.scrollY > 80);
}, { passive: true });

// Screen reader utilities
const style = document.createElement('style');
style.textContent = '.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}';
document.head.appendChild(style);
