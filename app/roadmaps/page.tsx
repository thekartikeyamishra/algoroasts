import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { CATEGORIES } from '@/lib/site';
import { getPostsByCategory, toCard } from '@/lib/content';
import { breadcrumbSchema, collectionSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { PostCard } from '@/components/article/PostCard';

const cat = CATEGORIES.find((c) => c.slug === 'roadmaps')!;

export const metadata: Metadata = buildMetadata({
  title: 'Developer Skill Roadmaps — What to Learn Next',
  description: cat.description,
  path: '/roadmaps',
});

export default function RoadmapsPage() {
  const roadmaps = getPostsByCategory('roadmaps').map(toCard);
  return (
    <div className="container-x py-14">
      <JsonLd
        data={[
          collectionSchema({ name: cat.name, description: cat.description, path: '/roadmaps', items: roadmaps.map((p) => ({ name: p.title, path: `/blog/${p.slug}` })) }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: cat.name, path: '/roadmaps' },
          ]),
        ]}
      />
      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">Skill roadmaps</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{cat.intro}</p>
      </header>
      {roadmaps.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-line p-10 text-center text-muted">New roadmaps are being researched.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((p) => (
            <PostCard key={p.slug} post={p} headingLevel="h2" />
          ))}
        </div>
      )}
      <p className="mt-10 text-sm text-muted">
        Deciding between roles first? See <Link href="/blog/ml-engineer-vs-data-scientist-2026" className="text-brand-600 hover:underline">ML engineer vs data scientist</Link> and{' '}
        <Link href="/blog/platform-engineer-vs-devops-2026" className="text-brand-600 hover:underline">platform engineer vs DevOps</Link>.
      </p>
    </div>
  );
}
