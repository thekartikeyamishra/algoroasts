'use client';

import { AdUnit } from './AdUnit';
import { AD_SLOTS } from './slots';

/** High-yield in-article fluid unit. Place after the Answer Block and mid-content. */
export function InArticleAd({ slot = AD_SLOTS.inArticleMid }: { slot?: string }) {
  return (
    <AdUnit
      slot={slot}
      format="fluid"
      layout="in-article"
      responsive={false}
      style={{ textAlign: 'center' }}
    />
  );
}

/** Responsive in-feed unit for the blog index between cards. */
export function InFeedAd({ slot = AD_SLOTS.inFeed }: { slot?: string }) {
  return <AdUnit slot={slot} format="fluid" layout="in-feed" responsive={false} />;
}

/** Standard responsive display unit (sidebar / footer). */
export function DisplayAd({ slot = AD_SLOTS.sidebar }: { slot?: string }) {
  return <AdUnit slot={slot} format="auto" />;
}
