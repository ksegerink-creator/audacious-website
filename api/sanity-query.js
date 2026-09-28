const PROJECT_ID = 'wehjzlhm';
const DEFAULT_DATASET = 'production';
const DEFAULT_API_VERSION = '2025-02-19';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET' && req.query?.health === '1') {
      const query = `{
        "home": *[_type == "homePage"][0]{
          "heroImageUrl": hero.image.asset->url,
          "heroVideoFileUrl": hero.videoFile.asset->url,
          "heroVideoUrl": hero.videoUrl,
          "services": featuredServices[]->{"imageUrl": heroImage.asset->url},
          "markets": featuredMarkets[]->{"imageUrl": image.asset->url},
          "products": featuredProductGroups[]->{"imageUrl": image.asset->url},
          "projectCards": projectCards[]{"imageUrl": link.internalPage->hero.image.asset->url}
        },
        "serviceCount": count(*[_type == "service" && defined(heroImage.asset)]),
        "pageImageCount": count(*[_type == "page" && defined(hero.image.asset)])
      }`;
      const endpoint = new URL(`https://${PROJECT_ID}.api.sanity.io/v${DEFAULT_API_VERSION}/data/query/${DEFAULT_DATASET}`);
      endpoint.searchParams.set('query', query);
      const response = await fetch(endpoint.toString(), {headers: {Accept: 'application/json'}});
      const body = await response.text();
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      return res.status(response.status).send(body);
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST, GET');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { query, params = {}, dataset = DEFAULT_DATASET, apiVersion = DEFAULT_API_VERSION } = req.body || {};

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Missing Sanity query' });
    }

    const safeDataset = /^[a-zA-Z0-9_-]+$/.test(dataset) ? dataset : DEFAULT_DATASET;
    const safeApiVersion = /^\d{4}-\d{2}-\d{2}$/.test(apiVersion) ? apiVersion : DEFAULT_API_VERSION;
    const endpoint = new URL(`https://${PROJECT_ID}.api.sanity.io/v${safeApiVersion}/data/query/${safeDataset}`);
    endpoint.searchParams.set('query', query);

    Object.entries(params || {}).forEach(([key, value]) => {
      if (!/^[a-zA-Z0-9_]+$/.test(key)) return;
      endpoint.searchParams.set(`$${key}`, JSON.stringify(value));
    });

    const response = await fetch(endpoint.toString(), {
      headers: { Accept: 'application/json' }
    });

    const body = await response.text();
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(response.status).send(body);
  } catch (error) {
    console.error('Sanity proxy failed:', error);
    return res.status(500).json({ error: 'Sanity proxy failed' });
  }
}
