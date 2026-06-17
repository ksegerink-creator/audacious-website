const SANITY_IMAGE_PROJECT_ID = 'wehjzlhm';
const SANITY_IMAGE_DATASET = 'production';
const SANITY_IMAGE_API_VERSION = '2025-02-19';

function withImageParams(url, width = 2400) {
  if (!url) return '';
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}auto=format&fit=crop&w=${width}&q=85`;
}

function setBackground(element, url, options = {}) {
  if (!element || !url) return false;

  const imageUrl = withImageParams(url, options.width || 1800);
  const position = options.position || 'center center';
  const overlay = options.overlay || '';
  const background = `${overlay ? `${overlay}, ` : ''}url('${imageUrl}') ${position} / cover no-repeat`;

  element.style.setProperty('background', background, 'important');
  element.dataset.sanityImage = imageUrl;
  return true;
}

function applyHeroImage(url) {
  const hero = document.querySelector('.hero');
  const overlay = 'linear-gradient(90deg, rgba(7, 7, 6, 0.86) 0%, rgba(8, 8, 7, 0.76) 31%, rgba(8, 8, 7, 0.47) 52%, rgba(8, 8, 7, 0.10) 78%, rgba(8, 8, 7, 0.28) 100%)';
  const applied = setBackground(hero, url, {width: 2400, position: '61% center', overlay});
  if (applied) console.info('Sanity hero-afbeelding geladen:', hero.dataset.sanityImage);
  return applied;
}

function applyHeroVideo(videoUrl, posterUrl) {
  const hero = document.querySelector('.hero');
  if (!hero || !videoUrl) return false;

  hero.classList.add('has-hero-video');

  let video = hero.querySelector('.home-hero-video');
  if (!video) {
    video = document.createElement('video');
    video.className = 'home-hero-video';
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.setAttribute('aria-hidden', 'true');
    hero.insertBefore(video, hero.firstChild);
  }

  if (posterUrl) video.poster = withImageParams(posterUrl, 1800);
  if (video.getAttribute('src') !== videoUrl) {
    video.setAttribute('src', videoUrl);
    video.load();
  }

  video.play().catch(() => {
    console.info('Hero video kon niet automatisch afspelen. Poster/fallback blijft zichtbaar.');
  });

  console.info('Sanity hero-video geladen:', videoUrl);
  return true;
}

function applyServiceImages(services) {
  if (!services?.length) return;

  document.querySelectorAll('.aud-service-slide').forEach((slide, index) => {
    const url = services[index]?.imageUrl;
    if (!url) return;
    const imageUrl = withImageParams(url, 2200);
    slide.style.setProperty('--slide-bg', `url('${imageUrl}')`);
    slide.dataset.sanityImage = imageUrl;
  });
}

function applyMarketImages(markets) {
  if (!markets?.length) return;

  document.querySelectorAll('.market-card').forEach((card, index) => {
    const url = markets[index]?.imageUrl;
    if (!url) return;
    const overlay = 'linear-gradient(180deg, rgba(17,17,15,0.10), rgba(17,17,15,0.72))';
    setBackground(card, url, {width: 1400, overlay});
    card.classList.add('has-sanity-image');
  });
}

function applyProductImages(productGroups) {
  if (!productGroups?.length) return;

  document.querySelectorAll('.product-tile').forEach((tile, index) => {
    const url = productGroups[index]?.imageUrl;
    const visual = tile.querySelector('.product-visual');
    if (!url || !visual) return;
    const overlay = 'linear-gradient(180deg, rgba(17,17,15,0.05), rgba(17,17,15,0.52))';
    setBackground(visual, url, {width: 1200, overlay});
    visual.classList.add('has-sanity-image');
  });
}

function applyMaterialImages(materials) {
  if (!materials?.length) return;

  document.querySelectorAll('.material-card').forEach((card, index) => {
    const url = materials[index]?.imageUrl;
    const visual = card.querySelector('.material-card-visual');
    if (!url || !visual) return;
    setBackground(visual, url, {width: 1200});
    visual.classList.add('has-sanity-image');
  });
}

function applyNewsImages(posts) {
  if (!posts?.length) return;

  document.querySelectorAll('.blog-card, .blog-featured-card, .post-card').forEach((card, index) => {
    const url = posts[index]?.imageUrl;
    if (!url) return;
    const imageTarget = card.querySelector('.blog-card-media, .blog-featured-image, .post-card-image') || card;
    setBackground(imageTarget, url, {width: 1400});
    imageTarget.classList.add('has-sanity-image');
  });
}

async function fetchSanityImages() {
  const query = `{
    "home": *[_type == "homePage"][0]{
      "heroImageUrl": hero.image.asset->url,
      "heroVideoFileUrl": hero.videoFile.asset->url,
      "heroVideoUrl": hero.videoUrl,
      "heroVideoPosterUrl": hero.videoPoster.asset->url,
      "hasHeroImage": defined(hero.image.asset),
      "hasHeroVideoFile": defined(hero.videoFile.asset),
      "hasHeroVideoUrl": defined(hero.videoUrl),
      "services": featuredServices[]->{"imageUrl": heroImage.asset->url},
      "markets": featuredMarkets[]->{"imageUrl": image.asset->url},
      "products": featuredProductGroups[]->{"imageUrl": image.asset->url}
    },
    "posts": *[_type == "blogPost"] | order(publishedAt desc){"imageUrl": featuredImage.asset->url}
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

async function initSanityImages() {
  try {
    const result = await fetchSanityImages();
    const home = result?.home || {};
    const videoUrl = home.heroVideoFileUrl || home.heroVideoUrl;

    if (videoUrl) {
      applyHeroVideo(videoUrl, home.heroVideoPosterUrl || home.heroImageUrl);
    } else if (home.hasHeroImage && home.heroImageUrl) {
      applyHeroImage(home.heroImageUrl);
    } else {
      console.warn('Geen gepubliceerde hero-video of hero-afbeelding gevonden in Sanity. Controleer Homepage > Hero en klik Publish.', home);
    }

    applyServiceImages(home.services || []);
    applyMarketImages(home.markets || []);
    applyProductImages(home.products || []);
    applyNewsImages(result?.posts || []);
  } catch (error) {
    console.warn('Sanity-afbeeldingen konden niet geladen worden. Fallback afbeeldingen blijven actief.', error);
  }
}

function loadAudaciousCopyOverrides() {
  if (document.querySelector('script[data-audacious-copy]')) return;
  const script = document.createElement('script');
  script.src = '../js/audacious-copy.js';
  script.defer = true;
  script.dataset.audaciousCopy = 'true';
  document.body.appendChild(script);
}

window.addEventListener('DOMContentLoaded', () => {
  initSanityImages();
  loadAudaciousCopyOverrides();
});
window.addEventListener('load', () => {
  initSanityImages();
  loadAudaciousCopyOverrides();
});
window.initSanityHeroImage = initSanityImages;
window.initSanityImages = initSanityImages;