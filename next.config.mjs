/** @type {import('next').NextConfig} */

// Keep in sync with LEGACY_REDIRECTS in lib/site.ts (next.config cannot import TS).
const legacyRedirects = [
  ['/blog/toronto-vancouver-tech-2026', '/blog/toronto-vs-vancouver-tech-2026'],
  ['/category/roadmaps', '/roadmaps'],
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Fonts are loaded via <link> in app/layout.tsx (build-safe, no build-time fetch).
  optimizeFonts: false,
  async redirects() {
    return [
      // Canonical host is the apex domain (algoroasts.com). Redirect www -> apex.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.algoroasts.com' }],
        destination: 'https://algoroasts.com/:path*',
        permanent: true,
      },
      ...legacyRedirects.map(([source, destination]) => ({ source, destination, permanent: true })),
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Long-lived caching for fingerprinted/static assets.
        source: '/:file(favicon.ico|favicon.svg|favicon-16.png|favicon-32.png|favicon-48.png|apple-touch-icon.png)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
      },
      {
        source: '/ads.txt',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }],
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
