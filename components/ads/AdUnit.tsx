'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SITE } from '@/lib/site';
import { cn } from '@/lib/utils';
import { AD_FREE_PATHS } from './slots';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdUnitProps {
  /** The ad slot ID from your AdSense dashboard (data-ad-slot). Empty → renders nothing. */
  slot: string;
  format?: 'auto' | 'fluid' | 'autorelaxed';
  layout?: string;
  layoutKey?: string;
  responsive?: boolean;
  className?: string;
  /** Reserved height (px) so the ad never pushes content around (CLS). */
  minHeight?: number;
  style?: React.CSSProperties;
}

/**
 * One manual AdSense slot.
 *  - Renders nothing without a real slot ID or on ad-free routes.
 *  - Reserves space up front → no layout shift.
 *  - Pushes once per mount; the wrapper is keyed by route so client navigation refills it.
 *  - Clearly labelled "Advertisement" (allowed by AdSense; improves trust).
 */
export function AdUnit({
  slot,
  format = 'auto',
  layout,
  layoutKey,
  responsive = true,
  className,
  minHeight = 280,
  style,
}: AdUnitProps) {
  const pathname = usePathname();
  const insRef = useRef<HTMLModElement>(null);
  const disabled = !slot || AD_FREE_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (disabled) return;
    const el = insRef.current;
    if (!el || el.getAttribute('data-adsbygoogle-status')) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Script blocked or not ready — fail silently; the reserved space just stays empty.
    }
  }, [disabled, pathname]);

  if (disabled) return null;

  return (
    <aside
      key={pathname}
      className={cn('not-prose mx-auto my-10 w-full max-w-3xl', className)}
      aria-label="Advertisement"
    >
      <span className="mb-1.5 block text-center text-[10px] font-medium uppercase tracking-[0.2em] text-faint">
        Advertisement
      </span>
      <div className="overflow-hidden rounded-2xl" style={{ minHeight }}>
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'block', ...style }}
          data-ad-client={SITE.adsenseClient}
          data-ad-slot={slot}
          data-ad-format={format}
          {...(layout && { 'data-ad-layout': layout })}
          {...(layoutKey && { 'data-ad-layout-key': layoutKey })}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </aside>
  );
}
