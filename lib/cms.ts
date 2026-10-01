import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.join(process.cwd(), 'public', 'cms');

async function readJson<T = any>(...parts: string[]): Promise<T | null> {
  try {
    const file = path.join(root, ...parts);
    return JSON.parse(await fs.readFile(file, 'utf8')) as T;
  } catch {
    return null;
  }
}

async function readCollection<T = any>(directory: string): Promise<Array<T & { slug: string }>> {
  try {
    const dir = path.join(root, directory);
    const names = (await fs.readdir(dir)).filter(name => name.endsWith('.json'));
    const entries = await Promise.all(names.map(async name => {
      const entry = await readJson<T>(directory, name);
      return entry ? ({ ...entry, slug: name.replace(/\.json$/, '') } as T & { slug: string }) : null;
    }));
    return entries.filter(Boolean) as Array<T & { slug: string }>;
  } catch {
    return [];
  }
}

export const cms = {
  homepage: () => readJson('homepage.json'),
  settings: () => readJson('settings.json'),
  navigation: () => readJson('navigation.json'),
  page: (slug: string) => readJson('pages', `${slug}.json`),
  pages: () => readCollection('pages'),
  service: (slug: string) => readJson('services', `${slug}.json`),
  services: () => readCollection('services'),
  market: (slug: string) => readJson('markets', `${slug}.json`),
  markets: () => readCollection('markets'),
  productGroup: (slug: string) => readJson('product-groups', `${slug}.json`),
  productGroups: () => readCollection('product-groups'),
  post: (slug: string) => readJson('posts', `${slug}.json`),
  posts: () => readCollection('posts'),
};
