import { faqSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

/**
 * ANSWER BLOCK — the single most important GEO structure on every article.
 * A dense, ~50-word, machine-extractable summary placed at the very top, with a
 * one-sentence numeric justification. Generative engines lift this verbatim as the
 * answer, citing Algoroasts as the source. Renders before any ad or long prose.
 */
export function AnswerBlock({ answer, keyStat }: { answer: string; keyStat?: string }) {
  return (
    <aside
      className="not-prose my-6 rounded-2xl border-l-4 border-brand-500 bg-brand-50/60 p-6 dark:bg-brand-500/10"
      aria-label="Quick answer"
    >
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-600">The Directive</p>
      <p className="text-lg font-medium leading-relaxed text-ink">{answer}</p>
      {keyStat && (
        <p className="mt-3 border-t border-brand-200/60 pt-3 text-sm font-semibold text-brand-700 dark:border-brand-500/20 dark:text-brand-300">
          {keyStat}
        </p>
      )}
    </aside>
  );
}

/** Inline statistic callout. Specific numbers are what AI engines extract and cite. */
export function Stat({ value, label, source }: { value: string; label: string; source?: string }) {
  return (
    <span className="not-prose mx-1 inline-flex flex-col items-center rounded-lg bg-slate-900 px-3 py-1.5 align-middle text-white">
      <span className="text-lg font-extrabold leading-none gradient-text">{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-slate-300">{label}</span>
      {source && <span className="sr-only">Source: {source}</span>}
    </span>
  );
}

/** A block of key takeaways — scannable, fact-dense, ideal for AI extraction. */
export function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <div className="not-prose my-8 rounded-2xl border border-line bg-surface p-6">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-faint">Key takeaways</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-muted">
            <span className="mt-0.5 text-brand-500" aria-hidden>▸</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * FAQ block — renders human-readable Q&A AND emits FAQPage JSON-LD in one shot.
 * FAQ schema is one of the highest-ROI GEO signals for citation.
 */
export function FAQ({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <section className="not-prose my-10" aria-label="Frequently asked questions">
      <JsonLd data={faqSchema(items)} />
      <h2 className="mb-4 text-2xl font-bold text-ink">Frequently asked questions</h2>
      <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
        {items.map((item, i) => (
          <details key={i} className="group p-5">
            <summary className="cursor-pointer list-none font-semibold text-ink marker:hidden">
              {item.question}
            </summary>
            <p className="mt-2 text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
