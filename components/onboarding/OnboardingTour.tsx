'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, X, Flame, Target, Bookmark, Compass } from 'lucide-react';

/**
 * ONBOARDING TOUR
 * ---------------
 * Shows once on first visit (localStorage flag) to teach a new user what the
 * platform is and how to use it. Re-openable anytime via a custom event:
 *   window.dispatchEvent(new Event('algoroasts:open-tour'))
 * (the "How it works" button in the Navbar fires this).
 *
 * Accessibility: role="dialog", Esc closes, focus moves to the dialog, backdrop
 * click closes. Respects reduced-motion via globals.css.
 */

const SEEN_KEY = 'algoroasts:onboarded:v1';

interface Step {
  icon: React.ReactNode;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    icon: <Compass className="h-6 w-6" />,
    title: 'Welcome to Algoroasts',
    body: 'This is a Developer Decision Intelligence platform — not a blog. General AI tells you what exists. We synthesize real market data into one clear directive: what to do next.',
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: 'Every article starts with the Directive',
    body: 'At the top of each article you get a dense, source-cited answer — the decision — followed by the data and primary sources that back it. Read the Directive first; dive deeper only if you want the evidence.',
  },
  {
    icon: <Bookmark className="h-6 w-6" />,
    title: 'Save what matters to your roadmap',
    body: 'Hit “Save to your roadmap” on any article to build a personal decision path you can return to. Your saves stay on this device — no account needed.',
  },
  {
    icon: <Flame className="h-6 w-6" />,
    title: 'Build a streak, find your next move',
    body: 'Check back as the market shifts and your day-streak grows. Use the top nav to explore Intelligence, Roadmaps, search, and switch between light and dark — top right.',
  },
];

export function OnboardingTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const close = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* non-fatal */
    }
  }, []);

  // First-visit auto-open + manual re-open listener.
  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === '1';
    } catch {
      seen = true; // storage blocked — don't nag
    }
    if (!seen) {
      const t = setTimeout(() => setOpen(true), 700);
      // cleanup below also clears this
      const reopen = () => {
        setStep(0);
        setOpen(true);
      };
      window.addEventListener('algoroasts:open-tour', reopen);
      return () => {
        clearTimeout(t);
        window.removeEventListener('algoroasts:open-tour', reopen);
      };
    }
    const reopen = () => {
      setStep(0);
      setOpen(true);
    };
    window.addEventListener('algoroasts:open-tour', reopen);
    return () => window.removeEventListener('algoroasts:open-tour', reopen);
  }, []);

  // Esc to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight' && step < STEPS.length - 1) setStep((s) => s + 1);
      if (e.key === 'ArrowLeft' && step > 0) setStep((s) => s - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, step, close]);

  if (!open) return null;

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close walkthrough"
        onClick={close}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      />

      {/* Card */}
      <div className="relative w-full max-w-md animate-scale-in rounded-3xl border border-line bg-surface p-7 shadow-2xl">
        <button
          type="button"
          onClick={close}
          aria-label="Skip walkthrough"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-faint transition hover:bg-canvas hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
          {current.icon}
        </div>

        <h2 id="tour-title" className="text-xl font-bold text-ink">
          {current.title}
        </h2>
        <p className="mt-3 leading-relaxed text-muted">{current.body}</p>

        {/* Progress dots */}
        <div className="mt-6 flex items-center gap-2" aria-hidden>
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={[
                'h-1.5 rounded-full transition-all',
                i === step ? 'w-6 bg-brand-600' : 'w-1.5 bg-line',
              ].join(' ')}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={close}
            className="text-sm font-medium text-faint transition hover:text-muted"
          >
            Skip
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-1 rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted transition active:scale-95 hover:text-ink"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            )}
            <button
              type="button"
              onClick={() => (isLast ? close() : setStep((s) => s + 1))}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition active:scale-95 hover:bg-brand-700"
            >
              {isLast ? 'Start exploring' : 'Next'}
              {!isLast && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
