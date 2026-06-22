function initAudaciousContactForm() {
  const form = document.querySelector('[data-audacious-contact-form]');
  if (!form || form.dataset.ready === 'true') return;
  form.dataset.ready = 'true';
  form.id = form.id || 'offerte-formulier';

  const section = form.closest('section');
  if (section) section.id = 'offerte-aanvragen';

  const buildMailto = () => {
    const data = new FormData(form);
    const subjectValue = data.get('subject') || 'Aanvraag plaatwerk';
    const bodyLines = [
      'Nieuwe aanvraag via audacious.com',
      '',
      `Naam: ${data.get('name') || '-'}`,
      `Bedrijf: ${data.get('company') || '-'}`,
      `E-mail: ${data.get('email') || '-'}`,
      `Telefoon: ${data.get('phone') || '-'}`,
      `Onderwerp: ${subjectValue}`,
      `Materiaal / bewerking: ${data.get('process') || '-'}`,
      `Aantal / planning: ${data.get('planning') || '-'}`,
      `Tekening / STEP-bestand: ${data.get('attachmentNote') || '-'}`,
      '',
      'Bericht:',
      data.get('message') || '-'
    ];

    const subject = encodeURIComponent(`Website aanvraag - ${subjectValue}`);
    const body = encodeURIComponent(bodyLines.join('\n'));
    return `mailto:info@audacious.com?subject=${subject}&body=${body}`;
  };

  const showFallback = () => {
    let notice = form.querySelector('.contact-form-fallback');
    if (!notice) {
      notice = document.createElement('p');
      notice.className = 'contact-form-fallback';
      notice.style.margin = '0';
      notice.style.padding = '1rem 1.55rem';
      notice.style.background = '#fff3e8';
      notice.style.color = '#11110f';
      notice.style.fontWeight = '700';
      notice.style.gridColumn = '1 / -1';
      const actions = form.querySelector('.contact-form-actions');
      if (actions) form.insertBefore(notice, actions);
      else form.appendChild(notice);
    }
    notice.innerHTML = 'Uw mailprogramma wordt geopend. Werkt dat niet? Mail direct naar <a href="mailto:info@audacious.com">info@audacious.com</a>.';
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const mailto = buildMailto();
    showFallback();
    window.location.href = mailto;
  });

  if (window.location.hash === '#offerte-aanvragen' && section) {
    window.setTimeout(() => section.scrollIntoView({behavior: 'smooth', block: 'start'}), 180);
  }
}

window.addEventListener('DOMContentLoaded', initAudaciousContactForm);
window.addEventListener('load', initAudaciousContactForm);