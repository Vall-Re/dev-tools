import type { MetadataRoute } from 'next';

import { tools } from '@/data/tools';

const BASE_URL =
  'https://100devtoolshub.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/tools',
    '/about',
    '/privacy',
    '/terms',
  ];

  const staticEntries: MetadataRoute.Sitemap =
    staticRoutes.map((route) => ({
      url: `${BASE_URL}${route}`,
    }));

  const toolEntries: MetadataRoute.Sitemap =
    tools.map((tool) => ({
      url: `${BASE_URL}/tools/${tool.slug}`,
    }));

  return [
    ...staticEntries,
    ...toolEntries,
  ];
}
