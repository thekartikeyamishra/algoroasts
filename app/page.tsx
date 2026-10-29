import Link from 'next/link';
import { ArrowRight, Calculator, Globe2, GraduationCap, Building2, Check, X } from 'lucide-react';
import { SITE, CATEGORIES, categoryHref } from '@/lib/site';
import { getAllPosts, countDistinctSources, toCard } from '@/lib/content';
import { DEFAULT_PRESET, calculate, formatMoney } from '@/lib/calc/contract';
import { faqSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { DisplayAd } from '@/components/ads/AdSlots';
import { PostCard } from '@/components/article/PostCard';
import { InviteForm } from '@/components/invite/InviteForm';
import { AppStoreButtons } from '@/components/invite/AppStoreButtons';
import { SignalField } from '@/components/fx/SignalField';
import { Tilt } from '@/components/fx/Tilt';

const DECISIONS = [
  {
    icon: Calculator,
    q: 'Is this contract rate actually a raise?',
    a: 'Price in benefits, unpaid time off and gaps between contracts.',
    href: '/tools/contract-vs-full-time-calculator',
  },
  {
    icon: Globe2,
    q: 'Canada, the US or Europe — where should I work?',
    a: 'Pay, cost of living and visa routes, compared honestly.',
    href: '/blog/canada-vs-usa-tech-careers-2026',
  },
  {
    icon: Building2,
    q: 'Startup or global capability centre in India?',
    a: 'Pay, stability and growth trade-offs for each path.',
    href: '/blog/india-startup-vs-gcc-2026',
  },
  {
    icon: GraduationCap,
    q: 'What should I learn next?',
    a: 'Ordered roadmaps for AI, cloud, data and platform roles.',
    href: '/roadmaps',
  },
];

const HOME_FAQ = [
  {
    question: 'What is Algoroasts?',
    answer:
      'Algoroasts is a free resource that helps software developers make career decisions — comparing contract and full-time offers, choosing where to work, and deciding what to learn — using official data and transparent calculators.',
  },
  {
    question: 'Where does the data come from?',
    answer:
      'From primary sources such as government labour statistics, tax authorities and immigration departments, plus official vendor documentation. Every guide links to its sources so you can verify the numbers yourself.',
  },
  {
    question: 'Is Algoroasts free?',
    answer: 'Yes. The guides and calculators are free and need no account. The site is funded by advertising.',
  },
  {
    question: 'Is there an Algoroasts app?',
    answer: 'The app is in invite-only early access. Request an invite and we will email you once when yours is ready. Store links will appear here when the apps launch.',
  },
];

export default function HomePage() {
  const all = getAllPosts();
  const latest = all.slice(0, 6).map(toCard);
  const sources = countDistinctSources();
  const ex = calculate(DEFAULT_PRESET.input);
  const cur = DEFAULT_PRESET.input.currency;

  return (
    <>
      <JsonLd data={faqSchema(HOME_FAQ)} />

      {/* ------------------------------------------------------------ HERO */}
      <section className="relative isolate overflow-hidden bg-slate-950">
        <SignalField className="absolute inset-0 -z-10 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(79,70,229,0.28),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-slate-950" />
        <div className="container-x py-20 text-center sm:py-28 lg:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-slate-300 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            App now in invite-only early access
          </span>
          <Tilt className="mx-auto mt-7 max-w-4xl">
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Stop guessing your next career move. <span className="gradient-text">Run the numbers.</span>
            </h1>
          </Tilt>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Source-cited guides and free calculators for the decisions that move a developer’s income: contracts vs full-time,
            where to work, and what to learn next.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/tools/contract-vs-full-time-calculator"
              className="group inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-6 font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
            >
              <Calculator className="h-4 w-4" /> Check a contract offer
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/invite"
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/20 px-6 font-semibold text-white transition hover:bg-white/10"
            >
              Request an invite
            </Link>
          </div>
          <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 text-left sm:grid-cols-4">
            {[
              [String(all.length), 'decision guides'],
              [String(sources), 'primary sources cited'],
              ['6', 'country presets'],
              ['0', 'sign-ups needed'],
            ].map(([v, l]) => (
              <div key={l} className="bg-slate-950/80 px-5 py-4 backdrop-blur">
                <dt className="sr-only">{l}</dt>
                <dd className="text-2xl font-extrabold tabular-nums text-white">{v}</dd>
                <dd className="text-xs text-slate-400">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------------ DECISIONS */}
      <section className="container-x py-20" aria-labelledby="decisions">
        <div className="max-w-2xl" data-reveal>
          <h2 id="decisions" className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Start with the decision in front of you</h2>
          <p className="mt-4 text-lg text-muted">Each path ends in a clear recommendation, with the evidence one click away.</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DECISIONS.map(({ icon: Icon, q, a, href }) => (
            <Link key={href} href={href} data-reveal className="spotlight group flex flex-col rounded-3xl border border-line bg-surface p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-bold leading-snug text-ink">{q}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{a}</p>
              <ArrowRight className="mt-5 h-4 w-4 text-brand-600 transition group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ TOOL SHOWCASE */}
      <section className="container-x pb-20">
        <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] border border-line bg-surface p-6 sm:p-10 lg:grid-cols-2" data-reveal>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Free tool</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink">The “divide by 2,080” trap</h2>
            <p className="mt-4 leading-relaxed text-muted">
              A {formatMoney(DEFAULT_PRESET.input.ft.salary, cur)} salary looks like {formatMoney(ex.naiveHourly, cur, { decimals: 2 })} an hour.
              Add the bonus, retirement match and benefits you’d give up, the holidays you no longer get paid for and a few weeks between
              contracts, and a 1099 contract has to pay about{' '}
              <strong className="text-ink">{formatMoney(ex.breakEvenHourly, cur, { decimals: 2 })} an hour</strong> just to break even.
            </p>
            <Link href="/tools/contract-vs-full-time-calculator" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 font-semibold text-white transition hover:bg-brand-700">
              Run your own numbers <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-3xl bg-slate-950 p-6 text-white">
            <p className="text-xs uppercase tracking-widest text-slate-400">Example · USA · 1099</p>
            <div className="mt-5 space-y-4">
              {[
                ['Naive hourly (salary ÷ 2,080)', ex.naiveHourly, 'bg-slate-500'],
                ['Real break-even hourly', ex.breakEvenHourly, 'bg-gradient-to-r from-accent-400 to-brand-500'],
              ].map(([label, value, bar]) => (
                <div key={label as string}>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">{label as string}</span>
                    <span className="font-bold tabular-nums">{formatMoney(value as number, cur, { decimals: 2 })}</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-white/10">
                    <div className={`h-3 rounded-full ${bar as string}`} style={{ width: `${Math.min(100, ((value as number) / ex.breakEvenHourly) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-slate-400">
              Computed live from the calculator’s default US scenario: {ex.breakEvenMultiple.toFixed(2)}× the naive rate. Illustrative only — your
              numbers will differ.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ PARADIGM */}
      <section className="container-x pb-20">
        <div className="max-w-3xl" data-reveal>
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Why not just ask a chatbot or read a blog?</h2>
          <p className="mt-4 text-lg text-muted">You can. But a career decision deserves numbers you can verify.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { title: 'Typical blogs', good: [], bad: ['Lists of options, no recommendation', 'Rarely updated or sourced', 'Written for every reader at once'] },
            { title: 'General chatbots', good: ['Fast'], bad: ['Confident numbers without sources', 'No memory of how the market moved'] },
            { title: SITE.name, good: ['One clear recommendation per guide', 'Primary sources linked on every page', 'Calculators that show their maths'], bad: [], highlight: true },
          ].map((c) => (
            <div
              key={c.title}
              data-reveal
              className={`spotlight rounded-3xl border p-7 ${c.highlight ? 'border-brand-500 bg-brand-50/60 shadow-xl shadow-brand-600/10 dark:bg-brand-500/10' : 'border-line bg-surface'}`}
            >
              <h3 className="text-lg font-bold text-ink">{c.title}</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {c.good.map((p) => (
                  <li key={p} className="flex gap-2 text-muted"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{p}</li>
                ))}
                {c.bad.map((p) => (
                  <li key={p} className="flex gap-2 text-muted"><X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ LATEST */}
      <section className="container-x pb-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight text-ink">Latest intelligence</h2>
          <Link href="/blog" className="shrink-0 text-sm font-semibold text-brand-600 hover:underline">All {all.length} guides →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {latest.map((post, i) => (
            <PostCard key={post.slug} post={post} badge={i === 0 ? 'Latest' : undefined} />
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={categoryHref(c.slug)} className="rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-medium text-muted transition hover:border-brand-300 hover:text-brand-600">
              {c.name}
            </Link>
          ))}
        </div>
        <DisplayAd />
      </section>

      {/* ------------------------------------------------------ INVITE */}
      <section className="container-x pb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-14 sm:px-12" data-reveal>
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl" aria-hidden />
          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-400">Invite-only</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">The app is opening in small batches.</h2>
              <p className="mt-4 leading-relaxed text-slate-300">
                Save your decisions, rerun calculators on the go and get told when the data behind them changes. Join the list — we’ll
                email you once, when your invite is ready.
              </p>
              <AppStoreButtons className="mt-6 [&>span]:border-white/15 [&>span]:bg-white/5 [&>span]:text-slate-300" />
            </div>
            <div className="rounded-3xl bg-white p-5 dark:bg-slate-900 sm:p-6">
              <InviteForm source="home" compact />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ FAQ */}
      <section className="container-x pb-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-ink">Questions, answered</h2>
          <div className="mt-6 divide-y divide-line rounded-3xl border border-line bg-surface">
            {HOME_FAQ.map((f) => (
              <details key={f.question} className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                  {f.question}
                  <span className="text-xl text-faint transition group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-muted">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
