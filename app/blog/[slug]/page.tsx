import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';

import { getAllPosts, getPostBySlug, getPostSlugs } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { articleSchema, breadcrumbSchema } from '@/lib/schema';
import { CATEGORIES, absoluteUrl } from '@/lib/site';
import { formatDate } from '@/lib/utils';
import { JsonLd } from '@/components/JsonLd';
import { mdxComponents } from '@/components/article/MdxComponents';
import { AnswerBlock } from '@/components/article/AnswerBlock';
import { InArticleAd } from '@/components/ads/AdSlots';
import { AD_SLOTS } from '@/components/ads/slots';
import { SaveButton } from '@/components/hook/HookActions';
import { ReadingProgress } from '@/components/ui/ReadingProgress';

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
      image: frontmatter.image,
      type: 'article',
      publishedTime: new Date(frontmatter.date).toISOString(),
      modifiedTime: new Date(frontmatter.updated ?? frontmatter.date).toISOString(),
      tags: frontmatter.tags,
      noIndex: frontmatter.draft,
    });
  } catch {
    return buildMetadata();
  }
}

const rehypePrettyCodeOptions = { theme: 'github-dark', keepBackground: false };

export default function ArticlePage({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  const { frontmatter, content, slug, readingTimeMinutes } = post;
  const category = CATEGORIES.find((c) => c.slug === frontmatter.category);
  const related = (frontmatter.related ?? [])
    .map((s) => getAllPosts().find((p) => p.slug === s))
    .filter(Boolean);

  return (
    <article className="container-x py-12">
      <ReadingProgress />
      <JsonLd
        data={[
          articleSchema(post),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Intelligence', path: '/blog' },
            { name: category?.name ?? 'Article', path: `/category/${frontmatter.category}` },
            { name: frontmatter.title, path: `/blog/${slug}` },
          ]),
        ]}
      />

      <div className="mx-auto max-w-prose animate-fade-in">
        {/* Breadcrumb (human-visible, mirrors schema) */}
        <nav className="mb-6 text-sm text-faint" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/blog" className="hover:text-brand-600">Intelligence</Link>
          <span className="mx-1.5">/</span>
          <Link href={`/category/${frontmatter.category}`} className="hover:text-brand-600">
            {category?.name}
          </Link>
        </nav>

        <header className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
            {category?.name}
          </span>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            {frontmatter.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-faint">
            <span>{frontmatter.author ?? 'Algoroasts Editorial'}</span>
            <span aria-hidden>·</span>
            <time dateTime={new Date(frontmatter.date).toISOString()}>{formatDate(frontmatter.date)}</time>
            <span aria-hidden>·</span>
            <span>{readingTimeMinutes} min read</span>
          </div>
          <div className="mt-5">
            <SaveButton slug={slug} />
          </div>
        </header>

        {/* GEO Answer Block — extracted by AI engines as the cited answer */}
        <AnswerBlock answer={frontmatter.answer} keyStat={frontmatter.keyStat} />

        {/* High-yield in-article ad immediately after the answer, before deep prose */}
        <InArticleAd slot={AD_SLOTS.inArticleTop} />

        {/* The MDX body */}
        <div className="prose prose-slate prose-lg dark:prose-invert">
          <MDXRemote
            source={content}
            components={mdxComponents}
            options={{
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

        {/* Sources — GEO "trust vector"; cited primary sources earn AI citations */}
        {frontmatter.sources && frontmatter.sources.length > 0 && (
          <section className="mt-12 rounded-2xl border border-line bg-surface p-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-faint">Sources</h2>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted">
              {frontmatter.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Internal link graph — drives topical authority + keeps users on-site */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-bold text-ink">Continue your decision path</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r!.slug}
                  href={`/blog/${r!.slug}`}
                  className="glass-card rounded-xl p-4 transition hover:shadow-md"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                    {CATEGORIES.find((c) => c.slug === r!.frontmatter.category)?.name}
                  </span>
                  <p className="mt-1 font-semibold text-ink">{r!.frontmatter.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
