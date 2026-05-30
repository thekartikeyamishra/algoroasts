import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { CategorySlug } from './site';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

/**
 * Frontmatter contract. EVERY .mdx file in content/posts MUST provide these fields.
 * The build will throw a clear error if a required field is missing (see assertFrontmatter).
 */
export interface PostFrontmatter {
  title: string;
  /** 50-word machine-extractable summary. Rendered as the Answer Block + meta description. */
  answer: string;
  description: string;
  category: CategorySlug;
  /** ISO date string, e.g. "2026-05-30". */
  date: string;
  updated?: string;
  author?: string;
  /** Open Graph image path relative to /public, e.g. "/og/ai-salary.png". */
  image?: string;
  tags?: string[];
  /** Slugs of related posts for internal linking (the link graph that powers topical authority). */
  related?: string[];
  /** Set true to exclude from listings + sitemap (drafts). */
  draft?: boolean;
  /** One-sentence numeric justification shown directly under the Answer Block. */
  keyStat?: string;
  /** Author/source citations rendered in the schema + footer (GEO trust vector). */
  sources?: { label: string; url: string }[];
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTimeMinutes: number;
}

function validateFrontmatter(data: Record<string, unknown>, slug: string): PostFrontmatter {
  const required = ['title', 'answer', 'description', 'category', 'date'] as const;
  for (const field of required) {
    if (!data[field]) {
      throw new Error(
        `[content] Post "${slug}" is missing required frontmatter field: "${field}". ` +
          `Every post must define: ${required.join(', ')}.`,
      );
    }
  }
  return data as unknown as PostFrontmatter;
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const frontmatter = validateFrontmatter(data, slug);
  return {
    slug,
    frontmatter,
    content,
    readingTimeMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
  };
}

/** All non-draft posts, newest first. */
export function getAllPosts(): Post[] {
  return getPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((post) => !post.frontmatter.draft)
    .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date));
}

export function getPostsByCategory(category: CategorySlug): Post[] {
  return getAllPosts().filter((p) => p.frontmatter.category === category);
}
