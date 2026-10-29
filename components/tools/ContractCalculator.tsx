'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy, Link2, Printer, RotateCcw, Info } from 'lucide-react';
import {
  PRESETS,
  DEFAULT_PRESET,
  calculate,
  formatMoney,
  fromQuery,
  toQuery,
  type CalcInput,
  type Currency,
  type ContractOffer,
  type FullTimeOffer,
} from '@/lib/calc/contract';
import { cn, haptic } from '@/lib/utils';

const CURRENCIES: Currency[] = ['USD', 'CAD', 'GBP', 'EUR', 'INR'];

function Field({
  label,
  hint,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  min = 0,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
}) {
  // Local text state so users can clear/retype freely; commit numbers only.
  const [text, setText] = useState(String(value));
  const focused = useRef(false);
  useEffect(() => {
    if (!focused.current) setText(String(value));
  }, [value]);
  const id = useMemo(() => `f-${label.replace(/\W+/g, '-').toLowerCase()}`, [label]);
  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-1.5 text-[13px] font-medium text-ink">
        {label}
        {hint && (
          <span className="group relative inline-flex rounded-full focus:outline-none" tabIndex={0}>
            <Info className="h-3.5 w-3.5 text-faint" aria-hidden />
            <span className="sr-only">{hint}</span>
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-60 -translate-x-1/2 rounded-xl bg-slate-900 p-3 text-xs font-normal leading-relaxed text-slate-100 shadow-xl group-hover:block group-focus:block"
            >
              {hint}
            </span>
          </span>
        )}
      </label>
      <div className="mt-1.5 flex h-11 items-center rounded-xl border border-line bg-surface transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/25">
        {prefix && <span className="pl-3 text-sm text-faint">{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={text}
          onFocus={() => (focused.current = true)}
          onBlur={() => {
            focused.current = false;
            setText(String(value));
          }}
          onChange={(e) => {
            setText(e.target.value);
            const n = Number(e.target.value);
            if (e.target.value !== '' && Number.isFinite(n)) onChange(n);
          }}
          className="num-input h-full min-w-0 flex-1 bg-transparent px-3 text-[15px] text-ink outline-none"
        />
        {suffix && <span className="pr-3 text-sm text-faint">{suffix}</span>}
      </div>
    </div>
  );
}

function Bar({ label, value, max, currency, tone }: { label: string; value: number; max: number; currency: Currency; tone: 'brand' | 'accent' }) {
  const pct = max > 0 ? Math.max(2, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-semibold tabular-nums text-ink">{formatMoney(value, currency)}</span>
      </div>
      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-line/70">
        <div
          className={cn('h-full rounded-full transition-[width] duration-500 ease-out', tone === 'brand' ? 'bg-brand-600' : 'bg-accent-500')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ContractCalculator() {
  const [presetId, setPresetId] = useState(DEFAULT_PRESET.id);
  const [input, setInput] = useState<CalcInput>(() => structuredClone(DEFAULT_PRESET.input));
  const [copied, setCopied] = useState<'link' | 'summary' | null>(null);
  const hydrated = useRef(false);

  // Restore a shared calculation from the URL.
  useEffect(() => {
    const restored = fromQuery(new URLSearchParams(window.location.search));
    if (restored) {
      setPresetId(restored.presetId);
      setInput(restored.input);
    }
    hydrated.current = true;
  }, []);

  // Keep the URL shareable (debounced, no history spam).
  useEffect(() => {
    if (!hydrated.current) return;
    const t = setTimeout(() => {
      const url = `${window.location.pathname}?${toQuery(input, presetId)}`;
      window.history.replaceState(null, '', url);
    }, 400);
    return () => clearTimeout(t);
  }, [input, presetId]);

  const preset = PRESETS.find((p) => p.id === presetId) ?? DEFAULT_PRESET;
  const r = useMemo(() => calculate(input), [input]);
  const cur = input.currency;
  const money = (n: number, decimals = 0) => formatMoney(n, cur, { decimals });

  const setFt = (k: keyof FullTimeOffer) => (n: number) => setInput((s) => ({ ...s, ft: { ...s.ft, [k]: n } }));
  const setCt = (k: keyof Omit<ContractOffer, 'rateUnit'>) => (n: number) => setInput((s) => ({ ...s, ct: { ...s.ct, [k]: n } }));

  const choosePreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    haptic(6);
    setPresetId(id);
    setInput(structuredClone(p.input));
  };

  const summary = [
    `Contract vs full-time — ${preset.label}`,
    `Full-time package: ${money(r.ftPackage)} / year`,
    `Contract, comparable: ${money(r.ctComparable)} / year (${Math.round(r.billableDays)} billable days)`,
    `Difference: ${r.difference >= 0 ? '+' : ''}${money(r.difference)} (${r.differencePct >= 0 ? '+' : ''}${r.differencePct.toFixed(1)}%)`,
    `Break-even contract rate: ${money(r.breakEvenHourly, 2)}/hour · ${money(r.breakEvenDaily)}/day`,
    `Calculated with ${typeof window !== 'undefined' ? window.location.href : 'algoroasts.com'}`,
  ].join('\n');

  const copy = async (what: 'link' | 'summary') => {
    try {
      await navigator.clipboard.writeText(what === 'link' ? window.location.href : summary);
      setCopied(what);
      haptic(8);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  const verdictCopy =
    r.verdict === 'even'
      ? { title: 'It’s roughly a wash', tone: 'text-amber-400', body: 'The two offers are within 3% of each other once the hidden costs are counted. Decide on stability, growth and the work itself.' }
      : r.verdict === 'contract'
        ? { title: 'The contract pays more', tone: 'text-emerald-400', body: `After the costs you entered, the contract comes out ${money(Math.abs(r.difference))} a year ahead.` }
        : { title: 'The full-time offer pays more', tone: 'text-rose-400', body: `After the costs you entered, the contract falls ${money(Math.abs(r.difference))} a year short — a pay cut disguised as a higher rate.` };

  const maxBar = Math.max(r.ftPackage, r.ctComparable, 1);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
      {/* ------------------------------ INPUTS ------------------------------ */}
      <div className="space-y-6">
        <div className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
          <p className="text-[13px] font-semibold text-ink">Start from a situation</p>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Preset">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={p.id === presetId}
                onClick={() => choosePreset(p.id)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition active:scale-95',
                  p.id === presetId ? 'border-brand-600 bg-brand-600 text-white' : 'border-line bg-canvas text-muted hover:border-brand-300 hover:text-ink',
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-2xl bg-canvas p-4 text-[13px] leading-relaxed text-muted">
            {preset.note}
            {preset.source && (
              <>
                {' '}
                <a href={preset.source.url} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600 underline-offset-2 hover:underline">
                  Source: {preset.source.label}
                </a>
              </>
            )}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <label htmlFor="currency" className="text-[13px] font-medium text-ink">Currency</label>
            <select
              id="currency"
              value={cur}
              onChange={(e) => setInput((s) => ({ ...s, currency: e.target.value as Currency }))}
              className="h-9 rounded-lg border border-line bg-surface px-2 text-sm text-ink"
            >
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <span className="text-xs text-faint">Display only — no conversion.</span>
          </div>
        </div>

        <fieldset className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
          <legend className="px-1 text-base font-bold text-ink">
            <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-brand-600 align-middle" aria-hidden />
            Full-time offer
          </legend>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <Field label="Base salary / year" value={input.ft.salary} onChange={setFt('salary')} step={1000} />
            <Field label="Expected bonus" suffix="% of base" value={input.ft.bonusPct} onChange={setFt('bonusPct')} step={0.5} hint="Use what is realistically paid, not the maximum. If the bonus is discretionary and rarely paid, enter 0." />
            <Field label="Equity per year" value={input.ft.equityPerYear} onChange={setFt('equityPerYear')} step={1000} hint="Annual vesting value you would actually count on. For private startups, a cautious figure (or 0) is safer — paper value often never turns into cash." />
            <Field label="Retirement match" suffix="% of base" value={input.ft.retirementMatchPct} onChange={setFt('retirementMatchPct')} step={0.5} hint="Employer contribution to 401(k), RRSP, workplace pension, EPF, etc." />
            <Field label="Benefits value / year" value={input.ft.benefitsValue} onChange={setFt('benefitsValue')} step={500} hint="What it would cost you to buy the same health, life and disability cover yourself." />
            <Field label="Paid days off / year" suffix="days" value={input.ft.paidDaysOff} onChange={setFt('paidDaysOff')} hint="Paid vacation plus public holidays." />
          </div>
        </fieldset>

        <fieldset className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
          <legend className="px-1 text-base font-bold text-ink">
            <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-accent-500 align-middle" aria-hidden />
            Contract offer
          </legend>
          <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Rate unit">
            {(['hour', 'day'] as const).map((u) => (
              <button
                key={u}
                type="button"
                role="radio"
                aria-checked={input.ct.rateUnit === u}
                onClick={() => setInput((s) => ({ ...s, ct: { ...s.ct, rateUnit: u } }))}
                className={cn(
                  'rounded-full border px-3.5 py-1 text-[13px] font-medium transition',
                  input.ct.rateUnit === u ? 'border-ink bg-ink text-canvas' : 'border-line text-muted hover:text-ink',
                )}
              >
                Per {u}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label={`Rate per ${input.ct.rateUnit}`} value={input.ct.rate} onChange={setCt('rate')} step={input.ct.rateUnit === 'day' ? 25 : 1} />
            <Field label="Hours per day" suffix="h" value={input.ct.hoursPerDay} onChange={setCt('hoursPerDay')} step={0.5} min={1} />
            <Field label="Days per week" suffix="days" value={input.ct.daysPerWeek} onChange={setCt('daysPerWeek')} min={1} />
            <Field label="Unpaid days off / year" suffix="days" value={input.ct.unpaidDaysOff} onChange={setCt('unpaidDaysOff')} hint="Vacation, public holidays and sick days you will not bill. Matching the full-time paid days off gives a like-for-like comparison." />
            <Field label="Gaps between contracts" suffix="weeks / yr" value={input.ct.benchWeeks} onChange={setCt('benchWeeks')} hint="Time spent finding the next contract. Many contractors plan for several weeks a year; 0 only makes sense for a guaranteed, renewing contract." />
            <Field label="Business expenses / year" value={input.ct.expenses} onChange={setCt('expenses')} step={500} hint="Accountant, liability insurance, equipment, software, co-working, and health insurance if you are not counting it elsewhere." />
            <Field label="Extra contributions" suffix="% of gross" value={input.ct.extraContributionPct} onChange={setCt('extraContributionPct')} step={0.05} hint="Payroll or social contributions you pay as a contractor on top of what an employee pays (e.g. the employer half of US FICA). Income tax is not included because it applies to both offers." />
          </div>
        </fieldset>
      </div>

      {/* Mobile: compact live result pinned above the bottom nav, jumps to the full result. */}
      <a
        href="#calc-result"
        className="no-print fixed inset-x-3 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-30 flex items-center justify-between gap-3 rounded-2xl bg-slate-950/95 px-4 py-3 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur lg:hidden"
      >
        <span className="min-w-0">
          <span className={cn('block truncate text-sm font-bold', verdictCopy.tone)}>{verdictCopy.title}</span>
          <span className="block text-xs text-slate-400">Break-even {money(r.breakEvenHourly, 2)}/h · {money(r.breakEvenDaily)}/day</span>
        </span>
        <span className="shrink-0 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold">Details ↓</span>
      </a>

      {/* ------------------------------ RESULTS ----------------------------- */}
      <div id="calc-result" className="scroll-mt-20 pb-20 lg:sticky lg:top-20 lg:pb-0" aria-live="polite">
        <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-xl shadow-slate-900/5">
          <div className="bg-slate-950 p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Verdict</p>
            <p className={cn('mt-1 text-2xl font-extrabold tracking-tight', verdictCopy.tone)}>{verdictCopy.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{verdictCopy.body}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                <p className="text-[11px] uppercase tracking-wider text-slate-400">Break-even / hour</p>
                <p className="mt-1 text-xl font-bold tabular-nums">{money(r.breakEvenHourly, 2)}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                <p className="text-[11px] uppercase tracking-wider text-slate-400">Break-even / day</p>
                <p className="mt-1 text-xl font-bold tabular-nums">{money(r.breakEvenDaily)}</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              The naive conversion (salary ÷ 2,080 h) is {money(r.naiveHourly, 2)}/h. To truly match this offer you need{' '}
              <strong className="text-white">{r.breakEvenMultiple.toFixed(2)}×</strong> that.
            </p>
          </div>

          <div className="space-y-4 p-6">
            <Bar label="Full-time package" value={r.ftPackage} max={maxBar} currency={cur} tone="brand" />
            <Bar label="Contract, comparable" value={Math.max(0, r.ctComparable)} max={maxBar} currency={cur} tone="accent" />

            <dl className="divide-y divide-line rounded-2xl border border-line text-sm">
              {[
                ['Billable days', `${Math.round(r.billableDays)} days · ${Math.round(r.billableHours).toLocaleString()} h`],
                ['Contract gross', money(r.ctGross)],
                ['− Extra contributions', money(r.ctContributions)],
                ['− Business expenses', money(input.ct.expenses)],
                ['Full-time value per hour worked', money(r.ftHourly, 2)],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 px-4 py-2.5">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium tabular-nums text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="no-print flex flex-wrap gap-2 pt-1">
              <button type="button" onClick={() => copy('link')} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-line px-3 text-[13px] font-semibold text-ink transition hover:border-brand-300">
                {copied === 'link' ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />} {copied === 'link' ? 'Link copied' : 'Share link'}
              </button>
              <button type="button" onClick={() => copy('summary')} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-line px-3 text-[13px] font-semibold text-ink transition hover:border-brand-300">
                {copied === 'summary' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied === 'summary' ? 'Copied' : 'Copy summary'}
              </button>
              <button type="button" onClick={() => window.print()} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-line px-3 text-[13px] font-semibold text-ink transition hover:border-brand-300">
                <Printer className="h-3.5 w-3.5" /> Print
              </button>
              <button type="button" onClick={() => choosePreset(presetId)} className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-[13px] font-medium text-muted transition hover:text-ink">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>
            <p className="text-[11px] leading-relaxed text-faint">
              Estimates for comparison only, based solely on the numbers you enter. Not tax, legal or financial advice. Runs in your browser; nothing you type is sent to us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
