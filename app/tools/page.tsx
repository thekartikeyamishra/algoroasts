import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calculator } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { collectionSchema } from '@/lib/schema';
import { TOOLS } from '@/lib/tools';
import { JsonLd } from '@/components/JsonLd';
import { InviteForm } from '@/components/invite/InviteForm';

const DESCRIPTION = 'Free, private calculators for developer career decisions: contract vs full-time, break-even rates and more. They run in your browser, with no sign-up.';

export const metadata: Metadata = buildMetadata({ title: 'Free Developer Career Tools', description: DESCRIPTION, path: '/tools' });

export default function ToolsPage() {
  return (
    <div className="container-x py-14">
      <JsonLd
        data={collectionSchema({
          name: 'Free Developer Career Tools',
          description: DESCRIPTION,
          path: '/tools',
          items: TOOLS.map((t) => ({ name: t.name, path: `/tools/${t.slug}` })),
        })}
      />
      <header className="max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">Free developer career tools</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{DESCRIPTION}</p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {TOOLS.map((t) => (
          <Link
            key={t.slug}
            href={`/tools/${t.slug}`}
            className="spotlight group flex flex-col rounded-3xl border border-line bg-surface p-7 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
              <Calculator className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-xl font-bold text-ink">{t.name}</h2>
            <p className="mt-2 flex-1 leading-relaxed text-muted">{t.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {t.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-canvas px-2.5 py-1 text-xs font-medium text-muted">{tag}</span>
              ))}
            </div>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
              Open the calculator <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}

        <div className="flex flex-col rounded-3xl border border-dashed border-line p-7">
          <h2 className="text-xl font-bold text-ink">Tell us what to build next</h2>
          <p className="mt-2 leading-relaxed text-muted">
            Ideas on the roadmap include an offer comparison that values equity and relocation. People on the invite list try
            new tools first and help decide which ones we build.
          </p>
          <InviteForm source="tools-index" compact className="mt-5" />
        </div>
      </div>
    </div>
  );
}
