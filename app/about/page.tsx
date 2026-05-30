import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'About',
  description: `What ${SITE.name} is and how it produces decision-grade developer intelligence.`,
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-prose prose prose-slate prose-lg dark:prose-invert">
        <h1>About {SITE.name}</h1>
        <p className="lead text-xl text-muted">{SITE.tagline}</p>
        <p>
          {SITE.name} is a Developer Decision Intelligence Platform. General-purpose AI tells you
          what exists. We synthesize real market data, salary trends, and visual skill roadmaps into a
          single directive: what to do next.
        </p>
        <h2>How we work</h2>
        <p>
          Every article opens with a dense, source-cited directive, backs each claim with verifiable
          numbers, and links to the primary sources. We publish data, not opinion.
        </p>
      </div>
    </div>
  );
}
