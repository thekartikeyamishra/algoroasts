#!/usr/bin/env node
/**
 * REVENUE GOAL TRACKER — "what has to be true to reach $X/month from ads, and which pages to work on next".
 *
 * Usage:
 *   node scripts/revenue-goal.mjs --pages ./Pages.csv [--goal 3500] [--rpm 8] [--months 3] [--pvPerClick 1.4]
 *
 *   --pages       Search Console → Performance → Pages → Export → CSV (the "Pages.csv" file).
 *   --goal        Monthly ad revenue target in USD (default 3500).
 *   --rpm         Your actual page RPM in USD from AdSense → Reports (default 8 — REPLACE with your real number).
 *   --months      How many months the export covers (default 3).
 *   --pvPerClick  Pageviews per search click (pages/session); read it from Analytics (default 1.4).
 *
 * It prints the traffic gap and a ranked worklist of "striking distance" pages: already ranking
 * on page 1–2 with impressions but few clicks — the cheapest traffic to win by improving content,
 * titles and descriptions. Re-run it monthly with fresh exports: the list updates as rankings move.
 */
import fs from 'node:fs';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, v, i, all) => (v.startsWith('--') ? [...acc, [v.slice(2), all[i + 1]]] : acc), []),
);
const goal = Number(args.goal ?? 3500);
const rpm = Number(args.rpm ?? 8);
const months = Number(args.months ?? 3);
const pvPerClick = Number(args.pvPerClick ?? 1.4);
if (!args.pages || !fs.existsSync(args.pages)) {
  console.error('Pass --pages <Search Console Pages.csv>');
  process.exit(1);
}

const rows = fs
  .readFileSync(args.pages, 'utf8')
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((line) => {
    const [url, clicks, impressions, ctr, position] = line.split(',');
    return { url, clicks: +clicks, impressions: +impressions, ctr: parseFloat(ctr) / 100, position: +position };
  })
  .filter((r) => r.url && Number.isFinite(r.impressions));

const clicks = rows.reduce((s, r) => s + r.clicks, 0) / months;
const impressions = rows.reduce((s, r) => s + r.impressions, 0) / months;
const pageviews = clicks * pvPerClick;
const revenue = (pageviews / 1000) * rpm;
const neededPv = (goal / rpm) * 1000;

const usd = (n) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
console.log('\n=== Revenue goal ===');
console.log(`Goal:                 ${usd(goal)}/month at an assumed page RPM of $${rpm}`);
console.log(`Pageviews needed:     ${Math.round(neededPv).toLocaleString()} / month`);
console.log(`Search clicks now:    ${clicks.toFixed(1)} / month  (${Math.round(impressions).toLocaleString()} impressions)`);
console.log(`Est. revenue now:     ${usd(revenue)}/month from search traffic`);
console.log(`Gap:                  ${Math.max(0, Math.round(neededPv - pageviews)).toLocaleString()} pageviews / month (${(neededPv / Math.max(pageviews, 1)).toFixed(0)}× today)`);
console.log('\nRPM is the lever you control least and traffic the one you control most. Check your real RPM in AdSense → Reports.');

// Striking distance: positions 4–20 with impressions. Expected CTR by position is a rough planning curve.
const expectedCtr = (p) => (p <= 3 ? 0.15 : p <= 5 ? 0.07 : p <= 10 ? 0.03 : p <= 20 ? 0.01 : 0.003);
const work = rows
  .filter((r) => r.position >= 3 && r.position <= 20 && r.impressions >= 5)
  .map((r) => ({ ...r, upside: r.impressions / months * (expectedCtr(3) - r.ctr) }))
  .sort((a, b) => b.upside - a.upside)
  .slice(0, 15);

console.log('\n=== Worklist: improve these first (striking distance) ===');
console.log('pos   impr/mo  ctr     url');
for (const r of work) {
  console.log(`${r.position.toFixed(1).padStart(4)}  ${String(Math.round(r.impressions / months)).padStart(7)}  ${(r.ctr * 100).toFixed(1).padStart(5)}%  ${r.url}`);
}
console.log('\nFor each: answer the exact query in the first 100 words, add a primary-source table, sharpen the title');
console.log('and description for the query people actually type, and link to it from 2–3 related guides.\n');
