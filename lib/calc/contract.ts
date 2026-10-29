/**
 * CONTRACT vs FULL-TIME ENGINE (pure, server-safe, no 'use client').
 *
 * The model is deliberately transparent: every number the user sees can be traced to an input.
 * It does NOT compute income tax — income tax depends on residence, filing status and deductions,
 * and the same income tax broadly applies to both offers. It models only the costs that DIFFER
 * between the two offers: benefits you must replace, unpaid time off, gaps between contracts,
 * business expenses and the extra payroll/social contributions an independent contractor pays.
 */

export type Currency = 'USD' | 'CAD' | 'GBP' | 'EUR' | 'INR';

export interface FullTimeOffer {
  salary: number; // annual base
  bonusPct: number; // expected annual bonus, % of base
  equityPerYear: number; // annualised equity value you'd realistically count
  retirementMatchPct: number; // employer retirement contribution, % of base
  benefitsValue: number; // annual employer-paid benefits you'd otherwise buy (health, insurance…)
  paidDaysOff: number; // paid vacation + public holidays per year
}

export interface ContractOffer {
  rate: number; // per hour, or per day when rateUnit === 'day'
  rateUnit: 'hour' | 'day';
  hoursPerDay: number;
  daysPerWeek: number;
  unpaidDaysOff: number; // days you will take off (unpaid) per year
  benchWeeks: number; // expected weeks between contracts per year
  expenses: number; // annual business costs (accountant, insurance, equipment, software)
  extraContributionPct: number; // extra payroll/social contributions vs an employee, % of gross
}

export interface CalcInput {
  currency: Currency;
  ft: FullTimeOffer;
  ct: ContractOffer;
}

export interface CalcResult {
  ftPackage: number;
  ftBreakdown: { label: string; value: number }[];
  ftHourly: number; // package ÷ hours actually worked as an employee
  billableDays: number;
  billableHours: number;
  ctGross: number;
  ctContributions: number;
  ctComparable: number; // gross − extra contributions − expenses
  difference: number; // ctComparable − ftPackage
  differencePct: number;
  breakEvenHourly: number;
  breakEvenDaily: number;
  naiveHourly: number; // salary ÷ 2,080 — the number recruiters often quote
  breakEvenMultiple: number; // breakEvenHourly ÷ naiveHourly
  verdict: 'contract' | 'fulltime' | 'even';
}

export const WEEKS_PER_YEAR = 52;
const STANDARD_HOURS = 2080; // 40h × 52w — the conventional full-time year

const clamp = (n: number, min: number, max: number) => (Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min);

/** Defensive normalisation so bad input (NaN, negatives, absurd values) never breaks the maths. */
export function sanitize(input: CalcInput): CalcInput {
  const { ft, ct } = input;
  return {
    currency: input.currency,
    ft: {
      salary: clamp(ft.salary, 0, 1e9),
      bonusPct: clamp(ft.bonusPct, 0, 500),
      equityPerYear: clamp(ft.equityPerYear, 0, 1e9),
      retirementMatchPct: clamp(ft.retirementMatchPct, 0, 100),
      benefitsValue: clamp(ft.benefitsValue, 0, 1e8),
      paidDaysOff: clamp(ft.paidDaysOff, 0, 120),
    },
    ct: {
      rate: clamp(ct.rate, 0, 1e7),
      rateUnit: ct.rateUnit === 'day' ? 'day' : 'hour',
      hoursPerDay: clamp(ct.hoursPerDay, 1, 16),
      daysPerWeek: clamp(ct.daysPerWeek, 1, 7),
      unpaidDaysOff: clamp(ct.unpaidDaysOff, 0, 200),
      benchWeeks: clamp(ct.benchWeeks, 0, 40),
      expenses: clamp(ct.expenses, 0, 1e8),
      extraContributionPct: clamp(ct.extraContributionPct, 0, 60),
    },
  };
}

