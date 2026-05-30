'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, Map, Info } from 'lucide-react';
import { haptic } from '@/lib/utils';

/**
 * Thumb-first bottom navigation (mobile only). Big tap targets in the natural
 * thumb zone, active-route highlighting, hidden on >=md where the top nav serves.
 */
const ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/blog', label: 'Intel', icon: Newspaper },
  { href: '/roadmaps', label: 'Roadmaps', icon: Map },
  { href: '/about', label: 'About', icon: Info },
];

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/90 backdrop-blur-md md:hidden"
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                onClick={() => haptic(6)}
                className={[
                  'flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition active:scale-95',
                  active ? 'text-brand-600' : 'text-faint hover:text-muted',
                ].join(' ')}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
