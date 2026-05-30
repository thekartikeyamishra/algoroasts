'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * HOOK MODEL ENGINE (Nir Eyal, "Hooked")
 * ---------------------------------------
 * Trigger → Action → Variable Reward → Investment, then loop.
 *
 *  - INVESTMENT: users save articles/roadmaps and build a return streak. Stored
 *    state increases switching cost and seeds future internal triggers.
 *  - VARIABLE REWARD: streak milestones + a rotating "what changed since you left"
 *    surface (see hook/ReturnReward.tsx) deliver unpredictable value on return.
 *  - INTERNAL TRIGGER: over time, "checking what the market did" becomes a habit
 *    associated with the user's own career anxiety — the strongest trigger type.
 *
 * Persistence is localStorage (first-party, no backend needed for Phase 1).
 * All reads are guarded for SSR (window undefined) so this is hydration-safe.
 */

const STORAGE_KEY = 'algoroasts:hook:v1';

interface HookState {
  savedSlugs: string[];
  visitDates: string[]; // ISO yyyy-mm-dd, unique days visited
  lastVisit: string | null;
}

interface HookContextValue extends HookState {
  streak: number;
  isSaved: (slug: string) => boolean;
  toggleSave: (slug: string) => void;
}

const HookContext = createContext<HookContextValue | null>(null);

const today = () => new Date().toISOString().slice(0, 10);

function loadState(): HookState {
  if (typeof window === 'undefined') return { savedSlugs: [], visitDates: [], lastVisit: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as HookState;
  } catch {
    /* corrupt or unavailable — fall through to default */
  }
  return { savedSlugs: [], visitDates: [], lastVisit: null };
}

function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const set = new Set(dates);
  let streak = 0;
  const cursor = new Date();
  // Count consecutive days ending today (or yesterday if not yet visited today).
  if (!set.has(cursor.toISOString().slice(0, 10))) cursor.setDate(cursor.getDate() - 1);
  while (set.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function HookProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HookState>({ savedSlugs: [], visitDates: [], lastVisit: null });

  // Hydrate from storage and record today's visit on mount.
  useEffect(() => {
    const loaded = loadState();
    const day = today();
    const visitDates = loaded.visitDates.includes(day) ? loaded.visitDates : [...loaded.visitDates, day];
    // Keep last 90 days only.
    const trimmed = visitDates.slice(-90);
    const next = { ...loaded, visitDates: trimmed, lastVisit: loaded.lastVisit };
    setState({ ...next, lastVisit: loaded.visitDates.at(-1) ?? null });
    persist({ ...next });
  }, []);

  const persist = (next: HookState) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage full / blocked — non-fatal */
    }
  };

  const toggleSave = useCallback((slug: string) => {
    setState((prev) => {
      const savedSlugs = prev.savedSlugs.includes(slug)
        ? prev.savedSlugs.filter((s) => s !== slug)
        : [...prev.savedSlugs, slug];
      const next = { ...prev, savedSlugs };
      persist(next);
      return next;
    });
  }, []);

  const isSaved = useCallback((slug: string) => state.savedSlugs.includes(slug), [state.savedSlugs]);

  const value = useMemo<HookContextValue>(
    () => ({ ...state, streak: computeStreak(state.visitDates), isSaved, toggleSave }),
    [state, isSaved, toggleSave],
  );

  return <HookContext.Provider value={value}>{children}</HookContext.Provider>;
}

export function useHook(): HookContextValue {
  const ctx = useContext(HookContext);
  if (!ctx) throw new Error('useHook must be used within <HookProvider>');
  return ctx;
}
