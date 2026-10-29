# 🔥 Algoroasts — Developer Decision Intelligence Platform

> We don't tell you what exists. We tell you what to do next.

A production-ready Next.js 14 platform: a developer "decision intelligence" publication engineered
for **search + generative-engine discovery (SEO/GEO/LLM)**, **ad monetization from day one**, and
**habit-forming retention (Hook Model)**.

**For AI coding agents:** read [`MASTER_CONTEXT.md`](./MASTER_CONTEXT.md) first. It is the single
source of truth and will keep you on-rails.

---

## Quick start (Windows / VS Code / PowerShell)

```powershell
# 1. Install dependencies (versions are pinned for stable, reproducible installs)
npm install

# 2. Create your local env file from the template
Copy-Item .env.example .env.local

# 3. Run the dev server
npm run dev
# → http://localhost:3000
```

Other commands:

```powershell
npm run build      # production build (must pass with zero errors)
npm run start      # serve the production build
npm run typecheck  # TypeScript check
npm run lint       # ESLint
```

---

## Launching / AdSense

Read [`docs/LAUNCH_CHECKLIST.md`](./docs/LAUNCH_CHECKLIST.md): env vars, Search Console, AdSense
consent message + Auto ads, the revenue maths and the backlink plan. Track progress toward the ad
revenue goal with `node scripts/revenue-goal.mjs --pages <Search Console Pages.csv> --rpm <your RPM>`.

## What's wired in

- **SEO/GEO/LLM:** auto `sitemap.xml` + `robots.txt` (explicitly allows GPTBot, PerplexityBot,
  ClaudeBot, Google-Extended), canonical URLs, Open Graph/Twitter cards, and JSON-LD
  (Organization, WebSite, Article, Breadcrumb, FAQ). Articles are "answer-first" and fact-dense.
- **Monetization from day one:** Google AdSense loader (`ca-pub-4557897331416844`) + reusable
  in-article / in-feed / display ad units + verified `public/ads.txt`.
- **Retention:** the Hook Model (Trigger → Action → Variable Reward → Investment) via a save-to-roadmap
  button and a return-streak badge.
- **Content engine:** MDX articles with a typed, enforced frontmatter contract and GEO building
  blocks (`<AnswerBlock>`, `<Stat>`, `<KeyTakeaways>`, `<FAQ>`).

---

## Writing a new article

1. Create `content/posts/<slug>.mdx`.
2. Copy the frontmatter + body shape from `content/posts/ai-engineer-salary-2026.mdx`.
3. Required frontmatter: `title`, `answer` (~50 words), `description`, `category`, `date`.
   Recommended: `keyStat`, `tags`, `related`, `sources` (real URLs only).
4. Lead with the directive, back claims with `<Stat>`, add a `<FAQ>`, link to `related` posts.
5. The article auto-appears in the blog index, its category page, the sitemap, and gets full schema.

`category` must be one of the slugs in `lib/site.ts` → `CATEGORIES`
(`careers`, `ai-engineering`, `roadmaps`, `market-intelligence`).

---

## Configuration

All site-wide constants live in **`lib/site.ts`** (domain, AdSense ID, categories, nav, social).
Change them there once — they propagate everywhere. Environment values are in `.env.local`
(`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ADSENSE_CLIENT`).

### AdSense
1. The site loader is already in `app/layout.tsx`. Turn on **Auto ads** in your AdSense dashboard to
   earn immediately.
2. For controlled placements, create ad units in AdSense and paste their slot IDs into
   `components/ads/slots.ts` (`AD_SLOTS`), replacing the placeholders.
3. `public/ads.txt` is already configured with your publisher line — keep it.

---

## Deployment

Deploy to Vercel (recommended) or any Node host.

- Set the production env var `NEXT_PUBLIC_SITE_URL=https://algoroasts.com`.
- Point the apex domain `algoroasts.com` at the host. `www` 301-redirects to apex (configured in
  `next.config.mjs`).
- Add OG images (1200×630) to `public/og/` matching the `image` paths in your articles, plus
  `og/logo.png`, `og/icon-192.png`, `og/icon-512.png`.
- Submit `https://algoroasts.com/sitemap.xml` in Google Search Console.

---

## Project structure

See [`MASTER_CONTEXT.md` §3](./MASTER_CONTEXT.md) for the authoritative directory map and the rules
every contributor (human or AI) must follow.
