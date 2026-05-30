import Link from 'next/link';
import type { Metadata } from 'next';
import { CATEGORIES } from '@/lib/site';
import { getAllPosts } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { InFeedAd } from '@/components/ads/AdSlots';

export const metadata: Metadata = buildMetadata({
  title: 'Developer Intelligence',
  description: 'Data-backed, source-cited career and market intelligence for software developers.',
  path: '/blog',
});

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="container-x py-16">
      <header className="mb-12 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">Developer Intelligence</h1>
        <p className="mt-4 text-lg text-muted">
          Every article opens with a directive, backs it with verifiable numbers, and cites its sources.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-medium text-muted transition hover:border-brand-200 hover:text-brand-600"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post, index) => {
          const cat = CATEGORIES.find((c) => c.slug === post.frontmatter.category);
          return (
            <div key={post.slug} className="contents">
              <Link
                href={`/blog/${post.slug}`}
                className="glass-card group flex flex-col rounded-2xl p-6 shadow-sm transition hover:shadow-lg"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
                  {cat?.name ?? post.frontmatter.category}
                </span>
                <h2 className="mt-2 text-xl font-bold text-ink group-hover:text-brand-600">
                  {post.frontmatter.title}
                </h2>
                <p className="mt-2 flex-1 text-muted">{post.frontmatter.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-faint">
                  <span>{formatDate(post.frontmatter.date)}</span>
                  <span>{post.readingTimeMinutes} min read</span>
                </div>
              </Link>
              {/* In-feed ad after every 4th post */}
              {(index + 1) % 4 === 0 && (
                <div className="md:col-span-2">
                  <InFeedAd />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