export function calculate(raw: CalcInput): CalcResult {
  const { ft, ct } = sanitize(raw);

  const bonus = (ft.salary * ft.bonusPct) / 100;
  const match = (ft.salary * ft.retirementMatchPct) / 100;
  const ftPackage = ft.salary + bonus + ft.equityPerYear + match + ft.benefitsValue;

  const workDaysPerYear = ct.daysPerWeek * WEEKS_PER_YEAR;
  const benchDays = ct.benchWeeks * ct.daysPerWeek;
  const billableDays = Math.max(0, workDaysPerYear - ct.unpaidDaysOff - benchDays);
  const billableHours = billableDays * ct.hoursPerDay;

  const hourlyRate = ct.rateUnit === 'day' ? ct.rate / ct.hoursPerDay : ct.rate;
  const ctGross = hourlyRate * billableHours;
  const ctContributions = (ctGross * ct.extraContributionPct) / 100;
  const ctComparable = ctGross - ctContributions - ct.expenses;

  const difference = ctComparable - ftPackage;
  const differencePct = ftPackage > 0 ? (difference / ftPackage) * 100 : 0;

  // Rate at which the contract exactly matches the full-time package.
  const netFactor = 1 - ct.extraContributionPct / 100;
  const breakEvenHourly = billableHours > 0 && netFactor > 0 ? (ftPackage + ct.expenses) / (billableHours * netFactor) : 0;
  const breakEvenDaily = breakEvenHourly * ct.hoursPerDay;

  const ftWorkedHours = Math.max(1, (workDaysPerYear - ft.paidDaysOff) * ct.hoursPerDay);
  const ftHourly = ftPackage / ftWorkedHours;
  const naiveHourly = ft.salary / STANDARD_HOURS;
  const breakEvenMultiple = naiveHourly > 0 ? breakEvenHourly / naiveHourly : 0;

  const verdict: CalcResult['verdict'] = Math.abs(differencePct) < 3 ? 'even' : difference > 0 ? 'contract' : 'fulltime';

  return {
    ftPackage,
    ftBreakdown: [
      { label: 'Base salary', value: ft.salary },
      { label: 'Expected bonus', value: bonus },
      { label: 'Equity (annualised)', value: ft.equityPerYear },
      { label: 'Retirement match', value: match },
      { label: 'Benefits value', value: ft.benefitsValue },
    ],
    ftHourly,
    billableDays,
    billableHours,
    ctGross,
    ctContributions,
    ctComparable,
    difference,
    differencePct,
    breakEvenHourly,
    breakEvenDaily,
    naiveHourly,
    breakEvenMultiple,
    verdict,
  };
}

/* ------------------------------------------------------------------------------------------ */
/* Presets. Statutory figures are used only where an official source states them: the US      */
/* (IRS: 15.3% self-employed vs 7.65% employee) and Canada (CRA: self-employed pay both CPP    */
/* halves).                                                                                   */
/* Everything else is a clearly-labelled, editable starting assumption — never presented as   */
/* a fact about the user's situation.                                                         */
/* ------------------------------------------------------------------------------------------ */

export interface Preset {
  id: string;
  label: string;
  currency: Currency;
  note: string;
  source?: { label: string; url: string };
  input: CalcInput;
}

const baseCt = (over: Partial<ContractOffer>): ContractOffer => ({
  rate: 0,
  rateUnit: 'hour',
  hoursPerDay: 8,
  daysPerWeek: 5,
  unpaidDaysOff: 25,
  benchWeeks: 4,
  expenses: 0,
  extraContributionPct: 0,
  ...over,
});

