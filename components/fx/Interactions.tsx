'use client';

import { useEffect } from 'react';

/**
 * SPOTLIGHT — one global, passive pointer listener: any element with `.spotlight` gets --mx/--my
 * CSS vars so a soft radial glow follows the cursor across it (see globals.css). Fine pointers only.
 * (Scroll reveals are pure CSS — see [data-reveal] in globals.css.)
 */
export function Interactions() {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return;
    let raf = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      raf = 0;
      if (!last) return;
      const target = (last.target as HTMLElement | null)?.closest?.('.spotlight') as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--mx', `${last.clientX - rect.left}px`);
      target.style.setProperty('--my', `${last.clientY - rect.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
