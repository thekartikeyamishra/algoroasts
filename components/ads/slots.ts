/**
 * AD SLOT REGISTRY — server-safe (no "use client").
 *
 * Paste real ad-unit IDs from AdSense → Ads → By ad unit (the 10-digit `data-ad-slot` value).
 * While a value is empty the manual unit renders NOTHING (no empty "Advertisement" boxes, which
 * reviewers read as a broken/low-quality page). Auto ads, switched on in the AdSense dashboard,
 * serve site-wide in the meantime.
 *
 * Placement policy (enforced by where these components are used, not by AdSense):
 *  - Max one manual unit per ~600 words of article body; never two units adjacent.
 *  - Never directly next to buttons, form inputs, navigation or the calculator controls
 *    (accidental-click policy).
 *  - No ads on legal pages, the contact page, the invite form or error pages.
 */
const env = (v: string | undefined) => (v && /^\d{6,}$/.test(v) ? v : '');

export const AD_SLOTS = {
  inArticleTop: env(process.env.NEXT_PUBLIC_AD_SLOT_IN_ARTICLE_TOP),
  inArticleMid: env(process.env.NEXT_PUBLIC_AD_SLOT_IN_ARTICLE_MID),
  inFeed: env(process.env.NEXT_PUBLIC_AD_SLOT_IN_FEED),
  inFeedLayoutKey: process.env.NEXT_PUBLIC_AD_SLOT_IN_FEED_LAYOUT_KEY ?? '',
  display: env(process.env.NEXT_PUBLIC_AD_SLOT_DISPLAY),
  toolResult: env(process.env.NEXT_PUBLIC_AD_SLOT_TOOL_RESULT),
} as const;

/** Pages where no ad may ever render (manual units). Auto ads exclusions are set in the dashboard. */
export const AD_FREE_PATHS = ['/privacy', '/terms', '/disclaimer', '/contact', '/editorial-policy', '/invite'];
