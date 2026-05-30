import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#F8FAFC',
    theme_color: SITE.themeColor,
    icons: [
      { src: '/og/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/og/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
