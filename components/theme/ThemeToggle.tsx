'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme, type ThemeMode } from './ThemeProvider';
import { haptic } from '@/lib/utils';

const LABEL: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

/**
 * Theme cycle button: light → dark → system. Shows the icon for the CURRENT mode
 * and announces the next action to assistive tech. Renders a stable placeholder
 * until mounted to avoid hydration mismatch (server can't know the resolved theme).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { mode, cycle } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const Icon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor;
  const next = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';

  return (
    <button
      type="button"
      onClick={() => {
        haptic(8);
        cycle();
      }}
      aria-label={mounted ? `Theme: ${LABEL[mode]}. Switch to ${LABEL[next]}.` : 'Toggle theme'}
      title={mounted ? `Theme: ${LABEL[mode]} (tap for ${LABEL[next]})` : 'Toggle theme'}
      className={[
        'inline-flex h-9 w-9 items-center justify-center rounded-full border border-line',
        'bg-surface text-muted transition active:scale-95 hover:text-brand-600 hover:border-brand-200',
        className ?? '',
      ].join(' ')}
    >
      {mounted ? <Icon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px] opacity-0" />}
    </button>
  );
}
