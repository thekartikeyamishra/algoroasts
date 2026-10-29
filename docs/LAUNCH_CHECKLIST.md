# Algoroasts — Launch, AdSense & Growth Checklist

What changed in this release, what **you** must do (things code can't do), and the honest maths
behind the $3,500/month goal.

---

## 1. Deploy (15 minutes)

1. Merge this branch and deploy on Vercel.
2. Vercel → Settings → Environment Variables:
   - `LEADS_WEBHOOK_URL` — see `scripts/leads-webhook.gs` (Google Sheet, 5 minutes). **Until this is
     set, the invite and contact forms show "temporarily unavailable".**
   - `LEADS_WEBHOOK_SECRET` — any long random string (append `?key=<same>` to the Apps Script URL).
3. Create the mailbox **hello@algoroasts.com** (or a forwarder, e.g. Cloudflare Email Routing / Zoho
   free) — it is published on every legal page. Or change `SITE.contact.email` in `lib/site.ts`.
4. Verify after deploy:
   - `https://algoroasts.com/ads.txt` → `google.com, pub-4557897331416844, DIRECT, f08c47fec0942fa0`
   - View source of any page contains `<meta name="google-adsense-account" …>` and the `adsbygoogle.js` script.
   - `https://algoroasts.com/sitemap.xml`, `/robots.txt`, `/llms.txt` load.
   - `http://` and `www.` both 301/308 to `https://algoroasts.com` (Vercel → Domains: apex as primary).

## 2. Google Search Console

1. Property `algoroasts.com` (Domain property, DNS-verified) — already set up.
2. Sitemaps → resubmit `https://algoroasts.com/sitemap.xml`.
3. URL Inspection → **Request indexing** for: `/`, `/tools/contract-vs-full-time-calculator`,
   `/blog/software-developer-salary-canada-2026`, `/blog/software-contractor-rates-usa-2026`,
   `/blog/eu-contractor-day-rates-2026`, `/blog/zero-trust-firewall-ai-agents-aegismcp`, `/about`, `/privacy`.
4. Pages report → the 3 "Page with redirect" URLs are expected (http/www variants and the old
   Toronto slug, which now 301s). Click **Validate fix** on "Crawled – currently not indexed" in ~2 weeks.
5. Enhancements → check FAQ / Breadcrumb / Article structured data shows no errors.
6. Also add the site to **Bing Webmaster Tools** (import from Search Console, 2 clicks). Bing powers
   ChatGPT search and DuckDuckGo results — it matters for "AI recommends us".

## 3. AdSense — getting approved (and staying approved)

**Fixed in code** (the usual causes of "Low-value content"):

| Problem found on the live site | Fix |
|---|---|
| An article contained a pasted AI chat transcript (`[cite: 1]` markers, "If the exact same error persists…", a duplicated copy of the article) and claims the code doesn't support | Rewritten as an accurate, useful guide with a disclosure |
| Key Takeaways and FAQ blocks silently missing on every article (next-mdx-remote v6 `blockJS` default) | Fixed — content and FAQ schema render again |
| No Privacy Policy (required by AdSense), Terms, Disclaimer, Contact, Editorial policy | Added, linked in the footer |
| Empty "Advertisement" boxes (placeholder slot IDs `0000000001…`) | Manual units render nothing until real IDs are set |
| All 41 OG images 404 | Generated per-article OG images |
| Auto-opening modal on first visit (interstitial) | Opens only on "How it works" |
| No tool / unique utility | Contract vs Full-Time Calculator (6 country presets, shows its maths) |
| Anonymous publisher | Real founder identity, editorial process, Person/Organization schema |
| Duplicate `/roadmaps` vs `/category/roadmaps` | One canonical URL + 301 |

**You must do in the AdSense dashboard:**

1. **Privacy & messaging → European regulations → create the GDPR message** (Google's own certified
   CMP; free). Required to serve ads to EEA/UK/Swiss visitors. Also enable the **US state regulations** message.
2. **Ads → By site → Auto ads ON.** Settings: ad load *medium*; turn **off** vignette and anchor ads
   at first (they hurt bounce rate); exclude `/privacy`, `/terms`, `/contact`, `/invite` pages.
3. Optional manual units: create *In-article*, *In-feed*, *Display* units and paste their IDs into
   the `NEXT_PUBLIC_AD_SLOT_*` variables.
4. **Wait ~2–4 weeks after deploying** before requesting review, so Google recrawls the new pages and
   content. Then Sites → algoroasts.com → Request review.
5. Keep publishing: AdSense's "low value" decision also weighs *ongoing curation* and *genuine user
   interest*. Nothing in code can fake those — see §5.

**Never:** click your own ads, ask anyone to click, place ads next to buttons/form fields, use
"support us by clicking" wording, buy traffic from bot/pop networks, or auto-generate pages at scale.

## 4. Before you publish anything new

- [ ] Every number has a primary source in `sources` (government, regulator, official docs).
- [ ] You personally checked each figure against the source (the Editorial Policy promises this).
- [ ] No pasted AI artefacts (`[cite`, "Here's the article", "Copy this", unclosed code fences).
- [ ] Answer the reader's exact question in the first 100 words.
- [ ] At least one table or worked example readers can't get from a generic chatbot answer.
- [ ] Link to 2–3 related guides and the calculator where relevant.
- [ ] Bump `updated` only when content materially changes.

**Content debt to clear next (highest impact on approval):** many guides cite only 1 source and use
round ranges without a citation. Re-verify the ten most-viewed guides the way the Canada salary guide
was redone (official table + date + link), and fix unsourced figures (e.g. the US salary baseline in
the contractor-rates guide should be re-checked against the current BLS page).

## 5. The $3,500/month maths — honest version

Ad revenue = pageviews ÷ 1,000 × page RPM. Run `node scripts/revenue-goal.mjs --pages Pages.csv --rpm <your real RPM>`.

| Page RPM (illustrative — use your real one) | Pageviews/month needed for $3,500 |
|---|---|
| $5 | 700,000 |
| $10 | 350,000 |
| $20 | 175,000 |

The Search Console export you shared (last 3 months) shows **~4 clicks/month from ~330 impressions/month**.
So the goal is a traffic problem first, by roughly five orders of magnitude, not an ad-placement problem.
No code, ad setting or "learning system" can guarantee the number; what moves it:

1. **Rank for what you already almost rank for.** The tracker's worklist (positions 4–20) is the cheapest
   traffic. Re-run monthly with fresh exports — that's the feedback loop.
2. **Tools earn links and repeat visits.** Build the next calculators in the same niche (offer comparison
   with equity; salary-to-rate by country; relocation cost). One genuinely useful tool beats ten articles.
3. **Geography sets RPM.** US/UK/Canada/Australia traffic monetises far better than most other markets;
   your best-performing pages are already US/Canada/EU career topics — keep that focus.
4. **Ad experience**: keep ads below the first useful content, ≤1 manual unit per ~600 words, never next
   to controls. Better engagement → higher RPM and fewer policy problems.
5. **Diversify later**: once traffic exists, developer-focused ad networks (e.g. EthicalAds, Carbon) can
   out-earn AdSense on developer audiences that run ad blockers.

## 6. Backlink & distribution strategy (white-hat only)

Do **not** buy links, use PBNs, link exchanges or AI-spun guest posts — that's what gets sites penalised.

1. **Launch the calculator where the pain lives**: answer real threads on r/cscareerquestions,
   r/cscareerquestionsCAD, r/ExperiencedDevs, Blind, Hacker News ("Show HN: contract vs full-time
   break-even calculator") — disclose it's yours, give the answer in the reply, link as a source.
2. **Data stories journalists can cite**: e.g. "Canada's official developer wages by province" — pitch
   to Canadian tech newsletters and career bloggers; government-sourced tables earn natural links.
3. **Open-source**: AegisMCP and the calculator engine (`lib/calc/contract.ts`) on GitHub with a link
   back; submit AegisMCP to MCP server directories once it does what its README claims.
4. **LinkedIn / X build-in-public**: one chart or calculator result per week, linking to the guide.
5. **Resource pages**: university career centres, bootcamps and immigrant-settlement sites keep
   "salary resources" lists — ask to be included where the guide is genuinely useful.
6. **Get mentioned, not just linked**: AI assistants recommend sources that are cited across the web.
   Consistent name ("Algoroasts"), founder identity, and being quoted on Reddit/HN/newsletters matter
   more than any meta tag. `llms.txt` and the open robots.txt make you easy to read; reputation makes you recommended.

## 7. Apps

When the apps are live, put the store URLs in `lib/site.ts` → `SITE.apps.playStore` / `SITE.apps.appStore`.
The "Coming soon" badges become real links everywhere automatically. Consider swapping in the official
Google Play / App Store badges (both companies publish them with usage guidelines). Update the feature
list on `/invite` to match the real app before launch.
