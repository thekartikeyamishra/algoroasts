import { SITE, absoluteUrl } from './site';
import type { Post } from './content';

/**
 * Structured data (JSON-LD) is the single highest-leverage GEO signal.
 * Generative engines (Perplexity, ChatGPT, Google AI Overviews) parse these
 * blocks to extract entities, facts, and trust vectors. Every page emits the
 * relevant schema via the <JsonLd> component.
 */

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl(SITE.publisher.logo),
    description: SITE.description,
    sameAs: [SITE.social.x, SITE.social.linkedin, SITE.social.github],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    publisher: { '@id': `${SITE.url}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/blog?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function articleSchema(post: Post) {
  const { frontmatter, slug } = post;
  const url = absoluteUrl(`/blog/${slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}/#article`,
    headline: frontmatter.title,
    description: frontmatter.description,
    image: absoluteUrl(frontmatter.image ?? '/og/default.png'),
    datePublished: new Date(frontmatter.date).toISOString(),
    dateModified: new Date(frontmatter.updated ?? frontmatter.date).toISOString(),
    author: { '@type': 'Organization', name: frontmatter.author ?? SITE.author.name, url: SITE.url },
    publisher: { '@id': `${SITE.url}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    isAccessibleForFree: true,
    ...(frontmatter.sources?.length && {
      citation: frontmatter.sources.map((s) => ({ '@type': 'CreativeWork', name: s.label, url: s.url })),
    }),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** FAQ schema dramatically improves AI citation rates. Use on every pillar/article that answers questions. */
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
