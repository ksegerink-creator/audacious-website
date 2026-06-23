function initAudaciousContactForm() {
  const form = document.querySelector('[data-audacious-contact-form]');
  if (!form || form.dataset.ready === 'true') return;
  form.dataset.ready = 'true';
  form.id = form.id || 'offerte-formulier';

  const section = form.closest('section');
  if (section) section.id = 'offerte-aanvragen';

  const endpoint = 'https://api.web3forms.com/submit';
  const accessKey = 'a0e257fd-aba3-435f-8217-91a7cfbc6bae';

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

  const submitButton = form.querySelector('[data-contact-submit]');
  const defaultSubmitText = submitButton ? submitButton.textContent : '';
  const fields = Array.from(form.querySelectorAll('input, select, textarea'));

  const setStatus = (message, state) => {
    status.textContent = message;
    status.dataset.state = state || 'idle';
  };

  const validateFields = () => {
    for (const field of fields) {
      if (field.type === 'hidden' || field.type === 'checkbox') continue;
      if (typeof field.checkValidity === 'function' && !field.checkValidity()) {
        if (typeof field.reportValidity === 'function') field.reportValidity();
        field.focus();
        return false;
      }
    }
    return true;
  };

  const buildFormData = () => {
    const formData = new FormData();
    fields.forEach((field) => {
      if (!field.name || field.disabled) return;
      if ((field.type === 'checkbox' || field.type === 'radio') && !field.checked) return;
      formData.append(field.name, field.value);
    });
    formData.set('access_key', accessKey);
    formData.append('page_url', window.location.href);
    return formData;
  };

  const submitContact = async () => {
    if (!validateFields()) return;

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
      const response = await fetch(endpoint, {
        method: 'POST',
        body: buildFormData(),
        headers: {
          Accept: 'application/json'
        }
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message || 'Formulier kon niet worden verzonden.');
      }

      fields.forEach((field) => {
        if (field.type === 'hidden' || field.type === 'checkbox') return;
        if (field.tagName === 'SELECT') field.selectedIndex = 0;
        else field.value = '';
      });
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
  };

  if (submitButton) {
    submitButton.addEventListener('click', submitContact);
  }

  form.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    if (event.target && event.target.tagName === 'TEXTAREA') return;
    event.preventDefault();
    submitContact();
  });

  if (window.location.hash === '#offerte-aanvragen' && section) {
    window.setTimeout(() => section.scrollIntoView({behavior: 'smooth', block: 'start'}), 180);
  }
}

window.addEventListener('DOMContentLoaded', initAudaciousContactForm);
window.addEventListener('load', initAudaciousContactForm);
