import { SITE, CATEGORIES, categoryHref, absoluteUrl } from '@/lib/site';
import { getAllPosts } from '@/lib/content';
import { TOOLS } from '@/lib/tools';

/**
 * /llms.txt — a plain-text map of the site for AI assistants and agents (llmstxt.org proposal).
 * It is not a ranking factor; it simply makes it easy for an AI to find and cite the right page.
 */
export const dynamic = 'force-static';

export function GET() {
  const posts = getAllPosts();
  const lines: string[] = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `${SITE.name} publishes source-cited career guidance for software developers. Each guide opens with a direct recommendation ("the directive") and lists its primary sources. Run by ${SITE.founder.name} (${SITE.founder.location}). Content is general information, not financial, tax, legal or immigration advice.`,
    '',
    '## Tools',
    ...TOOLS.map((t) => `- [${t.name}](${absoluteUrl(`/tools/${t.slug}`)}): ${t.description}`),
    '',
    ...CATEGORIES.flatMap((c) => [
      `## ${c.name}`,
      `- [${c.name} hub](${absoluteUrl(categoryHref(c.slug))}): ${c.description}`,
      ...posts
        .filter((p) => p.frontmatter.category === c.slug)
        .map((p) => `- [${p.frontmatter.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${p.frontmatter.description}`),
      '',
    ]),
    '## About and policies',
    `- [About](${absoluteUrl('/about')})`,
    `- [Editorial policy](${absoluteUrl('/editorial-policy')})`,
    `- [Disclaimer](${absoluteUrl('/disclaimer')})`,
    `- [Privacy policy](${absoluteUrl('/privacy')})`,
    `- [Contact](${absoluteUrl('/contact')})`,
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600, s-maxage=86400' },
  });
}
