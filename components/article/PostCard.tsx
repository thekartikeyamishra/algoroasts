import Link from 'next/link';
import { CATEGORIES } from '@/lib/site';
import type { PostCard as PostCardData } from '@/lib/content';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function PostCard({ post, headingLevel = 'h3', badge, className }: { post: PostCardData; headingLevel?: 'h2' | 'h3'; badge?: string; className?: string }) {
  const cat = CATEGORIES.find((c) => c.slug === post.category);
  const Heading = headingLevel;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn('spotlight group flex flex-col rounded-3xl border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5', className)}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-brand-600">{cat?.name ?? post.category}</span>
        {badge && (
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">{badge}</span>
        )}
      </div>
      <Heading className="mt-2.5 text-lg font-bold leading-snug text-ink transition group-hover:text-brand-600">{post.title}</Heading>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{post.description}</p>
      <div className="mt-5 flex items-center justify-between text-xs text-faint">
        <time dateTime={post.updated ?? post.date}>
          {post.updated && post.updated !== post.date ? `Updated ${formatDate(post.updated)}` : formatDate(post.date)}
        </time>
        <span>{post.readingTimeMinutes} min read</span>
      </div>
    </Link>
  );
}
