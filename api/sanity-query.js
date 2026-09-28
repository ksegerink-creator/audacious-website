const PROJECT_ID = 'wehjzlhm';
const DEFAULT_DATASET = 'production';
const DEFAULT_API_VERSION = '2025-02-19';

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
};

const sendText = (res, statusCode, body, contentType = 'application/json; charset=utf-8') => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', contentType);
  res.end(body);
};

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
      return sendText(res, response.status, body);
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST, GET');
      return sendJson(res, 405, { error: 'Method not allowed' });
    }

    const { query, params = {}, dataset = DEFAULT_DATASET, apiVersion = DEFAULT_API_VERSION } = req.body || {};

    if (!query || typeof query !== 'string') {
      return sendJson(res, 400, { error: 'Missing Sanity query' });
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
    return sendText(res, response.status, body, response.headers.get('content-type') || 'application/json; charset=utf-8');
  } catch (error) {
    console.error('Sanity proxy failed:', error);
    return sendJson(res, 500, { error: 'Sanity proxy failed' });
  }
}
