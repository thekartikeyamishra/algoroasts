'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Copy, Loader2, Lock } from 'lucide-react';
import { SITE } from '@/lib/site';
import { cn, haptic } from '@/lib/utils';

const STORE_KEY = 'algoroasts:invite:v1';

const ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'junior', label: 'Junior developer (0–2 yrs)' },
  { value: 'mid', label: 'Mid-level (3–5 yrs)' },
  { value: 'senior', label: 'Senior (6+ yrs)' },
  { value: 'lead', label: 'Lead / manager' },
  { value: 'freelancer', label: 'Freelancer / contractor' },
  { value: 'founder', label: 'Founder' },
  { value: 'other', label: 'Other' },
];

type Status = 'idle' | 'loading' | 'done' | 'error';

/**
 * Invite-only early access. Honest by design: no fake "#1,204 in line" counters or countdowns.
 * After joining, the user gets a personal invite link they can share (captured as `referredBy`).
 */
export function InviteForm({ source, compact = false, className }: { source: string; compact?: boolean; className?: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [ref, setRef] = useState('');
  const [copied, setCopied] = useState(false);
  const startedAt = useRef(Date.now());
  const referredBy = useRef('');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORE_KEY);
      if (saved) {
        setRef(saved);
        setStatus('done');
      }
      const params = new URLSearchParams(window.location.search);
      const r = params.get('ref');
      if (r && /^[A-Za-z0-9_-]{4,16}$/.test(r)) referredBy.current = r;
    } catch {
      /* storage blocked */
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'invite',
          email: form.get('email'),
          role: form.get('role'),
          consent: form.get('consent') === 'on',
          website: form.get('website'),
          referredBy: referredBy.current,
          source,
          startedAt: startedAt.current,
        }),
      });
      const data = (await res.json()) as { ok: boolean; ref?: string; error?: string };
      if (!data.ok) throw new Error(data.error || 'Something went wrong.');
      haptic([10, 40, 10]);
      setRef(data.ref ?? '');
      setStatus('done');
      try {
        window.localStorage.setItem(STORE_KEY, data.ref ?? '');
      } catch {
        /* non-fatal */
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  const inviteUrl = ref ? `${SITE.url}/invite?ref=${ref}` : '';

  if (status === 'done') {
    return (
      <div className={cn('rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6', className)} role="status">
        <p className="flex items-center gap-2 font-semibold text-ink">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-4 w-4" />
          </span>
          You’re on the invite list.
        </p>
        <p className="mt-2 text-sm text-muted">
          Invites go out in small batches as the app opens up. We’ll email you once, when yours is ready — no spam.
        </p>
        {inviteUrl && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-faint">Your personal invite link</p>
            <div className="mt-2 flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-xl border border-line bg-surface px-3 py-2 text-xs text-muted">{inviteUrl}</code>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(inviteUrl);
                    setCopied(true);
                    haptic(8);
                    setTimeout(() => setCopied(false), 1800);
                  } catch {
                    /* clipboard blocked */
                  }
                }}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 text-xs font-semibold text-ink transition hover:border-brand-300"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="mt-2 text-xs text-faint">Share it with a developer friend — people who join through it are grouped with you.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn('relative w-full', className)}>
      <div className={cn('flex flex-col gap-3', !compact && 'sm:flex-row')}>
        <label className="sr-only" htmlFor={`email-${source}`}>Work or personal email</label>
        <input
          id={`email-${source}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@domain.com"
          className="h-12 min-w-0 flex-1 rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-faint transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
        <label className="sr-only" htmlFor={`role-${source}`}>Your role</label>
        <select
          id={`role-${source}`}
          name="role"
          defaultValue="mid"
          className="h-12 rounded-2xl border border-line bg-surface px-3 text-[15px] text-ink transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 sm:w-56"
        >
          {ROLE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 active:scale-[0.98] disabled:opacity-70"
        >
          {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          Request invite
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Honeypot — hidden from people and assistive tech, attractive to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="mt-3 flex items-start gap-2.5 text-xs leading-relaxed text-muted">
        <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-brand-600" />
        <span>
          I agree to receive one invite email and occasional product updates. I can unsubscribe anytime. See the{' '}
          <Link href="/privacy" className="font-medium text-brand-600 underline-offset-2 hover:underline">Privacy Policy</Link>.
        </span>
      </label>

      {status === 'error' && (
        <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400" role="alert">{error}</p>
      )}
    </form>
  );
}
