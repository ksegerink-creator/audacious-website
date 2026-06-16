const AUDACIOUS_PAGE_IMAGE_PROJECT_ID = 'wehjzlhm';
const AUDACIOUS_PAGE_IMAGE_DATASET = 'production';
const AUDACIOUS_PAGE_IMAGE_API_VERSION = '2025-02-19';

function audaciousSanityImageUrl(url, width = 2200) {
  if (!url) return '';
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}auto=format&fit=crop&w=${width}&q=88`;
}

function audaciousSetPageHeroImage(url) {
  if (!url) return false;

  const imageUrl = audaciousSanityImageUrl(url, 2400);
  const escaped = `url('${imageUrl}')`;

  document.documentElement.style.setProperty('--page-image', escaped);

  document.querySelectorAll('.page-hero, .page-hero-media').forEach((element) => {
    element.style.setProperty('--page-image', escaped);
    element.dataset.sanityHeroImage = imageUrl;
  });

  const hero = document.querySelector('.page-hero');
  if (hero) hero.classList.add('has-sanity-hero-image');

  const media = document.querySelector('.page-hero-media');
  if (media) media.classList.add('has-sanity-hero-image');

  return true;
}

function audaciousCurrentSlug() {
  const filename = window.location.pathname.split('/').pop() || 'index.html';
  return filename.replace(/\.html$/, '');
}

async function audaciousFetchPageImage(slug) {
  const query = `{
    "page": *[_type == "page" && slug.current == $slug][0]{"imageUrl": hero.image.asset->url},
    "service": *[_type == "service" && slug.current == $slug][0]{"imageUrl": heroImage.asset->url},
    "market": *[_type == "market" && slug.current == $slug][0]{"imageUrl": image.asset->url},
    "news": *[_type == "blogPost" && slug.current == $slug][0]{"imageUrl": featuredImage.asset->url},
    "home": *[_type == "homePage"][0]{"imageUrl": hero.image.asset->url}
  }`;

  const endpoint = `https://${AUDACIOUS_PAGE_IMAGE_PROJECT_ID}.api.sanity.io/v${AUDACIOUS_PAGE_IMAGE_API_VERSION}/data/query/${AUDACIOUS_PAGE_IMAGE_DATASET}?query=${encodeURIComponent(query)}&$slug=${encodeURIComponent(JSON.stringify(slug))}`;
  const response = await fetch(endpoint, {cache: 'no-store'});
  if (!response.ok) throw new Error(`Sanity page image request failed: ${response.status}`);
  const data = await response.json();
  return data?.result || null;
}

async function audaciousInitPageImages() {
  const slug = audaciousCurrentSlug();
  const hasSubpageHero = Boolean(document.querySelector('.page-hero'));
  if (!hasSubpageHero) return;

  try {
    const result = await audaciousFetchPageImage(slug);
    const candidates = [
      result?.page?.imageUrl,
      result?.service?.imageUrl,
      result?.market?.imageUrl,
      result?.news?.imageUrl,
      slug === 'index' ? result?.home?.imageUrl : null
    ].filter(Boolean);

    const imageUrl = candidates[0];
    if (!imageUrl) {
      console.info(`Geen Sanity-afbeelding gevonden voor slug: ${slug}. Fallback afbeelding blijft actief.`);
      return;
    }

    audaciousSetPageHeroImage(imageUrl);
    console.info(`Sanity hero-afbeelding toegepast voor ${slug}:`, imageUrl);
  } catch (error) {
    console.warn('Sanity pagina-afbeelding kon niet geladen worden. Fallback afbeelding blijft actief.', error);
  }
}

window.addEventListener('DOMContentLoaded', audaciousInitPageImages);
window.addEventListener('load', audaciousInitPageImages);
window.audaciousInitPageImages = audaciousInitPageImages;
