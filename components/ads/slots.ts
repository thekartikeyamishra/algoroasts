/**
 * AD SLOT REGISTRY — server-safe (no "use client"), so both server and client
 * components can import these IDs. Fill with real slot IDs from your AdSense
 * dashboard (Ads → By ad unit). Until then, AdSense Auto ads serve site-wide.
 */
export const AD_SLOTS = {
  inArticleTop: '0000000001',
  inArticleMid: '0000000002',
  inFeed: '0000000003',
  sidebar: '0000000004',
  footer: '0000000005',
} as const;
