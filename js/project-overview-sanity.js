const PROJECT_OVERVIEW_SANITY_PROJECT_ID = 'wehjzlhm';
const PROJECT_OVERVIEW_SANITY_DATASET = 'production';
const PROJECT_OVERVIEW_SANITY_API_VERSION = '2025-02-19';

function projectOverviewEscape(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
}

function projectOverviewTextToHtml(value) {
  return String(value || '').split('\n').map((line) => line.trim()).filter(Boolean).map(projectOverviewEscape).join('<br>');
}

async function fetchProjectOverview() {
  const query = `*[_type == "page" && slug.current == "projecten"][0]{projectOverview{eyebrow,title,intro,tags}}`;
  const endpoint = `https://${PROJECT_OVERVIEW_SANITY_PROJECT_ID}.api.sanity.io/v${PROJECT_OVERVIEW_SANITY_API_VERSION}/data/query/${PROJECT_OVERVIEW_SANITY_DATASET}?query=${encodeURIComponent(query)}`;
  const response = await fetch(endpoint, {cache: 'no-store'});
  if (!response.ok) throw new Error(`Project overview request failed: ${response.status}`);
  return (await response.json())?.result?.projectOverview || null;
}

function applyProjectOverview(overview) {
  if (!overview) return;
  const root = document.querySelector('.project-index-intro');
  if (!root) return;

  const kicker = root.querySelector('.page-kicker');
  const title = root.querySelector('h2');
  const intro = root.querySelector('p:not(.page-kicker)');
  const tags = root.querySelector('.project-index-tags');

  if (kicker && overview.eyebrow) kicker.textContent = overview.eyebrow;
  if (title && overview.title) title.innerHTML = projectOverviewTextToHtml(overview.title);
  if (intro && overview.intro) intro.textContent = overview.intro;
  if (tags && Array.isArray(overview.tags) && overview.tags.length) {
    tags.innerHTML = overview.tags.map((tag) => `<span>${projectOverviewEscape(tag)}</span>`).join('');
  }
}

async function initProjectOverviewFromSanity() {
  try {
    applyProjectOverview(await fetchProjectOverview());
  } catch (error) {
    console.warn('Projectenblok kon niet uit Sanity geladen worden.', error);
  }
}

window.addEventListener('DOMContentLoaded', initProjectOverviewFromSanity);
window.addEventListener('load', () => window.setTimeout(initProjectOverviewFromSanity, 500));
