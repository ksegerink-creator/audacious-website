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

function audaciousEnsureGalleryStyles() {
  if (document.getElementById('audacious-project-gallery-styles')) return;
  const style = document.createElement('style');
  style.id = 'audacious-project-gallery-styles';
  style.textContent = `
    .project-gallery-section{padding:clamp(4rem,7vw,7rem) 0;background:#f8f6f2;color:#11110f;border-top:1px solid rgba(17,17,15,.08);}
    .project-gallery-head{display:block;margin-bottom:clamp(2rem,4vw,3rem);}
    .project-gallery-kicker{margin:0 0 .8rem;color:#f58220;font-family:'Courier New',monospace;font-size:.78rem;font-weight:800;letter-spacing:.13em;text-transform:uppercase;}
    .project-gallery-title{max-width:760px;margin:0;font-family:var(--font-display);font-size:clamp(3rem,6vw,6.5rem);line-height:.9;letter-spacing:-.08em;color:#11110f;}
    .project-gallery-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:rgba(17,17,15,.16);border:1px solid rgba(17,17,15,.16);}
    .project-gallery-item{position:relative;min-height:clamp(260px,32vw,520px);overflow:hidden;background:#11110f;}
    .project-gallery-item:first-child{grid-column:span 2;}
    .project-gallery-item img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.96) contrast(1.04);transition:transform .35s ease,filter .35s ease;}
    .project-gallery-item:hover img{transform:scale(1.035);filter:saturate(1.04) contrast(1.06);}
    .project-gallery-caption{position:absolute;left:1rem;right:1rem;bottom:1rem;display:flex;justify-content:space-between;gap:1rem;padding:.8rem 1rem;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(0,0,0,.42);backdrop-filter:blur(14px);color:#fff;font-size:.82rem;font-weight:700;}
    @media(max-width:900px){.project-gallery-grid{grid-template-columns:1fr}.project-gallery-item:first-child{grid-column:auto}.project-gallery-item{min-height:280px}}
  `;
  document.head.appendChild(style);
}

function audaciousRenderPageGallery(images = []) {
  const validImages = images.filter((image) => image && image.url);
  if (!validImages.length || document.querySelector('.project-gallery-section')) return;

  const main = document.querySelector('.page-shell');
  if (!main) return;

  audaciousEnsureGalleryStyles();

  const section = document.createElement('section');
  section.className = 'project-gallery-section';
  section.innerHTML = `
    <div class="container">
      <div class="project-gallery-head">
        <p class="project-gallery-kicker">Projectfoto’s</p>
        <h2 class="project-gallery-title">Beeld van het project.</h2>
      </div>
      <div class="project-gallery-grid">
        ${validImages.map((image, index) => {
          const src = audaciousSanityImageUrl(image.url, index === 0 ? 1800 : 1100);
          const alt = image.alt || image.caption || 'Projectfoto Audacious';
          const caption = image.caption || `Foto ${String(index + 1).padStart(2, '0')}`;
          return `<figure class="project-gallery-item"><img src="${src}" alt="${alt}" loading="lazy"><figcaption class="project-gallery-caption"><span>${caption}</span><span>${String(index + 1).padStart(2, '0')}</span></figcaption></figure>`;
        }).join('')}
      </div>
    </div>
  `;

  const sections = main.querySelectorAll('.page-section');
  const anchor = sections[0] || main.lastElementChild;
  if (anchor) anchor.insertAdjacentElement('afterend', section);
  else main.appendChild(section);
}

async function audaciousFetchPageImage(slug) {
  const query = `{
    "page": *[_type == "page" && slug.current == $slug][0]{
      "imageUrl": hero.image.asset->url,
      "gallery": galleryImages[]{"url": asset->url, alt, caption}
    },
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
    if (imageUrl) {
      audaciousSetPageHeroImage(imageUrl);
      console.info(`Sanity hero-afbeelding toegepast voor ${slug}:`, imageUrl);
    } else {
      console.info(`Geen Sanity-afbeelding gevonden voor slug: ${slug}. Fallback afbeelding blijft actief.`);
    }

    audaciousRenderPageGallery(result?.page?.gallery || []);
  } catch (error) {
    console.warn('Sanity pagina-afbeelding kon niet geladen worden. Fallback afbeelding blijft actief.', error);
  }
}

window.addEventListener('DOMContentLoaded', audaciousInitPageImages);
window.addEventListener('load', audaciousInitPageImages);
window.audaciousInitPageImages = audaciousInitPageImages;