export const PRESETS: Preset[] = [
  {
    id: 'us-1099',
    label: 'USA · 1099 / independent',
    currency: 'USD',
    note: 'Self-employed people in the US pay the full 15.3% Social Security + Medicare tax; employees have 7.65% withheld. The 7.65-point difference is pre-filled. Above the Social Security wage base the extra drops to Medicare only, so this slightly overstates the cost for very high earners.',
    source: { label: 'IRS — Self-employment tax (Social Security and Medicare taxes)', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes' },
    input: {
      currency: 'USD',
      ft: { salary: 135000, bonusPct: 10, equityPerYear: 0, retirementMatchPct: 4, benefitsValue: 12000, paidDaysOff: 25 },
      ct: baseCt({ rate: 90, extraContributionPct: 7.65, expenses: 6000 }),
    },
  },
  {
    id: 'us-w2-contract',
    label: 'USA · W-2 contract (via agency)',
    currency: 'USD',
    note: 'On a W-2 contract the agency is your employer and pays the employer share of payroll tax, so no extra contribution is pre-filled. Most W-2 contracts still exclude paid time off and often benefits — enter what yours actually offers.',
    input: {
      currency: 'USD',
      ft: { salary: 135000, bonusPct: 10, equityPerYear: 0, retirementMatchPct: 4, benefitsValue: 12000, paidDaysOff: 25 },
      ct: baseCt({ rate: 80, extraContributionPct: 0, expenses: 1000 }),
    },
  },
  {
    id: 'canada',
    label: 'Canada · incorporated / sole proprietor',
    currency: 'CAD',
    note: 'Self-employed people in Canada pay both the employee and employer portions of CPP. The employer half (5.95 points, on earnings up to the first CPP ceiling) is pre-filled; above that ceiling the extra is lower, so adjust for high incomes. EI is optional for the self-employed. Quebec uses QPP instead.',
    source: { label: 'Canada Revenue Agency — Responsibilities and entitlements for employees and self-employed workers', url: 'https://www.canada.ca/en/revenue-agency/services/tax/canada-pension-plan-cpp-employment-insurance-ei-rulings/cpp-ei-explained/employees-self-employed-workers-responsibilities-benefits-entitlements.html' },
    input: {
      currency: 'CAD',
      ft: { salary: 120000, bonusPct: 5, equityPerYear: 0, retirementMatchPct: 3, benefitsValue: 4000, paidDaysOff: 25 },
      ct: baseCt({ rate: 85, extraContributionPct: 5.95, expenses: 4000 }),
    },
  },
  {
    id: 'uk',
    label: 'UK · limited company / outside IR35',
    currency: 'GBP',
    note: 'UK contractors usually quote a day rate. Whether a role is inside or outside IR35 changes what you take home far more than the rate itself — check the status determination before comparing. Set “extra contributions” to reflect your structure.',
    source: { label: 'GOV.UK — Off-payroll working rules (IR35)', url: 'https://www.gov.uk/guidance/understanding-off-payroll-working-ir35' },
    input: {
      currency: 'GBP',
      ft: { salary: 75000, bonusPct: 5, equityPerYear: 0, retirementMatchPct: 5, benefitsValue: 1500, paidDaysOff: 33 },
      ct: baseCt({ rate: 550, rateUnit: 'day', unpaidDaysOff: 33, extraContributionPct: 0, expenses: 3000 }),
    },
  },
  {
    id: 'eu',
    label: 'Germany / Netherlands · freelancer',
    currency: 'EUR',
    note: 'Freelancers in Germany and the Netherlands generally fund their own health insurance and pension. Add those to expenses or to “extra contributions”. Long single-client contracts can also be reclassified as employment under local false self-employment rules, so check your status before signing.',
    input: {
      currency: 'EUR',
      ft: { salary: 75000, bonusPct: 0, equityPerYear: 0, retirementMatchPct: 0, benefitsValue: 0, paidDaysOff: 38 },
      ct: baseCt({ rate: 650, rateUnit: 'day', unpaidDaysOff: 38, extraContributionPct: 0, expenses: 9000 }),
    },
  },
  {
    id: 'india-remote',
    label: 'India · remote contract for a foreign client',
    currency: 'INR',
    note: 'Compare a local full-time offer with a remote contract billed abroad (convert the rate to INR first). Freelancers handle their own provident-fund-style savings, insurance and GST compliance where it applies — add those to expenses.',
    input: {
      currency: 'INR',
      ft: { salary: 3000000, bonusPct: 10, equityPerYear: 0, retirementMatchPct: 12, benefitsValue: 30000, paidDaysOff: 30 },
      ct: baseCt({ rate: 2500, unpaidDaysOff: 30, extraContributionPct: 0, expenses: 120000 }),
    },
  },
];

export const DEFAULT_PRESET = PRESETS[0];

export function formatMoney(value: number, currency: Currency, opts: { compact?: boolean; decimals?: number } = {}): string {
  const locale = currency === 'INR' ? 'en-IN' : currency === 'EUR' ? 'de-DE' : currency === 'GBP' ? 'en-GB' : currency === 'CAD' ? 'en-CA' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: opts.decimals ?? 0,
    minimumFractionDigits: opts.decimals ?? 0,
    notation: opts.compact ? 'compact' : 'standard',
  }).format(Number.isFinite(value) ? value : 0);
}

/* ---------------------------- URL state (shareable results) ---------------------------- */

const KEYS: [keyof FullTimeOffer | keyof ContractOffer, 'ft' | 'ct', string][] = [
  ['salary', 'ft', 's'],
  ['bonusPct', 'ft', 'b'],
  ['equityPerYear', 'ft', 'e'],
  ['retirementMatchPct', 'ft', 'm'],
  ['benefitsValue', 'ft', 'bv'],
  ['paidDaysOff', 'ft', 'pto'],
  ['rate', 'ct', 'r'],
  ['hoursPerDay', 'ct', 'h'],
  ['daysPerWeek', 'ct', 'd'],
  ['unpaidDaysOff', 'ct', 'off'],
  ['benchWeeks', 'ct', 'bw'],
  ['expenses', 'ct', 'x'],
  ['extraContributionPct', 'ct', 'c'],
];

export function toQuery(input: CalcInput, presetId: string): string {
  const p = new URLSearchParams();
  p.set('p', presetId);
  p.set('cur', input.currency);
  p.set('u', input.ct.rateUnit);
  for (const [key, group, short] of KEYS) {
    const v = (input[group] as unknown as Record<string, number>)[key];
    p.set(short, String(Math.round(v * 100) / 100));
  }
  return p.toString();
}

const CURRENCIES: Currency[] = ['USD', 'CAD', 'GBP', 'EUR', 'INR'];

export function fromQuery(search: URLSearchParams): { input: CalcInput; presetId: string } | null {
  const presetId = search.get('p');
  const preset = PRESETS.find((x) => x.id === presetId);
  if (!preset) return null;
  const input: CalcInput = structuredClone(preset.input);
  const cur = search.get('cur') as Currency | null;
  if (cur && CURRENCIES.includes(cur)) input.currency = cur;
  const unit = search.get('u');
  if (unit === 'day' || unit === 'hour') input.ct.rateUnit = unit;
  for (const [key, group, short] of KEYS) {
    const raw = search.get(short);
    if (raw === null) continue;
    const n = Number(raw);
    if (Number.isFinite(n)) (input[group] as unknown as Record<string, number>)[key] = n;
  }
  return { input: sanitize(input), presetId: preset.id };
}
