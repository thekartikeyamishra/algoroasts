import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';
import { InArticleAd } from '@/components/ads/AdSlots';
import { AnswerBlock, Stat, KeyTakeaways, FAQ } from './AnswerBlock';

/**
 * Maps Markdown/MDX elements to styled, SEMANTIC HTML. RAG crawlers and AI engines
 * extract cleanly from strict semantic tags + real <table> markup — never from
 * div soup or images-of-text. Headings get autolinked anchors (via rehype plugins).
 */
export const mdxComponents: MDXComponents = {
  // Internal links use next/link for instant client navigation; external open safely.
  a: ({ href = '', children, ...props }) => {
    const isInternal = href.startsWith('/') || href.startsWith('#');
    if (isInternal) {
      return (
        <Link href={href} className="font-medium text-brand-600 underline-offset-2 hover:underline">
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600 underline-offset-2 hover:underline" {...props}>
        {children}
      </a>
    );
  },
  table: (props) => (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-line">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-canvas text-left" {...props} />,
  th: (props) => <th className="border-b border-line px-4 py-3 font-semibold text-ink" {...props} />,
  td: (props) => <td className="border-b border-line px-4 py-3 text-muted" {...props} />,
  // Custom components available inside any .mdx file:
  AnswerBlock,
  Stat,
  KeyTakeaways,
  FAQ,
  InArticleAd,
};
