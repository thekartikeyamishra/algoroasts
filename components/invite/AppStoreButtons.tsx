import { SITE } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * Play Store / App Store buttons driven by SITE.apps in lib/site.ts.
 *  - URL is null  → a non-clickable "Coming soon" badge (aria-disabled, no dead link).
 *  - URL is set   → a real outbound link to the store listing.
 * When the apps go live, consider swapping these for the official store badges, which Google
 * and Apple provide with their own usage guidelines.
 */
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path d="M4 3.5v17a1 1 0 0 0 1.5.87l14.5-8.5a1 1 0 0 0 0-1.74L5.5 2.63A1 1 0 0 0 4 3.5Z" fill="currentColor" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="6" y="2.5" width="12" height="19" rx="3" />
      <path d="M10.5 18.5h3" strokeLinecap="round" />
    </svg>
  );
}

function StoreButton({ href, top, bottom, icon }: { href: string | null; top: string; bottom: string; icon: React.ReactNode }) {
  const inner = (
    <>
      <span className="shrink-0">{icon}</span>
      <span className="flex flex-col text-left leading-tight">
        <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">{href ? top : 'Coming soon'}</span>
        <span className="text-[15px] font-semibold">{bottom}</span>
      </span>
    </>
  );
  const base = 'inline-flex h-14 min-w-[11.5rem] items-center gap-3 rounded-2xl border px-4 transition';
  if (!href) {
    return (
      <span
        role="link"
        aria-disabled="true"
        title={`${bottom} app — coming soon`}
        className={cn(base, 'cursor-not-allowed border-line bg-surface text-muted')}
      >
        {inner}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(base, 'border-ink bg-ink text-canvas hover:-translate-y-0.5 hover:shadow-lg')}
    >
      {inner}
    </a>
  );
}

export function AppStoreButtons({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      <StoreButton href={SITE.apps.playStore} top="Get it on" bottom="Google Play" icon={<PlayIcon />} />
      <StoreButton href={SITE.apps.appStore} top="Download on the" bottom="App Store" icon={<PhoneIcon />} />
    </div>
  );
}
