const PROJECT_OVERVIEW_SANITY_PROJECT_ID = 'wehjzlhm';
const PROJECT_OVERVIEW_SANITY_DATASET = 'production';
const PROJECT_OVERVIEW_SANITY_API_VERSION = '2025-02-19';

function projectOverviewEscape(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
}

function projectOverviewTextToHtml(value) {
  return String(value || '').split('\n').map((line) => line.trim()).filter(Boolean).map(projectOverviewEscape).join('<br>');
}

function projectOverviewSanityImageUrl(url, width = 900) {
  if (!url) return '';
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}auto=format&fit=crop&w=${width}&q=82`;
}

async function fetchProjectOverviewData() {
  const projectSlugs = [
    'project-food-frame',
    'project-plaatwerk-behuizingen',
    'project-rontgenarm',
    'project-verpakkingsframes',
    'project-behuizing',
    'project-schuifdeuren',
    'project-transportwagen-kooi'
  ];
  const query = `{
    "overview": *[_type == "page" && slug.current == "projecten"][0]{projectOverview{eyebrow,title,intro,tags}},
    "projects": *[_type == "page" && slug.current in $projectSlugs]{title, "slug": slug.current, "imageUrl": coalesce(hero.image.asset->url, galleryImages[0].asset->url)}
  }`;
  const endpoint = `https://${PROJECT_OVERVIEW_SANITY_PROJECT_ID}.api.sanity.io/v${PROJECT_OVERVIEW_SANITY_API_VERSION}/data/query/${PROJECT_OVERVIEW_SANITY_DATASET}?query=${encodeURIComponent(query)}&$projectSlugs=${encodeURIComponent(JSON.stringify(projectSlugs))}`;
  const response = await fetch(endpoint, {cache: 'no-store'});
  if (!response.ok) throw new Error(`Project overview request failed: ${response.status}`);
  return (await response.json())?.result || null;
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

function projectSlugFromHref(href) {
  const clean = String(href || '').split('#')[0].replace(/\/$/, '');
  const last = clean.split('/').pop();
  return last ? `project-${last}` : '';
}

function applyProjectCardImages(projects = []) {
  if (!Array.isArray(projects) || !projects.length) return;
  const bySlug = new Map(projects.filter((project) => project?.slug && project?.imageUrl).map((project) => [project.slug, project.imageUrl]));

  document.querySelectorAll('.project-card-link[href]').forEach((card) => {
    const slug = projectSlugFromHref(card.getAttribute('href'));
    const rawUrl = bySlug.get(slug);
    if (!rawUrl) return;
    const imageUrl = projectOverviewSanityImageUrl(rawUrl);
    card.style.setProperty('--project-image', `url('${imageUrl}')`);
    card.classList.add('has-project-image');
  });
}

async function initProjectOverviewFromSanity() {
  try {
    const data = await fetchProjectOverviewData();
    applyProjectOverview(data?.overview?.projectOverview);
    applyProjectCardImages(data?.projects || []);
  } catch (error) {
    console.warn('Projectenblok kon niet uit Sanity geladen worden.', error);
  }
}

window.addEventListener('DOMContentLoaded', initProjectOverviewFromSanity);
window.addEventListener('load', () => window.setTimeout(initProjectOverviewFromSanity, 500));
