'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * THEME ENGINE
 * ------------
 * Three modes: 'light' | 'dark' | 'system'. The resolved theme (the one actually
 * applied) is derived from the mode plus the OS preference. We toggle a `.dark`
 * class on <html>, which every semantic Tailwind token keys off (see globals.css).
 *
 * Flash-of-wrong-theme is prevented by the inline script in app/layout.tsx, which
 * sets the class BEFORE first paint. This provider then takes over on hydration.
 */

export type ThemeMode = 'light' | 'dark' | 'system';
type Resolved = 'light' | 'dark';

const STORAGE_KEY = 'algoroasts:theme';

interface ThemeContextValue {
  mode: ThemeMode;
  resolved: Resolved;
  setMode: (m: ThemeMode) => void;
  /** Cycles light → dark → system → light. */
  cycle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyClass(resolved: Resolved) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [resolved, setResolved] = useState<Resolved>('light');

  // Hydrate stored preference on mount.
  useEffect(() => {
    let stored: ThemeMode = 'system';
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (raw === 'light' || raw === 'dark' || raw === 'system') stored = raw;
    } catch {
      /* storage blocked — default to system */
    }
    setModeState(stored);
    const r: Resolved = stored === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : stored;
    setResolved(r);
    applyClass(r);
  }, []);

  // Keep in sync with OS changes while in 'system' mode.
  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const r: Resolved = mq.matches ? 'dark' : 'light';
      setResolved(r);
      applyClass(r);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [mode]);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    try {
      window.localStorage.setItem(STORAGE_KEY, m);
    } catch {
      /* non-fatal */
    }
    const r: Resolved = m === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : m;
    setResolved(r);
    applyClass(r);
  }, []);

  const cycle = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light');
  }, [mode, setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, resolved, setMode, cycle }),
    [mode, resolved, setMode, cycle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}
