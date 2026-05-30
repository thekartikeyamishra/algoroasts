import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/**
 * Generates /robots.txt. Explicitly welcomes AI/GEO crawlers (GPTBot, PerplexityBot,
 * ClaudeBot, Google-Extended) — being citeable by generative engines is the whole strategy.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      // Generative engine crawlers — explicitly allowed so we get cited.
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
