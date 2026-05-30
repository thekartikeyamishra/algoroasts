import Link from 'next/link';
import { ArrowRight, Newspaper, Bot, Flame } from 'lucide-react';
import { SITE, CATEGORIES } from '@/lib/site';
import { getAllPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';
import { DisplayAd } from '@/components/ads/AdSlots';

export default function HomePage() {
  const posts = getAllPosts().slice(0, 6);

  return (
    <>
      {/* HERO — mirrors the Algoroasts template: dark slate, gradient accent, the directive */}
      <header className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5,#06b6d4)] opacity-20" />
        <div className="container-x relative text-center">
          <span className="mb-6 inline-block rounded-full border border-brand-500/30 bg-brand-500/20 px-3 py-1 text-sm font-semibold tracking-wider text-brand-200">
            DEVELOPER DECISION INTELLIGENCE
          </span>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Don’t Just Learn.{' '}
            <span className="gradient-text">Decide What’s Next.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            {SITE.description}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Read the intelligence <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/roadmaps"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Explore roadmaps
            </Link>
          </div>
        </div>
      </header>

      {/* PARADIGM — the three-column comparison from the template */}
      <section className="container-x py-20">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">The Paradigm Shift</h2>
          <p className="mt-4 text-lg text-muted">
            Developers no longer suffer from a deficit of information. They suffer from a deficit of
            direction. We close that gap.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: <Newspaper className="h-8 w-8" />, title: 'Traditional Blogs', points: ['Static information', 'No visual structure', 'Zero personalization'], tone: 'text-red-500' },
            { icon: <Bot className="h-8 w-8" />, title: 'Standard AI Tools', points: ['Generic answers', 'Lacks deep structure', 'No market memory'], tone: 'text-amber-500' },
            { icon: <Flame className="h-8 w-8" />, title: 'Algoroasts', points: ['Decision engine focus', 'Visual learning graphs', 'Source-cited market data'], tone: 'text-emerald-500', highlight: true },
          ].map((card) => (
            <div
              key={card.title}
              className={`glass-card rounded-2xl p-8 shadow-lg ${card.highlight ? 'border-2 border-brand-500 bg-brand-50/50 dark:bg-brand-500/10 md:-translate-y-4' : ''}`}
            >
              <div className={`mb-4 ${card.highlight ? 'text-brand-600' : 'text-faint'}`}>{card.icon}</div>
              <h3 className="mb-3 text-xl font-bold text-ink">{card.title}</h3>
              <ul className="space-y-2 text-muted">
                {card.points.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <span className={card.tone}>{card.highlight ? '✔' : '✖'}</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST INTELLIGENCE */}
      <section className="container-x pb-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-ink">Latest Intelligence</h2>
          <Link href="/blog" className="text-sm font-semibold text-brand-600 hover:underline">
            View all →
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">
            No articles yet. Add your first <code>.mdx</code> file to <code>content/posts/</code>.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => {
              const cat = CATEGORIES.find((c) => c.slug === post.frontmatter.category);
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="glass-card group flex flex-col rounded-2xl p-6 shadow-sm transition duration-250 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
                      {cat?.name ?? post.frontmatter.category}
                    </span>
                    {index === 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
                        ● New
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-ink group-hover:text-brand-600">
                    {post.frontmatter.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted">{post.frontmatter.description}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-faint">
                    <span>{formatDate(post.frontmatter.date)}</span>
                    <span>{post.readingTimeMinutes} min read</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <DisplayAd />
      </section>
    </>
  );
}
