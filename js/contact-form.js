function initAudaciousContactForm() {
  const form = document.querySelector('[data-audacious-contact-form]');
  if (!form || form.dataset.ready === 'true') return;
  form.dataset.ready = 'true';
  form.id = form.id || 'offerte-formulier';

  const section = form.closest('section');
  if (section) section.id = 'offerte-aanvragen';

  const endpoint = '/api/contact';
  // Limieten van Vercel (4,5 MB per aanvraag). Op de eigen server (Apache/PHP)
  // geeft GET /api/contact ruimere limieten en eventueel een Turnstile-sleutel;
  // op Vercel geeft die GET een 405 en blijven deze waarden staan.
  let maxSingleFileSize = 4 * 1024 * 1024;
  let maxTotalFileSize = 4 * 1024 * 1024;
  let maxFiles = 0;
  let limitText = '4 MB per aanvraag';

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

  const serverConfig = fetch(endpoint, {headers: {Accept: 'application/json'}})
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null)
    .then((config) => {
      if (config && config.maxBestandMB && config.maxTotaalMB) {
        maxSingleFileSize = config.maxBestandMB * 1024 * 1024;
        maxTotalFileSize = config.maxTotaalMB * 1024 * 1024;
        maxFiles = config.maxBestanden || 0;
        limitText = `${config.maxBestandMB} MB per bestand en ${config.maxTotaalMB} MB totaal`;
        const hint = form.querySelector('.contact-file-hint');
        if (hint) hint.textContent = `PDF, STEP/STP, DXF/DWG, ZIP of afbeelding. Maximaal ${config.maxBestandMB} MB per bestand, ${config.maxTotaalMB} MB totaal.`;
      }
      return config;
    });

  /*
   * Cloudflare Turnstile (alleen op de eigen server, en alleen als daar een
   * sleutel is ingesteld). Het script van Cloudflare wordt pas geladen bij de
   * eerste interactie met het formulier, zodat een bezoeker die niets invult
   * er niets van merkt.
   */
  let captchaBox = null;
  let widget = null;
  let widgetReady;
  const startCaptcha = () => {
    widgetReady = widgetReady || serverConfig.then((config) => {
      if (!config || !config.captcha) return;
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.onload = () => {
          if (!window.turnstile) return resolve();
          captchaBox = document.createElement('div');
          captchaBox.className = 'contact-form-captcha';
          form.insertBefore(captchaBox, status);
          const id = window.turnstile.render(captchaBox, {sitekey: String(config.captcha), language: 'nl'});
          widget = {api: window.turnstile, id};
          resolve();
        };
        script.onerror = () => resolve();
        document.head.appendChild(script);
      });
    });
    return widgetReady;
  };
  form.addEventListener('focusin', startCaptcha, {once: true});
  form.addEventListener('pointerdown', startCaptcha, {once: true});

  /** Wacht tot Turnstile een token heeft, maximaal ±15 seconden. */
  const captchaToken = async () => {
    await startCaptcha();
    for (let i = 0; widget && !widget.api.getResponse(widget.id) && i < 60; i += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 250));
    }
    return widget ? widget.api.getResponse(widget.id) || '' : null;
  };

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

    if (maxFiles && selectedFiles.length > maxFiles) {
      setStatus(`U heeft ${selectedFiles.length} bestanden gekozen. Upload maximaal ${maxFiles} bestanden per aanvraag.`, 'error');
      return false;
    }

    const tooLarge = selectedFiles.find(({file}) => file.size > maxSingleFileSize);
    if (tooLarge) {
      setStatus(`Bestand "${tooLarge.file.name}" is ${formatSize(tooLarge.file.size)}. Upload maximaal ${limitText}.`, 'error');
      return false;
    }

    const totalSize = selectedFiles.reduce((sum, item) => sum + item.file.size, 0);
    if (totalSize > maxTotalFileSize) {
      setStatus(`De geselecteerde bestanden zijn samen ${formatSize(totalSize)}. Upload maximaal ${limitText}.`, 'error');
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
    await serverConfig;
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
      const formData = buildFormData();
      if (widget || (await serverConfig)?.captcha) {
        setStatus('Beveiligingscontrole loopt...', 'idle');
        const token = await captchaToken();
        if (token !== null) formData.set('cf-turnstile-response', token);
        setStatus('', 'idle');
      }
      await postFormData(formData);
      resetFields();
      setStatus('Bedankt. Uw aanvraag en eventuele bijlage zijn verzonden naar Audacious.', 'success');
    } catch (error) {
      console.error('Audacious contactformulier:', error);
      setStatus(`Verzenden is niet gelukt. Foutmelding: ${String(error.message || 'onbekend').replace(/\.$/, '')}.`, 'error');
      // Een Turnstile-token is maar één keer bruikbaar.
      if (widget) widget.api.reset(widget.id);
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
