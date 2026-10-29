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
    'Algoroasts helps software developers make career decisions with source-cited salary data, contractor-rate math, relocation guides, and free calculators.',
  // Organization / publisher identity used in JSON-LD.
  publisher: {
    name: 'Algoroasts',
    logo: '/og/icon-512.png',
  },
  // The real person accountable for the site (E-E-A-T + legal contact).
  founder: {
    name: 'Kartikeya Mishra',
    role: 'Founder & Editor',
    location: 'Lucknow, India',
  },
  author: {
    name: 'Algoroasts Editorial',
    url: '/about',
  },
  contact: {
    // Create this mailbox (or a forwarder) before going live — every legal page links to it.
    email: 'hello@algoroasts.com',
  },
  social: {
    x: 'https://x.com/kartikeyahere',
    linkedin: 'https://www.linkedin.com/in/thekartikeyamishra',
    github: 'https://github.com/thekartikeyamishra',
  },
  /**
   * Mobile apps. Leave `null` until the store listing is live — the buttons then render as
   * non-clickable "Coming soon" badges. Paste the listing URL here and they become real links.
   */
  apps: {
    playStore: null as string | null, // e.g. 'https://play.google.com/store/apps/details?id=com.algoroasts.app'
    appStore: null as string | null, // e.g. 'https://apps.apple.com/app/id0000000000'
  },
  // Google AdSense publisher ID. Used by the AdSense loader, the verification meta tag and /ads.txt.
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-4557897331416844',
  locale: 'en_US',
  themeColor: '#4F46E5',
  // Date the legal pages were last reviewed. Bump it whenever you edit them.
  legalUpdated: '2026-10-30',
} as const;

/**
 * Content taxonomy. Categories double as topic-cluster pillars for SEO/GEO.
 * `intro` is the pillar copy shown on each category page (unique text, not just a list of links).
 */
export const CATEGORIES = [
  {
    slug: 'careers',
    name: 'Careers & Compensation',
    description: 'Salary data, contractor rates, offers, and relocation decisions for software developers.',
    intro:
      'Compensation decisions are where developers lose the most money without noticing: accepting a contract rate that is really a pay cut, comparing offers on base salary alone, or relocating without pricing the trade-off. These guides start from official data (government labour statistics, tax authorities, immigration departments) and turn it into a decision you can act on. Use the Contract vs Full-Time Calculator alongside them to run your own numbers.',
  },
  {
    slug: 'ai-engineering',
    name: 'AI Engineering',
    description: 'Orchestration, RAG, agents, security, and the skills the market is actively rewarding.',
    intro:
      'AI engineering is moving faster than most learning material can keep up with. This hub covers the practical side: which skills employers ask for, how regulation such as the EU AI Act changes the job, and how to run agents safely. Every guide links to the primary source so you can verify it yourself.',
  },
  {
    slug: 'roadmaps',
    name: 'Skill Roadmaps',
    description: 'Ordered learning paths that tell you what to learn next and why the market rewards it.',
    intro:
      'A roadmap is only useful if it is ordered and opinionated. Each one here tells you what to learn first, what to skip, and which credentials or projects actually move hiring decisions, with links to the official documentation for every step.',
  },
  {
    slug: 'market-intelligence',
    name: 'Market Intelligence',
    description: 'Hiring trends, technology demand shifts, and where developer jobs are moving.',
    intro:
      'Where are developer jobs growing, and where are they shrinking? These briefs track hiring hubs, employer types (startups vs global capability centres), and regional shifts, so you can position yourself before the market moves.',
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

export const NAV_LINKS = [
  { href: '/tools', label: 'Tools' },
  { href: '/blog', label: 'Intelligence' },
  { href: '/roadmaps', label: 'Roadmaps' },
  { href: '/about', label: 'About' },
] as const;

export const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/editorial-policy', label: 'Editorial Policy' },
  { href: '/contact', label: 'Contact' },
] as const;

/** Old or mistyped URLs Google has seen → their canonical replacement (301). */
export const LEGACY_REDIRECTS: { from: string; to: string }[] = [
  { from: '/blog/toronto-vancouver-tech-2026', to: '/blog/toronto-vs-vancouver-tech-2026' },
  { from: '/category/roadmaps', to: '/roadmaps' },
];

/** Canonical URL of a category hub. Roadmaps live at /roadmaps (one URL, no duplicate page). */
export function categoryHref(slug: string): string {
  return slug === 'roadmaps' ? '/roadmaps' : `/category/${slug}`;
}

export function absoluteUrl(path = ''): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${clean === '/' ? '' : clean}`;
}
