import type { Metadata, Viewport } from 'next';
// Self-hosted fonts (bundled + served from our own domain: no third-party request, no render-blocking CSS).
import '@fontsource-variable/plus-jakarta-sans/wght.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import './globals.css';
import { SITE } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';
import { organizationSchema, websiteSchema, founderSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { HookProvider } from '@/components/hook/HookProvider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { Interactions } from '@/components/fx/Interactions';

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/**
 * No-flash theme script: runs BEFORE first paint to set the `.dark` class from
 * the stored preference (or OS setting). Prevents a light→dark flash on load.
 */
const themeScript = `
(function(){try{
  var k='algoroasts:theme';
  var m=localStorage.getItem(k);
  var dark = m==='dark' || ((!m || m==='system') && matchMedia('(prefers-color-scheme: dark)').matches);
  if(dark){document.documentElement.classList.add('dark');}
}catch(e){}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Google AdSense — the exact snippet AdSense issued. Async: never blocks rendering. */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsenseClient}`}
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <JsonLd data={[organizationSchema(), founderSchema(), websiteSchema()]} />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <HookProvider>
            <Navbar />
            <main id="main" className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            <MobileNav />
            <ScrollToTop />
            <OnboardingTour />
            <Interactions />
          </HookProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
