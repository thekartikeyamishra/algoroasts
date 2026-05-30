import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely (dedupes conflicting utilities). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Human-readable date, e.g. "May 30, 2026". Deterministic across server/client. */
export function formatDate(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** ISO date (YYYY-MM-DD) for schema + sitemaps. */
export function isoDate(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  return date.toISOString();
}

/**
 * Fire a short haptic pulse on supported devices (mobile PWA "physical feedback").
 * Safely no-ops where the Vibrate API is unavailable (desktop, iOS Safari, etc.).
 * @param pattern milliseconds, or a vibrate pattern array. Defaults to a light 10ms tap.
 */
export function haptic(pattern: number | number[] = 10): void {
  if (typeof navigator === 'undefined') return;
  try {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch {
    /* unsupported or blocked — non-fatal */
  }
}

