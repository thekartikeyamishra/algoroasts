'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Check, Loader2, Send } from 'lucide-react';

type Status = 'idle' | 'loading' | 'done' | 'error';

const input =
  'w-full rounded-xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-faint transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const startedAt = useRef(Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name: f.get('name'),
          email: f.get('email'),
          message: f.get('message'),
          consent: f.get('consent') === 'on',
          website: f.get('website'),
          source: 'contact-page',
          startedAt: startedAt.current,
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(data.error || 'Something went wrong.');
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'done') {
    return (
      <p className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 font-medium text-ink" role="status">
        <Check className="h-5 w-5 text-emerald-500" /> Thanks — your message is in. We usually reply within a few working days.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-[13px] font-medium text-ink">
          Name
          <input name="name" autoComplete="name" maxLength={80} className={`${input} mt-1.5 h-11`} />
        </label>
        <label className="block text-[13px] font-medium text-ink">
          Email <span className="text-rose-500">*</span>
          <input name="email" type="email" required autoComplete="email" className={`${input} mt-1.5 h-11`} />
        </label>
      </div>
      <label className="block text-[13px] font-medium text-ink">
        Message <span className="text-rose-500">*</span>
        <textarea name="message" required minLength={10} maxLength={2000} rows={6} className={`${input} mt-1.5 py-3`} />
      </label>
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-muted">
        <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 accent-brand-600" />
        <span>
          I agree that {`Algoroasts`} may use these details to reply to me, as described in the{' '}
          <Link href="/privacy" className="font-medium text-brand-600 hover:underline">Privacy Policy</Link>.
        </span>
      </label>
      {status === 'error' && <p className="text-sm font-medium text-red-600 dark:text-red-400" role="alert">{error}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-70"
      >
        {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send message
      </button>
    </form>
  );
}
