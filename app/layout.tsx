import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { SITE } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { HookProvider } from '@/components/hook/HookProvider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
  width: 'device-width',
  initialScale: 1,
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
        {/* Fonts via <link> (build-safe). CSS vars defined in globals.css. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
        />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        {/* Google AdSense site-level loader — lazy, after interactive. Earns from day one. */}
        <Script
          id="adsbygoogle-init"
          async
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsenseClient}`}
        />
        <ThemeProvider>
          <HookProvider>
            <Navbar />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            <MobileNav />
            <ScrollToTop />
            <OnboardingTour />
          </HookProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
