import { SITE, absoluteUrl } from './site';
import type { Post } from './content';

/**
 * Structured data (JSON-LD). Search engines and AI answer engines parse these blocks to
 * understand entities (who publishes this, who is accountable, what a page is). Every page
 * emits the relevant schema via the <JsonLd> component. Only describe what is really on the page.
 */

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: { '@type': 'ImageObject', url: absoluteUrl(SITE.publisher.logo), width: 512, height: 512 },
    description: SITE.description,
    email: SITE.contact.email,
    founder: { '@id': `${SITE.url}/#founder` },
    sameAs: [SITE.social.x, SITE.social.linkedin, SITE.social.github],
  };
}

export function founderSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE.url}/#founder`,
    name: SITE.founder.name,
    jobTitle: SITE.founder.role,
    url: absoluteUrl('/about'),
    worksFor: { '@id': `${SITE.url}/#organization` },
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
    inLanguage: 'en',
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
    '@id': `${url}#article`,
    headline: frontmatter.title,
    description: frontmatter.description,
    image: absoluteUrl(`/blog/${slug}/opengraph-image`),
    datePublished: new Date(frontmatter.date).toISOString(),
    dateModified: new Date(frontmatter.updated ?? frontmatter.date).toISOString(),
    inLanguage: 'en',
    wordCount: post.wordCount,
    keywords: frontmatter.tags?.join(', '),
    author: {
      '@type': 'Organization',
      name: frontmatter.author ?? SITE.author.name,
      url: absoluteUrl(SITE.author.url),
    },
    editor: { '@id': `${SITE.url}/#founder` },
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

/** FAQ schema. Only use it where the same Q&A is visible on the page. */
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

/** A free, in-browser calculator. */
export function webApplicationSchema(args: { name: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: args.name,
    description: args.description,
    url: absoluteUrl(args.path),
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any (runs in the browser)',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

/** Collection pages (blog index, categories, tools index). */
export function collectionSchema(args: { name: string; description: string; path: string; items: { name: string; path: string }[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: args.name,
    description: args.description,
    url: absoluteUrl(args.path),
    isPartOf: { '@id': `${SITE.url}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: args.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}
