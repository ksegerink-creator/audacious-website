const heroHeaderStyles = document.createElement('link');
heroHeaderStyles.rel = 'stylesheet';
heroHeaderStyles.href = '../css/hero-header.css';
document.head.appendChild(heroHeaderStyles);

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
