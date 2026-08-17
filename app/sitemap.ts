import { MetadataRoute } from 'next';
import { tools } from '@/data/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://100devtoolshub.com';

  const toolEntries: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${baseUrl}/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...toolEntries,
  ];
}