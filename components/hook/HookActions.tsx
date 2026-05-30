'use client';

import { Bookmark, BookmarkCheck, Flame } from 'lucide-react';
import { useHook } from './HookProvider';
import { cn, haptic } from '@/lib/utils';

/**
 * INVESTMENT action: saving an article stores user data that (a) raises switching
 * cost and (b) becomes the basis for future personalized triggers ("the framework
 * you saved dropped 14% in demand"). This is the loop's flywheel.
 */
export function SaveButton({ slug, className }: { slug: string; className?: string }) {
  const { isSaved, toggleSave } = useHook();
  const saved = isSaved(slug);

  return (
    <button
      type="button"
      onClick={() => {
        haptic(saved ? 8 : [10, 30, 10]);
        toggleSave(slug);
      }}
      aria-pressed={saved}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition',
        saved
          ? 'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/15 dark:text-brand-300'
          : 'border-line bg-surface text-muted hover:border-brand-200 hover:text-brand-600',
        className,
      )}
    >
      {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {saved ? 'Saved to your roadmap' : 'Save to your roadmap'}
    </button>
  );
}

/**
 * VARIABLE REWARD surface: the streak badge. Returning developers see their
 * consecutive-day streak — an unpredictable, escalating reward that reinforces
 * the habit of "checking the market" daily.
 */
export function StreakBadge({ className }: { className?: string }) {
  const { streak } = useHook();
  if (streak < 2) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30',
        className,
      )}
      title={`You've checked the market ${streak} days in a row`}
    >
      <Flame className="h-3.5 w-3.5" />
      {streak}-day streak
    </span>
  );
}
