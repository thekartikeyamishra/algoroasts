/**
 * SINGLE SOURCE OF TRUTH for all site-wide constants.
 * Every component, metadata helper, sitemap, and schema generator reads from here.
 * Change a value once → it propagates everywhere. Never hard-code these elsewhere.
 */

export const SITE = {
  name: 'Algoroasts',
  // Canonical apex domain. No trailing slash. www redirects here (see next.config.mjs).
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://algoroasts.com').replace(/\/$/, ''),
  tagline: 'We don’t tell you what exists. We tell you what to do next.',
  description:
    'Algoroasts is a Developer Decision Intelligence Platform. We synthesize real market data, salary trends, and visual skill roadmaps into one clear directive: what to do next.',
  // Organization / publisher identity used in JSON-LD.
  publisher: {
    name: 'Algoroasts',
    logo: '/og/logo.png',
  },
  author: {
    name: 'Algoroasts Editorial',
    url: '/about',
  },
  social: {
    x: 'https://x.com/kartikeyahere',
    linkedin: 'https://www.linkedin.com/in/thekartikeyamishra',
    github: 'https://github.com',
  },
  // Google AdSense publisher ID. Used by the AdSense loader and /ads.txt.
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-4557897331416844',
  locale: 'en_US',
  themeColor: '#4F46E5',
} as const;

/**
 * Content taxonomy. Categories double as topic-cluster pillars for SEO/GEO.
 * Each pillar should have one comprehensive pillar page + 15-30 interlinked subpages.
 */
export const CATEGORIES = [
  {
    slug: 'careers',
    name: 'Careers & Compensation',
    description: 'Salary data, market demand, and decision-grade career directives for developers.',
  },
  {
    slug: 'ai-engineering',
    name: 'AI Engineering',
    description: 'Orchestration, RAG, agents, and the skills the market is actively rewarding.',
  },
  {
    slug: 'roadmaps',
    name: 'Skill Roadmaps',
    description: 'Visual, data-backed learning paths that tell you exactly what to learn next.',
  },
  {
    slug: 'market-intelligence',
    name: 'Market Intelligence',
    description: 'Hiring trends, technology demand shifts, and proprietary demand indices.',
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

export const NAV_LINKS = [
  { href: '/blog', label: 'Intelligence' },
  { href: '/roadmaps', label: 'Roadmaps' },
  { href: '/about', label: 'About' },
] as const;

export function absoluteUrl(path = ''): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${clean === '/' ? '' : clean}`;
}
