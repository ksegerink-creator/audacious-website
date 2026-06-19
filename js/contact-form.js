function initAudaciousContactForm() {
  const form = document.querySelector('[data-audacious-contact-form]');
  if (!form || form.dataset.ready === 'true') return;
  form.dataset.ready = 'true';

  form.addEventListener('submit', (event) => {
    event.preventDefault();

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
    window.location.href = `mailto:info@audacious.com?subject=${subject}&body=${body}`;
  });
}

window.addEventListener('DOMContentLoaded', initAudaciousContactForm);
window.addEventListener('load', initAudaciousContactForm);
