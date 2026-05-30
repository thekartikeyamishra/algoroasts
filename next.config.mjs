/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Fonts are loaded via <link> in app/layout.tsx (build-safe, no build-time fetch).
  // Disable Next's automatic remote-font optimization so it doesn't try (and warn)
  // about minifying the external Google Fonts stylesheet.
  optimizeFonts: false,
  // Canonical host is the apex domain (algoroasts.com). Redirect www -> apex.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.algoroasts.com" }],
        destination: "https://algoroasts.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
