import { ImageResponse } from 'next/og';
import { getPostBySlug, getPostSlugs } from '@/lib/content';
import { CATEGORIES, SITE } from '@/lib/site';

/**
 * Per-article Open Graph image (1200×630), generated at build time.
 * Replaces the missing /og/<slug>.png files that frontmatter used to reference (all 404s).
 */
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${SITE.name} guide`;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export default function OgImage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  const cat = CATEGORIES.find((c) => c.slug === post.frontmatter.category)?.name ?? '';
  const title = post.frontmatter.title;
  const fontSize = title.length > 80 ? 52 : title.length > 55 ? 60 : 68;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #020617 0%, #0f172a 55%, #1e1b4b 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              width: 52,
              height: 52,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #f97316, #ef4444 55%, #6366f1)',
            }}
          />
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>{SITE.name}</div>
          <div
            style={{
              marginLeft: 'auto',
              fontSize: 22,
              color: '#a5b4fc',
              border: '2px solid rgba(165,180,252,0.35)',
              borderRadius: 999,
              padding: '8px 22px',
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            {cat}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1040 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 24, color: '#94a3b8' }}>
          <div style={{ display: 'flex' }}>Source-cited · Decision-first</div>
          <div style={{ display: 'flex', height: 8, width: 260, borderRadius: 8, background: 'linear-gradient(90deg, #22d3ee, #6366f1)' }} />
        </div>
      </div>
    ),
    size,
  );
}
