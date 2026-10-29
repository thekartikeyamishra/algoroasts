import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE, CATEGORIES } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';
import { getAllPosts, countDistinctSources } from '@/lib/content';
import { TOOLS } from '@/lib/tools';
import { JsonLd } from '@/components/JsonLd';
import { founderSchema } from '@/lib/schema';

export const metadata: Metadata = buildMetadata({
  title: 'About',
  description: `Who runs ${SITE.name}, why it exists, how it is funded and how it produces source-cited career guidance for software developers.`,
  path: '/about',
});

export default function AboutPage() {
  const posts = getAllPosts().length;
  const sources = countDistinctSources();
  return (
    <div className="container-x py-16">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'AboutPage', url: `${SITE.url}/about`, mainEntity: founderSchema() }} />
      <div className="mx-auto max-w-prose prose prose-slate prose-lg dark:prose-invert">
        <h1>About {SITE.name}</h1>
        <p className="lead">{SITE.tagline}</p>
        <p>
          Developers don’t lack information. They lack direction. Search “should I take this contract?” or “is Canada better than the US
          for engineers?” and you get a thousand lists and no answer. {SITE.name} exists to give you the answer — and the evidence, so you
          can check it.
        </p>

        <h2>What you’ll find here</h2>
        <ul>
          <li>
            <strong>{posts} decision guides</strong> across {CATEGORIES.map((c) => c.name).join(', ')}, each opening with a direct
            recommendation and closing with its sources ({sources} distinct primary sources cited so far).
          </li>
          <li>
            <strong>{TOOLS.length === 1 ? 'A free calculator' : `${TOOLS.length} free calculators`}</strong>, starting with the{' '}
            <Link href="/tools/contract-vs-full-time-calculator">Contract vs Full-Time Calculator</Link>, which runs in your browser and
            shows its formula.
          </li>
          <li>
            <strong>An app in development</strong>, currently in invite-only early access. <Link href="/invite">Request an invite</Link>.
          </li>
        </ul>

        <h2>Who runs it</h2>
        <p>
          {SITE.name} is built and edited by <strong>{SITE.founder.name}</strong>, an independent full-stack developer and founder based in{' '}
          {SITE.founder.location}, who builds web, mobile and AI products for Indian and international markets. You can find him on{' '}
          <a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer me">LinkedIn</a>,{' '}
          <a href={SITE.social.x} target="_blank" rel="noopener noreferrer me">X</a> and{' '}
          <a href={SITE.social.github} target="_blank" rel="noopener noreferrer me">GitHub</a>.
        </p>

        <h2>How we work</h2>
        <p>
          Every guide is built on primary sources — government labour statistics, tax authorities, immigration departments and official
          documentation — and says clearly where your situation might change the answer. Read the full{' '}
          <Link href="/editorial-policy">Editorial Policy</Link>.
        </p>

        <h2>How we’re funded</h2>
        <p>
          The site is free and funded by advertising from Google. Advertisers have no say over our content and we don’t accept paid
          editorial placements. See the <Link href="/privacy">Privacy Policy</Link> for how ads use cookies.
        </p>

        <h2>Get in touch</h2>
        <p>
          Corrections, suggestions and partnership enquiries: <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a> or the{' '}
          <Link href="/contact">contact page</Link>.
        </p>
      </div>
    </div>
  );
}
