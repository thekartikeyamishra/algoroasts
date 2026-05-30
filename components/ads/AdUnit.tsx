'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SITE } from '@/lib/site';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdUnitProps {
  /** The ad slot ID from your AdSense dashboard (data-ad-slot). */
  slot: string;
  /** Layout format. "auto" = responsive display; "fluid" = in-article/in-feed. */
  format?: 'auto' | 'fluid' | 'autorelaxed';
  layout?: string;
  layoutKey?: string;
  responsive?: boolean;
  className?: string;
  /** Optional label shown above the ad (transparency improves trust + CTR). */
  label?: string;
  style?: React.CSSProperties;
}

/**
 * Single AdSense slot. Safe to render many per page.
 *
 * Why a ref + try/catch: AdSense throws if `push({})` runs before the script
 * loads or if a slot is pushed twice (common on client navigation). We guard
 * both. `key={pathname}` on the parent forces a fresh mount per route so the
 * SPA-style navigation in Next.js still fills slots correctly.
 */
export function AdUnit({
  slot,
  format = 'auto',
  layout,
  layoutKey,
  responsive = true,
  className,
  label = 'Advertisement',
  style,
}: AdUnitProps) {
  const pathname = usePathname();
  const pushed = useRef(false);

  useEffect(() => {
    pushed.current = false;
  }, [pathname]);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // Script not ready yet or slot already filled — silently ignore.
    }
  });

  return (
    <div className={cn('not-prose my-8 text-center', className)} key={pathname}>
      {label && (
        <span className="mb-1 block text-[11px] font-medium uppercase tracking-widest text-slate-400">
          {label}
        </span>
      )}
      <ins
        className="adsbygoogle block"
        style={{ display: 'block', ...style }}
        data-ad-client={SITE.adsenseClient}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layout && { 'data-ad-layout': layout })}
        {...(layoutKey && { 'data-ad-layout-key': layoutKey })}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
