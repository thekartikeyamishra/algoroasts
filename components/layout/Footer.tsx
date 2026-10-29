import Link from 'next/link';
import { SITE, CATEGORIES, LEGAL_LINKS, categoryHref } from '@/lib/site';
import { AppStoreButtons } from '@/components/invite/AppStoreButtons';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2" aria-label={`${SITE.name} home`}>
              <span className="text-2xl" aria-hidden>🔥</span>
              <span className="text-lg font-bold text-ink">{SITE.name}</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{SITE.tagline}</p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-faint">The app</p>
            <AppStoreButtons className="mt-3" />
          </div>

          <div className="md:col-span-3">
            <h2 className="text-sm font-semibold text-ink">Intelligence</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={categoryHref(c.slug)} className="text-muted transition hover:text-brand-600">
                    {c.name}
                  </Link>
                </li>
              ))}
              <li><Link href="/blog" className="text-muted transition hover:text-brand-600">All guides</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-sm font-semibold text-ink">Platform</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/tools" className="text-muted transition hover:text-brand-600">Free tools</Link></li>
              <li><Link href="/tools/contract-vs-full-time-calculator" className="text-muted transition hover:text-brand-600">Contract vs Full-Time</Link></li>
              <li><Link href="/roadmaps" className="text-muted transition hover:text-brand-600">Roadmaps</Link></li>
              <li><Link href="/invite" className="text-muted transition hover:text-brand-600">Request an invite</Link></li>
              <li><Link href="/about" className="text-muted transition hover:text-brand-600">About</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-sm font-semibold text-ink">Trust & legal</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-muted transition hover:text-brand-600">{l.label}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-4 text-sm">
              <a href={SITE.social.x} className="text-muted hover:text-brand-600" rel="me noopener noreferrer" target="_blank">X</a>
              <a href={SITE.social.linkedin} className="text-muted hover:text-brand-600" rel="me noopener noreferrer" target="_blank">LinkedIn</a>
              <a href={SITE.social.github} className="text-muted hover:text-brand-600" rel="me noopener noreferrer" target="_blank">GitHub</a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs leading-relaxed text-faint md:flex-row md:items-start md:justify-between">
          <p>© {year} {SITE.name}. Run by {SITE.founder.name}, {SITE.founder.location}.</p>
          <p className="max-w-xl md:text-right">
            General information only — not financial, tax, legal or immigration advice. Figures are estimates from cited
            public sources and can change. This site shows ads from Google; see our <Link href="/privacy" className="underline underline-offset-2 hover:text-brand-600">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
