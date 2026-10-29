import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import { Calculator, ArrowRight, ShieldAlert } from 'lucide-react';

import { getAllPosts, getPostBySlug, getPostSlugs, toCard, type Post } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { articleSchema, breadcrumbSchema } from '@/lib/schema';
import { CATEGORIES, SITE, categoryHref } from '@/lib/site';
import { formatDate } from '@/lib/utils';
import { JsonLd } from '@/components/JsonLd';
import { mdxComponents } from '@/components/article/MdxComponents';
import { AnswerBlock } from '@/components/article/AnswerBlock';
import { PostCard } from '@/components/article/PostCard';
import { InArticleAd } from '@/components/ads/AdSlots';
import { AD_SLOTS } from '@/components/ads/slots';
import { SaveButton } from '@/components/hook/HookActions';
import { ReadingProgress } from '@/components/ui/ReadingProgress';

export const dynamicParams = false;

// Pre-render every article at build time (fast, fully static, perfect for crawlers).
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  try {
    const { frontmatter } = getPostBySlug(params.slug);
    return buildMetadata({
      title: frontmatter.title,
      description: frontmatter.description,
      path: `/blog/${params.slug}`,
      image: `/blog/${params.slug}/opengraph-image`,
      type: 'article',
      publishedTime: new Date(frontmatter.date).toISOString(),
      modifiedTime: new Date(frontmatter.updated ?? frontmatter.date).toISOString(),
      tags: frontmatter.tags,
      noIndex: frontmatter.draft,
    });
  } catch {
    return buildMetadata({ noIndex: true });
  }
}

const rehypePrettyCodeOptions = { theme: 'github-dark', keepBackground: false };

/** Posts where the contract calculator is directly useful to the reader. */
const CALCULATOR_TOPICS = /contract|freelanc|day-rate|rates|remote|usd|equity|compensation|salary/;

function relatedFor(post: Post): Post[] {
  const all = getAllPosts();
  const picked = (post.frontmatter.related ?? [])
    .map((s) => all.find((p) => p.slug === s))
    .filter((p): p is Post => Boolean(p));
  if (picked.length >= 4) return picked.slice(0, 4);
  // Fill with same-category posts so every article links onward (no dead ends).
  const fill = all.filter((p) => p.slug !== post.slug && p.frontmatter.category === post.frontmatter.category && !picked.includes(p));
  return [...picked, ...fill].slice(0, 4);
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  let post: Post;
  try {
    post = getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  const { frontmatter, content, slug, readingTimeMinutes } = post;
  const category = CATEGORIES.find((c) => c.slug === frontmatter.category);
  const related = relatedFor(post);
  const showCalculator = CALCULATOR_TOPICS.test(slug) && frontmatter.category === 'careers';
  const updated = frontmatter.updated && frontmatter.updated !== frontmatter.date ? frontmatter.updated : null;

  return (
    <article className="container-x py-10 sm:py-12">
      <ReadingProgress />
      <JsonLd
        data={[
          articleSchema(post),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Intelligence', path: '/blog' },
            { name: category?.name ?? 'Guides', path: categoryHref(frontmatter.category) },
            { name: frontmatter.title, path: `/blog/${slug}` },
          ]),
        ]}
      />

      <div className="mx-auto max-w-prose">
        <nav className="mb-6 text-sm text-faint" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/blog" className="hover:text-brand-600">Intelligence</Link>
          <span className="mx-1.5">/</span>
          <Link href={categoryHref(frontmatter.category)} className="hover:text-brand-600">{category?.name}</Link>
        </nav>

        <header className="mb-8">
          <Link href={categoryHref(frontmatter.category)} className="text-xs font-bold uppercase tracking-widest text-brand-600">
            {category?.name}
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-[2.6rem] sm:leading-[1.1]">
            {frontmatter.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{frontmatter.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-faint">
            <span>
              By <Link href="/about" className="font-medium text-muted hover:text-brand-600">{frontmatter.author ?? SITE.author.name}</Link>
            </span>
            <span aria-hidden>·</span>
            <span>
              Published <time dateTime={new Date(frontmatter.date).toISOString()}>{formatDate(frontmatter.date)}</time>
            </span>
            {updated && (
              <>
                <span aria-hidden>·</span>
                <span>
                  Updated <time dateTime={new Date(updated).toISOString()}>{formatDate(updated)}</time>
                </span>
              </>
            )}
            <span aria-hidden>·</span>
            <span>{readingTimeMinutes} min read</span>
          </div>
          <div className="mt-5">
            <SaveButton slug={slug} />
          </div>
        </header>

        <AnswerBlock answer={frontmatter.answer} keyStat={frontmatter.keyStat} />

        {showCalculator && (
          <Link
            href="/tools/contract-vs-full-time-calculator"
            className="not-prose group my-6 flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition hover:border-brand-300 hover:shadow-md"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
              <Calculator className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-ink">Run your own numbers</span>
              <span className="block text-sm text-muted">Contract vs Full-Time Calculator — find your break-even hourly and day rate.</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-brand-600 transition group-hover:translate-x-1" />
          </Link>
        )}

        <InArticleAd slot={AD_SLOTS.inArticleTop} />

        <div className="prose prose-slate prose-lg dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-brand-600">
          <MDXRemote
            source={content}
            components={mdxComponents}
            options={{
              blockJS: false,
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                  [rehypePrettyCode, rehypePrettyCodeOptions],
                ],
              },
            }}
          />
        </div>

        {frontmatter.sources && frontmatter.sources.length > 0 && (
          <section className="mt-12 rounded-2xl border border-line bg-surface p-6" aria-labelledby="sources">
            <h2 id="sources" className="mb-3 text-sm font-bold uppercase tracking-widest text-faint">Sources</h2>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted">
              {frontmatter.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">{s.label}</a>
                </li>
              ))}
            </ol>
          </section>
        )}

        <aside className="mt-6 flex gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5 text-sm leading-relaxed text-muted" aria-label="Disclaimer">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden />
          <p>
            General information, not financial, tax, legal or immigration advice. Figures come from the sources above as of the dates
            shown and can change; individual pay varies. Check the official source and a qualified professional before deciding.{' '}
            <Link href="/disclaimer" className="font-medium text-brand-600 hover:underline">Read the disclaimer</Link> ·{' '}
            <Link href="/contact" className="font-medium text-brand-600 hover:underline">Report an error</Link>
          </p>
        </aside>

        <aside className="mt-6 rounded-2xl border border-line bg-surface p-5 text-sm leading-relaxed text-muted" aria-label="About the editor">
          <p>
            <strong className="text-ink">{SITE.name} editorial.</strong> Researched from primary sources and edited by{' '}
            <Link href="/about" className="font-medium text-brand-600 hover:underline">{SITE.founder.name}</Link>. See how we work in our{' '}
            <Link href="/editorial-policy" className="font-medium text-brand-600 hover:underline">editorial policy</Link>.
          </p>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-5xl" aria-labelledby="related">
          <h2 id="related" className="mb-5 text-2xl font-bold text-ink">Continue your decision path</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {related.map((r) => (
              <PostCard key={r.slug} post={toCard(r)} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
