/** Registry of free tools. Add a tool here → it appears on /tools, the homepage, sitemap and llms.txt. */
export const TOOLS = [
  {
    slug: 'contract-vs-full-time-calculator',
    name: 'Contract vs Full-Time Calculator',
    short: 'Find the contract rate that actually beats a full-time offer.',
    description:
      'Compare a contract offer with a full-time package, counting benefits, unpaid time off, gaps between contracts and self-employment contributions. Get your break-even hourly and day rate for the US, Canada, UK, EU or India.',
    tags: ['Hourly & day rate', '1099 vs W-2', '6 country presets'],
  },
] as const;
