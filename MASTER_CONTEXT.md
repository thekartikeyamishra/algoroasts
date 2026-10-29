# ALGOROASTS — MASTER CONTEXT PROMPT

> **Read this entire file before writing a single line of code.** This is the single source of
> truth for the Algoroasts platform. Any AI coding agent (Claude Code, Cursor, Windsurf, Copilot)
> working in this repository MUST follow every rule here. When a request conflicts with this file,
> this file wins — stop and ask.

---

## 0. HARD RULES (NON-NEGOTIABLE)

1. **No half-baked code.** Every file you output must be complete, compile cleanly, and be
   production-ready. Never write `// TODO`, `// ... rest of code`, placeholder stubs, or pseudo-code.
2. **Always give the full file with its exact path.** When changing a file, output the ENTIRE file
   contents, not a diff or fragment. Begin every code block with a comment or heading stating the
   full path (e.g. `app/blog/[slug]/page.tsx`).
3. **Do not invent APIs, props, env vars, packages, or file paths.** If it is not defined in this
   file or already in the repo, it does not exist. Check `lib/site.ts` and existing components first.
4. **Pin versions. Never `npm install latest`.** Use the exact versions in `package.json`.
5. **Verify before claiming done.** Code must pass `npm run typecheck` and `npm run build`.
6. **Never hard-code site constants.** Domain, AdSense ID, categories, social links live ONLY in
   `lib/site.ts`. Import from there.
7. **Server vs Client boundary is sacred.** Plain constants/objects that server components need
   must live in a NON-`'use client'` module (see `components/ads/slots.ts`). Never import a value
   export (not a component) from a `'use client'` file into a server component.
8. **No browser storage in code that runs on the server.** `localStorage` is only valid inside
   `'use client'` components and must be guarded with `typeof window !== 'undefined'`.
9. **English (US) content. Source-cited claims only.** Every statistic must have a real source in
   frontmatter `sources`. Never fabricate numbers. If you cannot cite it, do not state it as fact.

---

## 1. WHAT ALGOROASTS IS

**Algoroasts** is a **Developer Decision Intelligence Platform**, not a blog.

- **Positioning:** "We don't tell you what exists. We tell you what to do next."
- **Problem solved:** Developers no longer have an information deficit — they have a *direction*
  deficit. General AI gives generic, overwhelming lists. Algoroasts synthesizes real market data,
  salary trends, and visual roadmaps into a single actionable directive.
- **Revenue model:** Advertising only (NO paid subscriptions). See `docs/LAUNCH_CHECKLIST.md`. Google AdSense from day one,
  graduating to premium programmatic + privacy-first developer ad networks later.
- **Revenue target:** ≥ $10,000/month, sustained for 10–15 years.
- **Domain:** `https://algoroasts.com` (apex is canonical; `www` 301-redirects to apex).
- **AdSense publisher ID:** `ca-pub-4557897331416844`.

---

## 2. TECH STACK (EXACT)

| Layer        | Choice                          | Version (pinned) |
|--------------|---------------------------------|------------------|
| Framework    | Next.js (App Router)            | 14.2.35          |
| Language     | TypeScript (strict)             | 5.4.5            |
| UI           | React                           | 18.3.1           |
| Styling      | Tailwind CSS + `@tailwindcss/typography` | 3.4.13   |
| Content      | MDX via `next-mdx-remote/rsc` + `gray-matter` | 5.0.0 / 4.0.3 |
| MDX plugins  | `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code` | see package.json |
| Icons        | `lucide-react`                  | 0.454.0          |
| Utils        | `clsx`, `tailwind-merge`, `reading-time` | see package.json |
| Runtime      | Node.js                         | ≥ 18.18.0        |

- **No `src/` directory.** App lives at repo root: `app/`, `components/`, `lib/`, `content/`.
- **Path alias:** `@/*` → repo root (configured in `tsconfig.json`).
- Do NOT add a database, auth, or CMS in Phase 1. Content is flat-file MDX in `content/posts/`.

---

## 3. DIRECTORY MAP (AUTHORITATIVE)

