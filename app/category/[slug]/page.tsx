import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CATEGORIES, type CategorySlug } from '@/lib/site';
import { getPostsByCategory } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { DisplayAd } from '@/components/ads/AdSlots';

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) return buildMetadata();
  return buildMetadata({ title: cat.name, description: cat.description, path: `/category/${cat.slug}` });
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) notFound();
  const posts = getPostsByCategory(params.slug as CategorySlug);

  return (
    <div className="container-x py-16">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">{cat.name}</h1>
        <p className="mt-4 text-lg text-slate-600">{cat.description}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="glass-card rounded-2xl p-6 transition hover:shadow-lg">
            <h2 className="text-xl font-bold text-ink">{post.frontmatter.title}</h2>
            <p className="mt-2 text-slate-600">{post.frontmatter.description}</p>
            <p className="mt-4 text-xs text-slate-400">{formatDate(post.frontmatter.date)}</p>
          </Link>
        ))}
      </div>
      <DisplayAd />
    </div>
  );
}
