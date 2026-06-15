const SANITY_IMAGE_PROJECT_ID = 'wehjzlhm';
const SANITY_IMAGE_DATASET = 'production';
const SANITY_IMAGE_API_VERSION = '2026-06-12';

function applyHeroImage(url) {
  if (!url) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  hero.style.background = `linear-gradient(90deg, rgba(7, 7, 6, 0.86) 0%, rgba(8, 8, 7, 0.76) 31%, rgba(8, 8, 7, 0.47) 52%, rgba(8, 8, 7, 0.10) 78%, rgba(8, 8, 7, 0.28) 100%), url('${url}') 61% center / cover no-repeat`;
}

async function fetchHomepageHeroImage() {
  const query = `*[_type == "homePage"][0]{"heroImageUrl": hero.image.asset->url}`;
  const endpoint = `https://${SANITY_IMAGE_PROJECT_ID}.api.sanity.io/v${SANITY_IMAGE_API_VERSION}/data/query/${SANITY_IMAGE_DATASET}?query=${encodeURIComponent(query)}`;
  const response = await fetch(endpoint);

  if (!response.ok) throw new Error(`Sanity image request failed: ${response.status}`);

  const data = await response.json();
  return data?.result?.heroImageUrl;
}

async function initSanityHeroImage() {
  try {
    const imageUrl = await fetchHomepageHeroImage();
    applyHeroImage(imageUrl);
  } catch (error) {
    console.warn('Sanity hero-afbeelding kon niet geladen worden. Fallback afbeelding blijft actief.', error);
  }
}

window.addEventListener('DOMContentLoaded', initSanityHeroImage);
window.addEventListener('load', initSanityHeroImage);