```
algoroasts/
├── app/
│   ├── layout.tsx               # Root: fonts (<link>), AdSense loader, org+website JSON-LD, nav/footer
│   ├── page.tsx                 # Homepage: hero, paradigm grid, latest feed + ad
│   ├── globals.css              # Tailwind layers + brand tokens + prose tuning
│   ├── sitemap.ts               # Auto /sitemap.xml from content (never edit by hand)
│   ├── robots.ts                # /robots.txt — explicitly allows AI crawlers
│   ├── manifest.ts              # PWA manifest
│   ├── blog/
│   │   ├── page.tsx             # Blog index + in-feed ads
│   │   └── [slug]/page.tsx      # Article: MDX render, Answer Block, schema, ads, save, sources, related
│   ├── category/[slug]/page.tsx # Category landing (one per CATEGORIES entry)
│   ├── about/page.tsx
│   ├── roadmaps/page.tsx        # Canonical Skill Roadmaps hub (/category/roadmaps 301s here)
│   ├── tools/                   # Free calculators (index + contract-vs-full-time-calculator)
│   ├── invite/page.tsx          # Invite-only early access + app store buttons
│   ├── privacy|terms|disclaimer|editorial-policy|contact/  # Trust & legal pages (no ads)
│   ├── llms.txt/route.ts        # Plain-text site map for AI assistants
│   ├── blog/[slug]/opengraph-image.tsx  # Per-article OG images
│   └── api/leads/route.ts       # Invite/contact → LEADS_WEBHOOK_URL (stores nothing itself)
├── components/
│   ├── JsonLd.tsx               # <script type="application/ld+json"> injector
│   ├── layout/{Navbar,Footer}.tsx
│   ├── ads/
│   │   ├── AdUnit.tsx           # 'use client' core AdSense slot (route-aware, error-safe)
│   │   ├── AdSlots.tsx          # 'use client' wrappers: InArticleAd, InFeedAd, DisplayAd
│   │   └── slots.ts             # SERVER-SAFE constant AD_SLOTS (no 'use client')
│   ├── article/
│   │   ├── AnswerBlock.tsx      # AnswerBlock, Stat, KeyTakeaways, FAQ (GEO primitives)
│   │   └── MdxComponents.tsx    # MDX element map (semantic HTML, custom components)
│   └── hook/
│       ├── HookProvider.tsx     # 'use client' context: streak, saved items (localStorage)
│       └── HookActions.tsx      # 'use client' SaveButton (Investment), StreakBadge (Reward)
├── content/posts/*.mdx          # Articles. Each is one decision directive.
├── lib/
│   ├── site.ts                  # SINGLE SOURCE OF TRUTH: SITE, CATEGORIES, NAV_LINKS, absoluteUrl
│   ├── seo.ts                   # buildMetadata() — every page calls this
│   ├── schema.ts                # JSON-LD generators (organization, website, article, breadcrumb, faq)
│   ├── content.ts               # MDX loader + typed frontmatter contract
│   └── utils.ts                 # cn(), formatDate(), isoDate()
├── public/{ads.txt, og/}
├── next.config.mjs              # www→apex redirect, security headers
├── tailwind.config.ts           # Brand palette wired to CSS vars
├── MASTER_CONTEXT.md            # THIS FILE
└── package.json
```

**When adding a feature, place files according to this map. Do not invent new top-level folders
without updating this map first.**

---

## 4. DESIGN SYSTEM (from the official Algoroasts template)

- **Logo:** 🔥 emoji + wordmark "Algoroasts".
- **Fonts:** `Plus Jakarta Sans` (display + body), `JetBrains Mono` (code/data). Loaded via `<link>`
  in `app/layout.tsx`; exposed as CSS vars `--font-jakarta` / `--font-mono`; mapped to Tailwind
  `font-sans` / `font-mono`.
- **Palette (Tailwind tokens, defined in `tailwind.config.ts`):**
  - `brand` (indigo) — primary. `brand-600 = #4F46E5`.
  - `accent` (cyan) — `accent-500 = #06B6D4`.
  - `ink = #0F172A` (text), `canvas = #F8FAFC` (page background).
- **Signature elements:** `.glass-card` (white/95 + blur + slate border), `.gradient-text`
  (cyan→indigo clip), dark slate-900 hero with a 20%-opacity indigo→cyan gradient wash.
