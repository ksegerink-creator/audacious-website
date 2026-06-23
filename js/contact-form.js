function initAudaciousContactForm() {
  const form = document.querySelector('[data-audacious-contact-form]');
  if (!form || form.dataset.ready === 'true') return;
  form.dataset.ready = 'true';
  form.id = form.id || 'offerte-formulier';

  const section = form.closest('section');
  if (section) section.id = 'offerte-aanvragen';

  const endpoint = form.dataset.formEndpoint || 'https://api.web3forms.com/submit';
  const accessKey = 'a0e257fd-aba3-435f-8217-91a7cfbc6bae';

  form.setAttribute('method', 'POST');
  form.setAttribute('autocomplete', 'on');

  const ensureHiddenField = (name, value) => {
    let input = form.querySelector(`input[name="${name}"]`);
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      form.prepend(input);
    }
    if (!input.value) input.value = value;
  };

  ensureHiddenField('access_key', accessKey);
  ensureHiddenField('subject', 'Nieuwe aanvraag via Audacious.com');
  ensureHiddenField('from_name', 'Audacious website');

  let status = form.querySelector('[data-form-status]');
  if (!status) {
    status = document.createElement('p');
    status.className = 'contact-form-status';
    status.setAttribute('data-form-status', '');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    const actions = form.querySelector('.contact-form-actions');
    if (actions) form.insertBefore(status, actions);
    else form.appendChild(status);
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const defaultSubmitText = submitButton ? submitButton.textContent : '';

  const setStatus = (message, state) => {
    status.textContent = message;
    status.dataset.state = state || 'idle';
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!window.fetch) {
      setStatus('Deze browser ondersteunt verzenden niet goed. Mail direct naar info@audacious.com.', 'error');
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Verzenden...';
    }

    setStatus('', 'idle');

    try {
      const formData = new FormData(form);
      formData.append('page_url', window.location.href);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message || 'Formulier kon niet worden verzonden.');
      }

      form.reset();
      setStatus('Bedankt. Uw aanvraag is verzonden naar Audacious.', 'success');
    } catch (error) {
      console.error('Audacious contactformulier:', error);
      setStatus('Verzenden is niet gelukt. Mail direct naar info@audacious.com of probeer het opnieuw.', 'error');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = defaultSubmitText;
      }
    }
  });

  if (window.location.hash === '#offerte-aanvragen' && section) {
    window.setTimeout(() => section.scrollIntoView({behavior: 'smooth', block: 'start'}), 180);
  }
}

window.addEventListener('DOMContentLoaded', initAudaciousContactForm);
window.addEventListener('load', initAudaciousContactForm);
