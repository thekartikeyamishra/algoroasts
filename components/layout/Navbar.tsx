'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, HelpCircle } from 'lucide-react';
import { NAV_LINKS, SITE } from '@/lib/site';
import { StreakBadge } from '@/components/hook/HookActions';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const openTour = () => {
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('algoroasts:open-tour'));
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2" aria-label={`${SITE.name} home`}>
          <span className="text-2xl transition group-hover:scale-110" aria-hidden>🔥</span>
          <span className="text-xl font-bold tracking-tight text-ink">{SITE.name}</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={cn(
                'relative text-sm font-medium transition hover:text-brand-600',
                isActive(link.href) ? 'text-brand-600' : 'text-muted',
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute -bottom-[21px] left-0 h-0.5 w-full bg-brand-600" aria-hidden />
              )}
            </Link>
          ))}
          <StreakBadge />
          <button
            type="button"
            onClick={openTour}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-brand-600"
          >
            <HelpCircle className="h-4 w-4" /> How it works
          </button>
          <ThemeToggle />
          <Link
            href="/invite"
            className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-sm font-semibold text-canvas transition hover:opacity-90 active:scale-95"
          >
            Request invite
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink transition active:scale-95"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className={cn('border-t border-line bg-surface md:hidden', open ? 'block' : 'hidden')}>
        <div className="container-x flex flex-col gap-1 py-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-canvas',
                isActive(link.href) ? 'text-brand-600' : 'text-ink',
              )}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={openTour}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-ink transition hover:bg-canvas"
          >
            <HelpCircle className="h-4 w-4" /> How it works
          </button>
          <Link
            href="/invite"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-lg bg-ink px-3 py-2.5 text-center text-sm font-semibold text-canvas"
          >
            Request an invite
          </Link>
          <div className="px-3 py-2">
            <StreakBadge />
          </div>
        </div>
      </div>
    </nav>
  );
}
