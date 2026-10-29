'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { CATEGORIES } from '@/lib/site';
import type { PostCard as PostCardData } from '@/lib/content';
import { PostCard } from './PostCard';
import { InFeedAd } from '@/components/ads/AdSlots';
import { cn } from '@/lib/utils';

const PAGE = 18;

/**
 * Search + filter over all guides. The full list is server-rendered (crawlable); filtering is
 * instant on the client, debounced into the URL (?q=) so /blog?q=… — the SearchAction target in
 * our WebSite schema — really works.
 */
export function BlogSearch({ posts }: { posts: PostCardData[] }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('all');
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQ(params.get('q') ?? '');
    const c = params.get('category');
    if (c && CATEGORIES.some((x) => x.slug === c)) setCat(c);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      if (cat !== 'all') params.set('category', cat);
      const qs = params.toString();
      window.history.replaceState(null, '', qs ? `/blog?${qs}` : '/blog');
    }, 300);
    return () => clearTimeout(t);
  }, [q, cat]);

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return posts.filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false;
      if (terms.length === 0) return true;
      const hay = `${p.title} ${p.description} ${p.tags.join(' ')}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [posts, q, cat]);

  useEffect(() => setLimit(PAGE), [q, cat]);
  const shown = results.slice(0, limit);

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 mb-8 border-b border-line bg-canvas/85 px-4 py-4 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden />
          <label htmlFor="blog-q" className="sr-only">Search guides</label>
          <input
            id="blog-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search salaries, countries, roles, skills…"
            className="h-12 w-full rounded-xl border border-line bg-surface pl-11 pr-11 text-[15px] text-ink placeholder:text-faint focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25"
          />
          {q && (
            <button type="button" onClick={() => setQ('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-faint hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="radiogroup" aria-label="Category">
          {[{ slug: 'all', name: 'All' }, ...CATEGORIES].map((c) => (
            <button
              key={c.slug}
              type="button"
              role="radio"
              aria-checked={cat === c.slug}
              onClick={() => setCat(c.slug)}
              className={cn(
                'shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition',
                cat === c.slug ? 'border-brand-600 bg-brand-600 text-white' : 'border-line bg-surface text-muted hover:text-ink',
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-5 text-sm text-faint" aria-live="polite">
        {results.length === posts.length ? `${posts.length} guides` : `${results.length} of ${posts.length} guides`}
      </p>

      {results.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line p-12 text-center">
          <p className="font-semibold text-ink">No guides match “{q}”.</p>
          <p className="mt-2 text-sm text-muted">Try a country, a role (e.g. “devops”) or a topic (e.g. “equity”).</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((post, i) => (
            <Fragment key={post.slug}>
              <PostCard post={post} headingLevel="h2" />
              {(i + 1) % 6 === 0 && i + 1 < shown.length && (
                <div className="md:col-span-2 lg:col-span-3">
                  <InFeedAd />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      )}

      {results.length > limit && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setLimit((l) => l + PAGE)}
            className="inline-flex h-11 items-center rounded-xl border border-line bg-surface px-6 text-sm font-semibold text-ink transition hover:border-brand-300"
          >
            Show more ({results.length - limit} left)
          </button>
        </div>
      )}
    </div>
  );
}
