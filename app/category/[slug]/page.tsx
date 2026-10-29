import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CATEGORIES, type CategorySlug, categoryHref } from '@/lib/site';
import { getPostsByCategory, toCard } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, collectionSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { PostCard } from '@/components/article/PostCard';
import { DisplayAd } from '@/components/ads/AdSlots';

export const dynamicParams = false;

export function generateStaticParams() {
  // Roadmaps has its own canonical hub at /roadmaps (see LEGACY_REDIRECTS).
  return CATEGORIES.filter((c) => c.slug !== 'roadmaps').map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) return buildMetadata({ noIndex: true });
  return buildMetadata({ title: `${cat.name} for Developers`, description: cat.description, path: `/category/${cat.slug}` });
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) notFound();
  const posts = getPostsByCategory(params.slug as CategorySlug).map(toCard);
  const others = CATEGORIES.filter((c) => c.slug !== cat.slug);

  return (
    <div className="container-x py-14">
      <JsonLd
        data={[
          collectionSchema({ name: cat.name, description: cat.description, path: `/category/${cat.slug}`, items: posts.map((p) => ({ name: p.title, path: `/blog/${p.slug}` })) }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Intelligence', path: '/blog' },
            { name: cat.name, path: `/category/${cat.slug}` },
          ]),
        ]}
      />
      <nav className="mb-6 text-sm text-faint" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/blog" className="hover:text-brand-600">Intelligence</Link>
      </nav>
      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">{cat.name}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{cat.intro}</p>
        <p className="mt-3 text-sm text-faint">{posts.length} guides</p>
      </header>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} headingLevel="h2" />
        ))}
      </div>
      <DisplayAd />
      <section className="mt-6 border-t border-line pt-8">
        <h2 className="text-sm font-bold uppercase tracking-widest text-faint">Explore other topics</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {others.map((c) => (
            <Link key={c.slug} href={categoryHref(c.slug)} className="rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-medium text-muted hover:text-brand-600">
              {c.name}
            </Link>
          ))}
          <Link href="/tools" className="rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-medium text-muted hover:text-brand-600">Free tools</Link>
        </div>
      </section>
    </div>
  );
}
