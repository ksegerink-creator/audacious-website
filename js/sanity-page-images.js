const AUDACIOUS_PAGE_IMAGE_PROJECT_ID = 'wehjzlhm';
const AUDACIOUS_PAGE_IMAGE_DATASET = 'production';
const AUDACIOUS_PAGE_IMAGE_API_VERSION = '2025-02-19';

function audaciousCurrentSlug() {
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  if (pathname === '/' || pathname.endsWith('/index.html')) return 'index';
  const file = pathname.split('/').pop() || '';
  return file.replace(/\.html$/, '');
}

function audaciousSanityImageUrl(url, width = 2200) {
  if (!url) return '';
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}auto=format&fit=crop&w=${width}&q=88`;
}

function audaciousSetPageHeroImage(url) {
  if (!url) return false;
  const imageUrl = audaciousSanityImageUrl(url, 2400);
  const cssValue = `url('${imageUrl}')`;
  document.documentElement.style.setProperty('--page-image', cssValue);
  document.querySelectorAll('.page-hero, .page-hero-media').forEach((element) => {
    element.style.setProperty('--page-image', cssValue);
    element.dataset.sanityHeroImage = imageUrl;
  });
  document.querySelector('.page-hero')?.classList.add('has-sanity-hero-image');
  document.querySelector('.page-hero-media')?.classList.add('has-sanity-hero-image');
  return true;
}

async function audaciousFetchPageImage(slug) {
  const query = `{
    "page": *[_type == "page" && slug.current == $slug][0]{hero{"imageUrl": image.asset->url}, "imageUrl": image.asset->url, "heroImageUrl": heroImage.asset->url, "featuredImageUrl": featuredImage.asset->url},
    "service": *[_type == "service" && slug.current == $slug][0]{"heroImageUrl": heroImage.asset->url, hero{"imageUrl": image.asset->url}},
    "market": *[_type == "market" && slug.current == $slug][0]{"imageUrl": image.asset->url, hero{"imageUrl": image.asset->url}},
    "news": *[_type == "blogPost" && slug.current == $slug][0]{"featuredImageUrl": featuredImage.asset->url, hero{"imageUrl": image.asset->url}}
  }`;
  const endpoint = `https://${AUDACIOUS_PAGE_IMAGE_PROJECT_ID}.api.sanity.io/v${AUDACIOUS_PAGE_IMAGE_API_VERSION}/data/query/${AUDACIOUS_PAGE_IMAGE_DATASET}?query=${encodeURIComponent(query)}&$slug=${encodeURIComponent(JSON.stringify(slug))}`;
  const response = await fetch(endpoint, {cache: 'no-store'});
  if (!response.ok) throw new Error(`Sanity image request failed: ${response.status}`);
  return (await response.json())?.result || null;
}

async function audaciousInitPageImages() {
  const hasSubpageHero = Boolean(document.querySelector('.page-hero'));
  if (!hasSubpageHero) return;

  try {
    const slug = audaciousCurrentSlug();
    const result = await audaciousFetchPageImage(slug);
    const doc = result?.page || result?.service || result?.market || result?.news;
    const imageUrl = doc?.hero?.imageUrl || doc?.heroImageUrl || doc?.imageUrl || doc?.featuredImageUrl;
    if (imageUrl) audaciousSetPageHeroImage(imageUrl);
  } catch (error) {
    console.warn('Sanity hero-afbeelding kon niet geladen worden. Fallback afbeelding blijft actief.', error);
  }
}

window.addEventListener('DOMContentLoaded', audaciousInitPageImages);
window.addEventListener('load', audaciousInitPageImages);
window.audaciousInitPageImages = audaciousInitPageImages;
