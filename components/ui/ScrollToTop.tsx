'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/** Floating "back to top" affordance. Appears after the user scrolls ~600px. */
export function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-20 right-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-lg backdrop-blur transition active:scale-95 hover:text-brand-600 sm:bottom-6"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
