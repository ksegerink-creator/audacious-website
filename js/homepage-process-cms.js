const AUDACIOUS_HOME_PROCESS_PROJECT_ID = 'wehjzlhm';
const AUDACIOUS_HOME_PROCESS_DATASET = 'production';
const AUDACIOUS_HOME_PROCESS_API_VERSION = '2025-02-19';

function audaciousHomeProcessSetText(selector, value, root = document) {
  const element = root.querySelector(selector);
  if (element && value !== undefined && value !== null && String(value).trim()) element.textContent = value;
}

function audaciousHomeProcessSetHtml(selector, value, root = document) {
  const element = root.querySelector(selector);
  if (!element || value === undefined || value === null || !String(value).trim()) return;
  element.innerHTML = String(value).split('\n').map((line) => line.trim()).filter(Boolean).join('<br>');
}

async function audaciousFetchHomeProcessBlock() {
  const query = `*[_type == "homePage"][0]{
    processEyebrow,
    processTitle,
    processText,
    processTags,
    processPanelTitle,
    processPanelIntro,
    processPanelCode,
    processItems[]{stepLabel,title,text}
  }`;
  const endpoint = `https://${AUDACIOUS_HOME_PROCESS_PROJECT_ID}.api.sanity.io/v${AUDACIOUS_HOME_PROCESS_API_VERSION}/data/query/${AUDACIOUS_HOME_PROCESS_DATASET}?query=${encodeURIComponent(query)}`;
  const response = await fetch(endpoint, {cache: 'no-store'});
  if (!response.ok) throw new Error(`Sanity homepage process request failed: ${response.status}`);
  return (await response.json())?.result || null;
}

function audaciousApplyHomeProcessBlock(home) {
  if (!home || !document.querySelector('.org-control')) return;

  audaciousHomeProcessSetText('.org-control-eyebrow', home.processEyebrow);
  audaciousHomeProcessSetHtml('.org-control-title', home.processTitle);
  audaciousHomeProcessSetText('.org-control-copy', home.processText);
  audaciousHomeProcessSetText('.org-process-head strong', home.processPanelTitle);
  audaciousHomeProcessSetText('.org-process-head span', home.processPanelIntro);
  audaciousHomeProcessSetText('.org-process-code', home.processPanelCode);

  if (Array.isArray(home.processTags) && home.processTags.length) {
    const tags = document.querySelector('.org-control-tags');
    if (tags) tags.innerHTML = home.processTags.map((tag) => `<span>${String(tag)}</span>`).join('');
  }

  if (Array.isArray(home.processItems) && home.processItems.length) {
    document.querySelectorAll('.org-roadmap-item').forEach((item, index) => {
      const row = home.processItems[index];
      if (!row) return;
      audaciousHomeProcessSetText('.org-roadmap-num', row.stepLabel || `Stap ${index + 1}`, item);
      audaciousHomeProcessSetText('strong', row.title, item);
      audaciousHomeProcessSetText('p', row.text, item);
    });
  }
}

async function audaciousInitHomeProcessBlock() {
  try {
    const home = await audaciousFetchHomeProcessBlock();
    audaciousApplyHomeProcessBlock(home);
  } catch (error) {
    console.warn('Homepage procesblok kon niet uit Sanity geladen worden. Fallback blijft actief.', error);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  audaciousInitHomeProcessBlock();
  window.setTimeout(audaciousInitHomeProcessBlock, 500);
  window.setTimeout(audaciousInitHomeProcessBlock, 1600);
});

window.addEventListener('load', () => {
  audaciousInitHomeProcessBlock();
  window.setTimeout(audaciousInitHomeProcessBlock, 900);
  window.setTimeout(audaciousInitHomeProcessBlock, 2500);
});
