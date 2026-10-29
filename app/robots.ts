import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/**
 * /robots.txt — open to search engines and AI answer engines (being cited is the strategy).
 * Only the API is excluded. Google's AdSense crawler (Mediapartners-Google) must never be blocked.
 */
export default function robots(): MetadataRoute.Robots {
  const aiBots = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'PerplexityBot',
    'Perplexity-User',
    'ClaudeBot',
    'Claude-SearchBot',
    'Claude-User',
    'Google-Extended',
    'Applebot-Extended',
    'Bingbot',
    'DuckAssistBot',
    'Meta-ExternalAgent',
    'CCBot',
  ];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      { userAgent: 'Mediapartners-Google', allow: '/' },
      ...aiBots.map((userAgent) => ({ userAgent, allow: '/', disallow: ['/api/'] })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
