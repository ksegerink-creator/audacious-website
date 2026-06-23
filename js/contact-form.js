function initAudaciousContactForm() {
  const form = document.querySelector('[data-audacious-contact-form]');
  if (!form || form.dataset.ready === 'true') return;
  form.dataset.ready = 'true';
  form.id = form.id || 'offerte-formulier';

  const section = form.closest('section');
  if (section) section.id = 'offerte-aanvragen';

  const endpoint = '/api/contact';
  const maxSingleFileSize = 4 * 1024 * 1024;
  const maxTotalFileSize = 4 * 1024 * 1024;

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

  const getFields = () => Array.from(form.querySelectorAll('input, select, textarea'));
  const getFileInputs = () => Array.from(form.querySelectorAll('input[type="file"]'));
  const getSelectedFiles = () => getFileInputs().flatMap((field) => Array.from(field.files || []).map((file) => ({field, file})));

  const setStatus = (message, state) => {
    status.textContent = message;
    status.dataset.state = state || 'idle';
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 MB';
    return `${(bytes / 1024 / 1024).toFixed(1).replace('.0', '')} MB`;
  };

  const validateFields = () => {
    for (const field of getFields()) {
      if (field.type === 'hidden' || field.type === 'checkbox') continue;
      if (typeof field.checkValidity === 'function' && !field.checkValidity()) {
        if (typeof field.reportValidity === 'function') field.reportValidity();
        field.focus();
        return false;
      }
    }
    return true;
  };

  const validateFiles = () => {
    const selectedFiles = getSelectedFiles();
    if (!selectedFiles.length) return true;

    const tooLarge = selectedFiles.find(({file}) => file.size > maxSingleFileSize);
    if (tooLarge) {
      setStatus(`Bestand "${tooLarge.file.name}" is ${formatSize(tooLarge.file.size)}. Upload maximaal 4 MB per aanvraag.`, 'error');
      return false;
    }

    const totalSize = selectedFiles.reduce((sum, item) => sum + item.file.size, 0);
    if (totalSize > maxTotalFileSize) {
      setStatus(`De geselecteerde bestanden zijn samen ${formatSize(totalSize)}. Upload maximaal 4 MB per aanvraag.`, 'error');
      return false;
    }

    return true;
  };

  const buildFormData = () => {
    const formData = new FormData();
    getFields().forEach((field) => {
      if (!field.name || field.disabled) return;
      if ((field.type === 'checkbox' || field.type === 'radio') && !field.checked) return;

      if (field.type === 'file') {
        Array.from(field.files || []).forEach((file) => {
          formData.append(field.name, file, file.name);
        });
        return;
      }

      formData.append(field.name, field.value);
    });

    formData.append('page_url', window.location.href);
    return formData;
  };

  const postFormData = async (formData) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json'
      }
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
      throw new Error(result.message || `Formulier kon niet worden verzonden. Status: ${response.status}`);
    }

    return result;
  };

  const resetFields = () => {
    getFields().forEach((field) => {
      if (field.type === 'hidden' || field.type === 'checkbox') return;
      if (field.tagName === 'SELECT') field.selectedIndex = 0;
      else field.value = '';
    });
  };

  const submitContact = async () => {
    if (!validateFields()) return;
    if (!validateFiles()) return;

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
      await postFormData(buildFormData());
      resetFields();
      setStatus('Bedankt. Uw aanvraag en eventuele bijlage zijn verzonden naar Audacious.', 'success');
    } catch (error) {
      console.error('Audacious contactformulier:', error);
      setStatus(`Verzenden is niet gelukt. Foutmelding: ${error.message || 'onbekend'}.`, 'error');
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
