import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({ title: 'Page not found', noIndex: true });

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="text-6xl" aria-hidden>🔥</p>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink">This page doesn’t exist (any more)</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">It may have moved. These are the most useful places to go next:</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/tools/contract-vs-full-time-calculator" className="rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700">Contract vs Full-Time Calculator</Link>
        <Link href="/blog" className="rounded-xl border border-line bg-surface px-5 py-2.5 font-semibold text-ink hover:border-brand-300">Search all guides</Link>
        <Link href="/" className="rounded-xl border border-line bg-surface px-5 py-2.5 font-semibold text-ink hover:border-brand-300">Home</Link>
      </div>
    </div>
  );
}
