import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { getPostsByCategory } from '@/lib/content';

export const metadata: Metadata = buildMetadata({
  title: 'Skill Roadmaps',
  description: 'Visual, data-backed learning paths that tell you exactly what to learn next.',
  path: '/roadmaps',
});

export default function RoadmapsPage() {
  const roadmaps = getPostsByCategory('roadmaps');
  return (
    <div className="container-x py-16">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">Skill Roadmaps</h1>
        <p className="mt-4 text-lg text-slate-600">
          Data-backed paths. Each one tells you what to learn, in what order, and why the market rewards it.
        </p>
      </header>
      {roadmaps.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          Roadmaps are on the way. Publish posts in the <code>roadmaps</code> category to populate this page.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {roadmaps.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="glass-card rounded-2xl p-6 transition hover:shadow-lg">
              <h2 className="text-xl font-bold text-ink">{p.frontmatter.title}</h2>
              <p className="mt-2 text-slate-600">{p.frontmatter.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
