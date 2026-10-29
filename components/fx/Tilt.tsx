'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';

/** Gentle 3D tilt that follows the pointer (max ±6°). Fine pointers only; no effect on touch. */
export function Tilt({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={cn('tilt-3d', className)}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        ref.current.style.setProperty('--tx', `${(x * 12).toFixed(2)}deg`);
        ref.current.style.setProperty('--ty', `${(-y * 8).toFixed(2)}deg`);
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty('--tx', '0deg');
        ref.current?.style.setProperty('--ty', '0deg');
      }}
    >
      {children}
    </div>
  );
}
