import type { MetadataRoute } from 'next';
import { SITE, CATEGORIES, categoryHref } from '@/lib/site';
import { getAllPosts } from '@/lib/content';
import { TOOLS } from '@/lib/tools';

/**
 * /sitemap.xml generated from real content. lastModified reflects actual content dates
 * (not the build time), so Google can trust it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const newest = posts.reduce<Date>((max, p) => {
    const d = new Date(p.frontmatter.updated ?? p.frontmatter.date);
    return d > max ? d : max;
  }, new Date('2026-05-17'));
  const legal = new Date(SITE.legalUpdated);
  const site = new Date(Math.max(newest.getTime(), legal.getTime()));

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: site, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/tools`, lastModified: legal, changeFrequency: 'monthly', priority: 0.9 },
    ...TOOLS.map((t) => ({ url: `${SITE.url}/tools/${t.slug}`, lastModified: legal, changeFrequency: 'monthly' as const, priority: 0.9 })),
    { url: `${SITE.url}/blog`, lastModified: newest, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/invite`, lastModified: legal, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE.url}/about`, lastModified: legal, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE.url}/editorial-policy`, lastModified: legal, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE.url}/contact`, lastModified: legal, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE.url}/privacy`, lastModified: legal, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE.url}/terms`, lastModified: legal, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE.url}/disclaimer`, lastModified: legal, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE.url}${categoryHref(c.slug)}`,
    lastModified: newest,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.updated ?? post.frontmatter.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}
