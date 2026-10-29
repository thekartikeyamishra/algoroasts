import { NextResponse } from 'next/server';
import { createHmac, randomBytes } from 'node:crypto';

/**
 * POST /api/leads — invite-list sign-ups and contact messages.
 *
 * Stores nothing itself. A valid submission is forwarded as JSON to LEADS_WEBHOOK_URL
 * (a Google Apps Script web app writing to a Sheet, Zapier/Make, Formspree, Slack, etc.).
 * Optional LEADS_WEBHOOK_SECRET is sent as `X-Algoroasts-Signature` (HMAC-SHA256 of the body)
 * so the receiver can reject forged posts.
 *
 * Abuse controls: strict validation + length caps, honeypot field, minimum fill time,
 * same-origin check and a best-effort per-IP rate limit (per server instance).
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
const ROLES = ['student', 'junior', 'mid', 'senior', 'lead', 'freelancer', 'founder', 'other'] as const;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // bound memory
  return recent.length > MAX_PER_WINDOW;
}

const clean = (v: unknown, max: number) =>
  typeof v === 'string' ? v.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max) : '';

function refCode(email: string): string {
  const secret = process.env.LEADS_WEBHOOK_SECRET;
  if (secret) return createHmac('sha256', secret).update(email).digest('base64url').slice(0, 8);
  return randomBytes(6).toString('base64url');
}

export async function POST(req: Request) {
  // Same-origin only (blocks cross-site form spam).
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ ok: false, error: 'Bad origin.' }, { status: 403 });
  }

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > 8_000) throw new Error('too large');
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot + timing: bots fill hidden fields and submit instantly. Pretend success.
  const startedAt = Number(body.startedAt);
  if (clean(body.website, 200) || (Number.isFinite(startedAt) && Date.now() - startedAt < 1500)) {
    return NextResponse.json({ ok: true, ref: refCode('bot') });
  }

  const type = body.type === 'contact' ? 'contact' : 'invite';
  const email = clean(body.email, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 422 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ ok: false, error: 'Please agree to the Privacy Policy to continue.' }, { status: 422 });
  }

  const role = ROLES.includes(body.role as (typeof ROLES)[number]) ? (body.role as string) : 'other';
  const name = clean(body.name, 80);
  const message = clean(body.message, 2000);
  if (type === 'contact' && message.length < 10) {
    return NextResponse.json({ ok: false, error: 'Please write a short message (10+ characters).' }, { status: 422 });
  }

  const ref = refCode(email);
  const payload = {
    type,
    email,
    name,
    role,
    message,
    referredBy: clean(body.referredBy, 16),
    ref,
    source: clean(body.source, 120),
    consentAt: new Date().toISOString(),
    userAgent: clean(req.headers.get('user-agent'), 300),
    country: clean(req.headers.get('x-vercel-ip-country'), 4),
  };

  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) {
    console.error('[leads] LEADS_WEBHOOK_URL is not set — submission not stored.');
    return NextResponse.json(
      { ok: false, error: 'Sign-ups are temporarily unavailable. Please try again later.' },
      { status: 503 },
    );
  }

  const json = JSON.stringify(payload);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (process.env.LEADS_WEBHOOK_SECRET) {
    headers['X-Algoroasts-Signature'] = createHmac('sha256', process.env.LEADS_WEBHOOK_SECRET).update(json).digest('hex');
  }

  try {
    const res = await fetch(url, { method: 'POST', headers, body: json, signal: AbortSignal.timeout(8000), redirect: 'follow' });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
  } catch (err) {
    console.error('[leads] webhook failed', err);
    return NextResponse.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, ref });
}

export function GET() {
  return NextResponse.json({ ok: false, error: 'Method not allowed.' }, { status: 405 });
}
