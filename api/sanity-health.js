const PROJECT_ID = 'wehjzlhm';
const DATASET = 'production';
const API_VERSION = '2025-02-19';

export default async function handler(req, res) {
  try {
    const query = `{
      "home": *[_type == "homePage"][0]{
        "heroImageUrl": hero.image.asset->url,
        "heroVideoFileUrl": hero.videoFile.asset->url,
        "heroVideoUrl": hero.videoUrl,
        "serviceImages": featuredServices[]->{title, "imageUrl": coalesce(hero.image.asset->url, heroImage.asset->url)},
        "marketImages": featuredMarkets[]->{title, "imageUrl": image.asset->url},
        "productImages": featuredProductGroups[]->{title, "imageUrl": image.asset->url},
        "projectCards": projectCards[]{title, "imageUrl": link.internalPage->hero.image.asset->url}
      },
      "serviceWithImages": count(*[_type == "service" && (defined(hero.image.asset) || defined(heroImage.asset))]),
      "pageWithImages": count(*[_type == "page" && defined(hero.image.asset)]),
      "marketWithImages": count(*[_type == "market" && defined(image.asset)]),
      "productWithImages": count(*[_type == "productGroup" && defined(image.asset)])
    }`;
    const url = new URL(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`);
    url.searchParams.set('query', query);
    const response = await fetch(url);
    const body = await response.text();
    res.statusCode = response.status;
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    res.end(body);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.end(JSON.stringify({error:String(error?.message || error)}));
  }
}
