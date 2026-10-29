import type { Metadata } from 'next';
import { getAllPosts, toCard } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { collectionSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { BlogSearch } from '@/components/article/BlogSearch';

const DESCRIPTION =
  'Source-cited guides for software developers: salaries by country, contractor rates, relocation and visas, AI engineering skills and learning roadmaps.';

export const metadata: Metadata = buildMetadata({
  title: 'Developer Career Guides — Salaries, Rates, Relocation & Skills',
  description: DESCRIPTION,
  path: '/blog',
});

export default function BlogIndexPage() {
  const posts = getAllPosts().map(toCard);

  return (
    <div className="container-x py-14">
      <JsonLd
        data={collectionSchema({
          name: 'Developer career guides',
          description: DESCRIPTION,
          path: '/blog',
          items: posts.map((p) => ({ name: p.title, path: `/blog/${p.slug}` })),
        })}
      />
      <header className="mb-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">Developer intelligence</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Every guide opens with a recommendation, backs it with numbers from primary sources, and links to those sources so you can
          check them.
        </p>
      </header>
      <BlogSearch posts={posts} />
    </div>
  );
}
