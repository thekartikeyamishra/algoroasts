import Link from 'next/link';
import { SITE, CATEGORIES } from '@/lib/site';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-x py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>🔥</span>
              <span className="text-lg font-bold text-ink">{SITE.name}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-slate-500">{SITE.tagline}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Intelligence</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="text-slate-500 hover:text-brand-600">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Platform</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/blog" className="text-slate-500 hover:text-brand-600">All articles</Link></li>
              <li><Link href="/roadmaps" className="text-slate-500 hover:text-brand-600">Roadmaps</Link></li>
              <li><Link href="/about" className="text-slate-500 hover:text-brand-600">About</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Connect</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href={SITE.social.x} className="text-slate-500 hover:text-brand-600" rel="me noopener" target="_blank">X / Twitter</a></li>
              <li><a href={SITE.social.linkedin} className="text-slate-500 hover:text-brand-600" rel="me noopener" target="_blank">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>© {year} {SITE.name}. Decision intelligence for developers.</p>
          <p>Data-backed. Source-cited. {SITE.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