- **Tone:** energetic, confident, data-forward. Rounded-2xl cards, generous spacing, soft shadows.
- **Spacing/readability:** article body uses `prose prose-slate prose-lg` inside `max-w-prose`.
- Use `lucide-react` for UI icons; emoji only for the 🔥 brand mark.

---

## 5. CONTENT MODEL — THE ARTICLE TEMPLATE

Every article is one **decision directive**, not a tutorial. Articles are MDX files in
`content/posts/<slug>.mdx`. The frontmatter contract is enforced by `lib/content.ts`
(`validateFrontmatter` throws on missing required fields).

### Required frontmatter
```yaml
title: "…"            # H1 + <title>
answer: "…"           # ~50-word machine-extractable directive (THE Answer Block). REQUIRED.
description: "…"      # meta description / card summary. REQUIRED.
category: "careers"   # one of CATEGORIES slugs. REQUIRED.
date: "2026-05-30"    # ISO. REQUIRED.
```
### Optional but strongly recommended
```yaml
updated: "2026-05-30"
author: "Algoroasts Editorial"
image: "/og/<slug>.png"     # 1200x630 OG image
keyStat: "One numeric, source-cited sentence."   # shown under the Answer Block
tags: ["…"]
related: ["other-slug"]     # powers the internal link graph (topical authority)
sources:                    # GEO trust vector — REAL urls only
  - { label: "…", url: "https://…" }
```

### Body structure (GEO-optimized, in this order)
1. One-paragraph framing of the tension/question.
2. `<KeyTakeaways items={[...]} />` — 3–5 scannable, fact-dense bullets.
3. `## H2` sections with **specific numbers** (use `<Stat value="$105,990" label="US median" />`).
4. `<InArticleAd />` once after the Answer Block area and once mid-content (component already in
   the page for the top slot; add `<InArticleAd />` in MDX for mid).
5. `<FAQ items={[{question, answer}]} />` — emits FAQPage JSON-LD automatically. Always include.
6. Internal links to `related` posts within the prose using Markdown links to `/blog/<slug>`.

**Reference implementation:** `content/posts/ai-engineer-salary-2026.mdx`. Copy its shape exactly
for every new article.

