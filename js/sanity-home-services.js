const AUDACIOUS_HOME_SERVICES_PROJECT_ID = 'wehjzlhm';
const AUDACIOUS_HOME_SERVICES_DATASET = 'production';
const AUDACIOUS_HOME_SERVICES_API_VERSION = '2025-02-19';

function audaciousHomeEscape(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
}

function audaciousHomeImage(url, width = 2200) {
  if (!url) return '../assets/hero-press-brake.jpeg';
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}auto=format&fit=crop&w=${width}&q=88`;
}

function audaciousServiceHref(slug) {
  if (!slug) return '/werkzaamheden';
  return `/${slug.replace(/^\/+/, '')}`;
}

async function audaciousFetchHomeServices() {
  const query = `*[_type == "service" && defined(slug.current)] | order(coalesce(order, 999) asc, title asc){
    title,
    "slug": slug.current,
    order,
    intro,
    summary,
    hero{title,intro,"imageUrl": image.asset->url},
    "heroImageUrl": heroImage.asset->url
  }`;
  const endpoint = `https://${AUDACIOUS_HOME_SERVICES_PROJECT_ID}.api.sanity.io/v${AUDACIOUS_HOME_SERVICES_API_VERSION}/data/query/${AUDACIOUS_HOME_SERVICES_DATASET}?query=${encodeURIComponent(query)}`;
  const response = await fetch(endpoint, {cache: 'no-store'});
  if (!response.ok) throw new Error(`Sanity services request failed: ${response.status}`);
  return (await response.json())?.result || [];
}

function audaciousRenderServiceSlide(service, index, total) {
  const title = service.hero?.title || service.title || 'Werkzaamheid';
  const text = service.hero?.intro || service.intro || service.summary || 'Meer informatie over deze werkzaamheid.';
  const image = audaciousHomeImage(service.hero?.imageUrl || service.heroImageUrl, index === 0 ? 2400 : 1800);
  const href = audaciousServiceHref(service.slug);
  return `<article class="aud-service-slide${index === 0 ? ' is-active' : ''}" style="--slide-bg: url('${image}'); --slide-pos: 55% center;"><div class="aud-service-content"><div><p class="aud-service-eyebrow">Werkzaamheden</p><h2 class="aud-service-title">${audaciousHomeEscape(title)}</h2><p class="aud-service-description">${audaciousHomeEscape(text)}</p><a class="aud-service-button" href="${audaciousHomeEscape(href)}">Meer lezen</a></div><div class="aud-service-meta"><div class="aud-service-counter">${String(index + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}</div><div class="aud-service-dots"></div></div></div></article>`;
}

async function audaciousApplyHomeServicesFromSanity() {
  const slider = document.querySelector('.aud-services-slider');
  if (!slider || slider.dataset.sanitySynced === 'true') return;

  try {
    const services = (await audaciousFetchHomeServices()).filter((service) => service && service.slug && service.title);
    if (!services.length) return;

    slider.dataset.sanitySynced = 'true';
    slider.innerHTML = `
      <div class="aud-services-sticky">
        <div class="aud-services-track">
          ${services.map((service, index) => audaciousRenderServiceSlide(service, index, services.length)).join('')}
        </div>
        <div class="aud-service-controls" aria-label="Slider controls"><button class="aud-service-control" type="button" data-direction="prev" aria-label="Vorige service">←</button><button class="aud-service-control" type="button" data-direction="next" aria-label="Volgende service">→</button></div>
      </div>
    `;

    if (typeof window.initServiceSlider === 'function') window.initServiceSlider();
  } catch (error) {
    console.warn('Sanity werkzaamheden konden niet geladen worden. Fallback slider blijft actief.', error);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  audaciousApplyHomeServicesFromSanity();
  window.setTimeout(audaciousApplyHomeServicesFromSanity, 800);
  window.setTimeout(audaciousApplyHomeServicesFromSanity, 1800);
});
window.addEventListener('load', () => window.setTimeout(audaciousApplyHomeServicesFromSanity, 400));
