import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const lastModified = new Date();

  const pages = ['/', '/scan', '/batch', '/templates', '/privacy'];

  return pages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: path === '/' ? 1.0 : 0.8,
    alternates: {
      languages: {
        en: `${baseUrl}${path}?locale=en`,
        ar: `${baseUrl}${path}?locale=ar`,
      },
    },
  }));
}