### Components available inside MDX (from `MdxComponents.tsx`)
`<AnswerBlock>`, `<Stat>`, `<KeyTakeaways>`, `<FAQ>`, `<InArticleAd>`. Standard Markdown tables
render as styled semantic `<table>` (NEVER use images of tables — RAG crawlers can't read them).

---

## 6. SEO / GEO / LLM OPTIMIZATION RULES

These are the platform's competitive moat. Apply on every page.

1. **Metadata:** every route exports `metadata` (or `generateMetadata`) built ONLY via
   `buildMetadata()` from `lib/seo.ts`. This guarantees canonical URL, OG, and Twitter cards.
2. **Structured data:** emit JSON-LD via `<JsonLd>` using generators in `lib/schema.ts`.
   - Articles → `articleSchema` + `breadcrumbSchema`.
   - FAQ sections → `faqSchema` (handled inside `<FAQ>`).
   - Site-wide org + website schema is in `app/layout.tsx`.
3. **Answer-first / fact-dense:** lead with the directive; embed verifiable numbers; cite primary
   sources (BLS, university reports, vendor docs). This is what Perplexity/ChatGPT/AI Overviews cite.
4. **Topic clusters:** each `CATEGORIES` entry is a pillar. Build one comprehensive pillar page per
   category + 15–30 interlinked subpages. Use `related` to wire the link graph.
5. **Crawlable:** static-render everything (`generateStaticParams`). No core text behind client-only
   JS. Strict semantic HTML. Real tables. `robots.ts` explicitly allows `GPTBot`, `PerplexityBot`,
   `ClaudeBot`, `Google-Extended`, etc.
6. **Visuals:** charts/roadmaps must be SVG or paired with a text data table — never a bare PNG/JPEG
   (invisible to LLMs). If you add charts, use inline SVG or a React chart lib with an accessible
   `<table>` fallback.
7. **Sitemap/robots:** auto-generated from content — never edit `sitemap.ts`/`robots.ts` to add
   individual URLs; add the content and they update themselves.

---

## 7. MONETIZATION RULES (ADS FROM DAY ONE)

- The AdSense site loader is in `app/layout.tsx` (publisher `ca-pub-4557897331416844`). With Auto
  ads enabled in the AdSense dashboard, the site earns immediately.
- **Manual placements** use `<InArticleAd />`, `<InFeedAd />`, `<DisplayAd />` from
  `components/ads/AdSlots.tsx`. Slot IDs live in `components/ads/slots.ts` (`AD_SLOTS`) — replace the
  placeholder IDs with real unit IDs from the AdSense dashboard.
- **`public/ads.txt`** must contain the verified AdSense line (already present). Never delete it.
- **Placement strategy:** one high-yield in-article unit right after the Answer Block, one mid-content,
  one in-feed every 4 cards on listings, one display in footer/sidebar. Never stack two ads adjacently.
- **Developer audience caveat (critical):** developers block ads aggressively. Prioritize high-CPC
  B2B semantic clusters (cloud, AI tooling, MLops, compensation). Phase 2+ adds privacy-first networks
  (EthicalAds/Carbon) and server-side strategies — see the Strategic Analysis. Do NOT implement
  deceptive ad-block circumvention.

---

## 8. RETENTION — THE HOOK MODEL (from "Hooked", Nir Eyal)

Implemented in `components/hook/`. The loop: **Trigger → Action → Variable Reward → Investment**.

- **Trigger:** (external now) headlines/feed; (Phase 3 internal) personalized "the framework you
  saved dropped 14% in demand" alerts.
- **Action:** click an article (low-friction).
- **Variable Reward:** the directive + visual clarity + `StreakBadge` (consecutive-day streak).
- **Investment:** `SaveButton` stores articles to the user's roadmap (`HookProvider`, localStorage).
  Saved data raises switching cost and seeds future internal triggers.

**Rules:** keep all hook state in `HookProvider` (guarded for SSR). Reward must feel earned, never
manipulative or dark-pattern. The platform must be a genuine *utility* (real decision value), not a
novelty — utility is what makes the habit stick.

---

## 9. COMMANDS

```powershell
npm install        # install pinned deps
npm run dev        # local dev at http://localhost:3000
npm run typecheck  # tsc --noEmit (must pass, zero errors)
npm run build      # production build (must pass, zero errors)
npm run start      # serve the production build
npm run lint       # next lint
```

**Definition of done for ANY change:** `npm run typecheck` and `npm run build` both succeed with
zero errors, and any new route is reachable and renders.

---

## 10. AGENT WORKFLOW (FOLLOW EXACTLY)

When asked to add or change something:
1. Re-read the relevant section of this file and the existing files you'll touch.
2. Restate the plan in 2–3 lines, listing exact file paths you will create/modify.
3. Write COMPLETE files (full path stated, no fragments, no TODOs).
4. Keep constants in `lib/site.ts`; respect the server/client boundary; use existing helpers
   (`buildMetadata`, `cn`, schema generators) rather than re-implementing.
5. State the verification: confirm it passes typecheck + build, and note anything the human must do
   (e.g., create an AdSense unit, add an OG image to `public/og/`).
6. If a request is ambiguous or conflicts with this file, STOP and ask one specific question.

**Never** introduce a new dependency, env var, or architectural pattern without first proposing it
and getting confirmation. Default to the simplest solution that fits the map above.

---

## 11. RULES ADDED OCT 2026 (ADSENSE / QUALITY)

1. MDX is rendered with `blockJS: false` (trusted repo content) — without it, `<KeyTakeaways items={...}/>`
   and `<FAQ items={...}/>` silently render nothing.
2. Never commit pasted AI chat output. Grep for `[cite`, "Here's", "Copy this" before publishing.
3. Manual ad units come only from `NEXT_PUBLIC_AD_SLOT_*` env vars; empty → no render. Never place ads
   next to buttons, inputs or the calculator controls, and never on legal/contact/invite pages.
4. Never hide content behind JS for animation (no opacity:0 initial states). Motion is transform-only.
5. App store links live in `SITE.apps`; `null` renders a non-clickable "Coming soon" badge.
6. Calculators: pure maths in `lib/calc/*` (server-safe), statutory figures only with an official source
   linked next to the input, worked examples computed from the same engine.
7. Internal links to categories use `categoryHref()` (roadmaps lives at `/roadmaps`).
