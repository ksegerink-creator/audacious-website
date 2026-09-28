const PROJECT_ID = 'wehjzlhm';
const DEFAULT_DATASET = 'production';
const DEFAULT_API_VERSION = '2025-02-19';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
