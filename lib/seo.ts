import type { Metadata } from 'next';
import { SITE, absoluteUrl } from './site';

interface BuildMetaArgs {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noIndex?: boolean;
}

/**
 * Centralized metadata builder. Every page calls this so canonical URLs,
 * Open Graph, and Twitter cards stay consistent and correct.
 */
export function buildMetadata({
  title,
  description = SITE.description,
  path = '/',
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  tags,
  noIndex = false,
}: BuildMetaArgs = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} — Developer Decision Intelligence`;
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(image ?? '/og/default.png');

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE.url),
    alternates: { canonical },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    openGraph: {
      type,
      url: canonical,
      title: fullTitle,
      description,
      siteName: SITE.name,
      locale: SITE.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title ?? SITE.name }],
      ...(type === 'article' && { publishedTime, modifiedTime, tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@kartikeyahere',
    },
  };
}
