'use client';

import { AdUnit } from './AdUnit';
import { AD_SLOTS } from './slots';

/** In-article fluid unit. Used after the first section of an article and once mid-body. */
export function InArticleAd({ slot = AD_SLOTS.inArticleMid }: { slot?: string }) {
  return <AdUnit slot={slot} format="fluid" layout="in-article" responsive={false} minHeight={250} style={{ textAlign: 'center' }} />;
}

/** In-feed unit for listings. Needs the layout key AdSense gives you for in-feed units. */
export function InFeedAd({ slot = AD_SLOTS.inFeed }: { slot?: string }) {
  if (!AD_SLOTS.inFeedLayoutKey) return null;
  return <AdUnit slot={slot} format="fluid" layoutKey={AD_SLOTS.inFeedLayoutKey} responsive={false} minHeight={160} />;
}

/** Standard responsive display unit (end of listings / below tool results). */
export function DisplayAd({ slot = AD_SLOTS.display }: { slot?: string }) {
  return <AdUnit slot={slot} format="auto" minHeight={280} />;
}
