'use client';

import { useEffect, useRef } from 'react';

/**
 * SIGNAL FIELD — the interactive hero backdrop.
 * A grid of points that brighten and lean toward the cursor (or finger), with a slow ambient
 * "market pulse" wave on desktop. One <canvas>, zero dependencies.
 *
 * Performance budget (keeps Total Blocking Time and INP low):
 *  - starts only after the page is idle (never competes with first paint / hydration);
 *  - capped at ~30 fps; dots are batched into 8 brightness buckets (8 fills per frame, not N);
 *  - touch devices get no ambient loop — they redraw only while a finger moves;
 *  - pauses off-screen / in background tabs; reduced-motion users get a single static frame.
 */
const BUCKETS = 8;

export function SignalField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const ambient = !reduced && !coarse;

    let width = 0;
    let height = 0;
    let xs = new Float32Array(0);
    let ys = new Float32Array(0);
    let raf = 0;
    let last = 0;
    let visible = true;
    let started = false;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };

    const colors = Array.from({ length: BUCKETS }, (_, i) => {
      const g = i / (BUCKETS - 1);
      const r = Math.round(99 + (34 - 99) * g);
      const gg = Math.round(102 + (211 - 102) * g);
      const b = Math.round(241 + (238 - 241) * g);
      return `rgba(${r},${gg},${b},${(0.16 + g * 0.74).toFixed(3)})`;
    });

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(coarse ? 1.5 : 2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = width < 640 ? 30 : 34;
      const px: number[] = [];
      const py: number[] = [];
      for (let y = gap / 2; y < height; y += gap) for (let x = gap / 2; x < width; x += gap) { px.push(x); py.push(y); }
      xs = Float32Array.from(px);
      ys = Float32Array.from(py);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.18;
      pointer.y += (pointer.ty - pointer.y) * 0.18;
      const radius = Math.max(140, Math.min(width, height) * 0.32);
      const time = t / 1000;
      const paths = Array.from({ length: BUCKETS }, () => new Path2D());
      for (let i = 0; i < xs.length; i++) {
        const px = xs[i];
        const py = ys[i];
        const dx = pointer.x - px;
        const dy = pointer.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const near = pointer.active && dist < radius ? 1 - dist / radius : 0;
        const wave = ambient ? (Math.sin(px * 0.012 + py * 0.008 - time * 1.1) + 1) * 0.14 : 0.06;
        const glow = near > wave ? near : wave;
        const pull = near * 10;
        const x = dist > 0 ? px + (dx / dist) * pull : px;
        const y = dist > 0 ? py + (dy / dist) * pull : py;
        const size = 0.9 + glow * 1.9;
        const bucket = Math.min(BUCKETS - 1, Math.floor(glow * BUCKETS));
        paths[bucket].moveTo(x + size, y);
        paths[bucket].arc(x, y, size, 0, Math.PI * 2);
      }
      for (let b = 0; b < BUCKETS; b++) {
        ctx.fillStyle = colors[b];
        ctx.fill(paths[b]);
      }
    };

    const loop = (t: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      if (t - last >= 33) {
        last = t;
        draw(t);
      }
      const settling = Math.abs(pointer.tx - pointer.x) + Math.abs(pointer.ty - pointer.y) > 0.5;
      if (ambient || settling) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (started && !raf && !reduced) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      if (!pointer.active) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
      pointer.active = true;
      if (reduced) draw(0);
      else kick();
    };
    const onLeave = () => {
      pointer.active = false;
      if (reduced) draw(0);
      else kick();
    };

    build();
    draw(0); // static first frame (cheap, no animation yet)

    // Start the loop only once the browser is idle after load.
    const idle = (cb: () => void) => {
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
      if (typeof w.requestIdleCallback === 'function') w.requestIdleCallback(cb, { timeout: 2500 });
      else setTimeout(cb, 1200);
    };
    idle(() => {
      started = true;
      kick();
    });

    const host = canvas.parentElement ?? canvas;
    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerleave', onLeave, { passive: true });
    const ro = new ResizeObserver(() => {
      build();
      draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(canvas);
    const onVis = () => !document.hidden && kick();
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
