const SANITY_IMAGE_PROJECT_ID = 'wehjzlhm';
const SANITY_IMAGE_DATASET = 'production';
const SANITY_IMAGE_API_VERSION = '2025-02-19';

function withImageParams(url) {
  if (!url) return '';
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}auto=format&fit=crop&w=2400&q=85`;
}

function applyHeroImage(url) {
  if (!url) return false;

  const hero = document.querySelector('.hero');
  if (!hero) return false;

  const imageUrl = withImageParams(url);
  hero.style.setProperty(
    'background',
    `linear-gradient(90deg, rgba(7, 7, 6, 0.86) 0%, rgba(8, 8, 7, 0.76) 31%, rgba(8, 8, 7, 0.47) 52%, rgba(8, 8, 7, 0.10) 78%, rgba(8, 8, 7, 0.28) 100%), url('${imageUrl}') 61% center / cover no-repeat`,
    'important'
  );

  hero.dataset.sanityHeroImage = imageUrl;
  console.info('Sanity hero-afbeelding geladen:', imageUrl);
  return true;
}

async function fetchHomepageHeroImage() {
  const query = `*[_type == "homePage"][0]{
    "heroImageUrl": hero.image.asset->url,
    "hasHeroImage": defined(hero.image.asset)
  }`;
  const endpoint = `https://${SANITY_IMAGE_PROJECT_ID}.api.sanity.io/v${SANITY_IMAGE_API_VERSION}/data/query/${SANITY_IMAGE_DATASET}?query=${encodeURIComponent(query)}`;
  const response = await fetch(endpoint, {cache: 'no-store'});

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Sanity image request failed: ${response.status} ${details}`);
  }

  const data = await response.json();
  return data?.result || null;
}

async function initSanityHeroImage() {
  try {
    const result = await fetchHomepageHeroImage();

    if (!result?.hasHeroImage || !result?.heroImageUrl) {
      console.warn('Geen gepubliceerde hero-afbeelding gevonden in Sanity. Controleer Homepage > Hero > Afbeelding en klik Publish.', result);
      return;
    }

    applyHeroImage(result.heroImageUrl);
  } catch (error) {
    console.warn('Sanity hero-afbeelding kon niet geladen worden. Fallback afbeelding blijft actief.', error);
  }
}

window.addEventListener('DOMContentLoaded', initSanityHeroImage);
window.addEventListener('load', initSanityHeroImage);
window.initSanityHeroImage = initSanityHeroImage;
