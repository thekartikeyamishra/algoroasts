import Link from 'next/link';
import { SITE, LEGAL_LINKS } from '@/lib/site';
import { formatDate } from '@/lib/utils';

/** Shared shell for legal / trust pages: readable prose, last-updated date, sibling links. No ads. */
export function LegalPage({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <div className="container-x py-14">
      <div className="mx-auto max-w-prose">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-ink">{title}</h1>
          <p className="mt-3 text-sm text-faint">Last updated {formatDate(SITE.legalUpdated)}</p>
          <p className="mt-5 text-lg leading-relaxed text-muted">{intro}</p>
        </header>
        <div className="prose prose-slate dark:prose-invert prose-h2:mt-10 prose-h2:text-xl">{children}</div>
        <nav aria-label="Legal" className="mt-14 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-6 text-sm">
          {LEGAL_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-muted hover:text-brand-600">{l.label}</Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
