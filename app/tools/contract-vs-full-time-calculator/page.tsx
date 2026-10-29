import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { breadcrumbSchema, webApplicationSchema } from '@/lib/schema';
import { DEFAULT_PRESET, PRESETS, calculate, formatMoney } from '@/lib/calc/contract';
import { JsonLd } from '@/components/JsonLd';
import { FAQ } from '@/components/article/AnswerBlock';
import { ContractCalculator } from '@/components/tools/ContractCalculator';
import { DisplayAd } from '@/components/ads/AdSlots';
import { AD_SLOTS } from '@/components/ads/slots';

const PATH = '/tools/contract-vs-full-time-calculator';
const TITLE = 'Contract vs Full-Time Calculator for Developers (Hourly & Day Rate)';
const DESCRIPTION =
  'Is that contract rate really a raise? Compare a developer contract offer with a full-time package — benefits, unpaid time off, gaps between contracts and self-employment contributions — and get your break-even hourly and day rate. Free, private, in-browser.';

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

// Worked example computed by the same engine the calculator uses — never hand-typed numbers.
const ex = DEFAULT_PRESET.input;
const exR = calculate(ex);
const m = (n: number, d = 0) => formatMoney(n, ex.currency, { decimals: d });

const FAQS = [
  {
    question: 'How do I convert a salary into a contract hourly rate?',
    answer:
      'Add up the full-time package (salary, expected bonus, equity you would count on, retirement match and the value of benefits), add the business expenses you will pay as a contractor, then divide by your realistic billable hours after unpaid time off and gaps between contracts. Finally gross it up for any extra payroll or social contributions contractors pay. That is the break-even rate — anything above it is a real raise.',
  },
  {
    question: 'Why is salary ÷ 2,080 the wrong way to price a contract?',
    answer:
      '2,080 hours assumes you are paid for 52 weeks of 40 hours, including holidays, with benefits on top. A contractor is not paid for vacation, sick days or the weeks between contracts, and has to buy their own benefits. Dividing the salary by 2,080 therefore understates the rate you need, often by a wide margin.',
  },
  {
    question: 'Does this calculator include income tax?',
    answer:
      'No, deliberately. Income tax depends on where you live, your filing status and your deductions, and it broadly applies to both offers. The calculator models only the costs that differ between the two offers. For a full after-tax picture, run both scenarios past an accountant in your country.',
  },
  {
    question: 'What is the difference between a 1099 and a W-2 contract in the US?',
    answer:
      'On a W-2 contract an agency employs you and pays the employer share of Social Security and Medicare. As a 1099 independent contractor you pay both halves as self-employment tax (15.3% according to the IRS, versus 7.65% withheld from an employee). Use the matching preset to see how much that changes the break-even rate.',
  },
  {
    question: 'Is my data stored or sent anywhere?',
    answer:
      'No. Every calculation runs in your browser. The numbers are kept in the page address only so you can bookmark or share a result; nothing you type is sent to Algoroasts.',
  },
];

export default function ContractCalculatorPage() {
  return (
    <div className="container-x py-10 sm:py-14">
      <JsonLd
        data={[
          webApplicationSchema({ name: 'Contract vs Full-Time Calculator', description: DESCRIPTION, path: PATH }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Tools', path: '/tools' },
            { name: 'Contract vs Full-Time Calculator', path: PATH },
          ]),
        ]}
      />

      <nav className="mb-6 text-sm text-faint" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/tools" className="hover:text-brand-600">Tools</Link>
        <span className="mx-1.5">/</span>
        <span className="text-muted">Contract vs Full-Time</span>
      </nav>

      <header className="mb-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Free calculator · no sign-up</p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
          Contract vs full-time: is that rate really a raise?
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Recruiters often convert salaries with a simple “divide by 2,080 hours”. That ignores the benefits you lose, the
          holidays you no longer get paid for and the weeks between contracts. Enter both offers to see what each is really
          worth, and the rate where the contract breaks even.
        </p>
      </header>

      <ContractCalculator />

      <div className="mx-auto mt-16 max-w-prose">
        <article className="prose prose-slate prose-lg dark:prose-invert">
          <h2>How the calculation works</h2>
          <p>The calculator compares the two offers on everything that differs between them. Income tax is left out because it applies to both.</p>
          <ol>
            <li>
              <strong>Full-time package</strong> = base salary + expected bonus + equity you would realistically count + employer
              retirement match + the value of benefits you would otherwise buy.
            </li>
            <li>
              <strong>Billable days</strong> = working days in a year − unpaid days off − gaps between contracts.
            </li>
            <li>
              <strong>Contract, comparable</strong> = rate × billable hours − extra payroll/social contributions − business expenses.
            </li>
            <li>
              <strong>Break-even rate</strong> = (full-time package + expenses) ÷ (billable hours × (1 − extra contribution rate)).
            </li>
          </ol>

          <h2>Worked example</h2>
          <p>
            Take the default US scenario: a {m(ex.ft.salary)} salary with a {ex.ft.bonusPct}% bonus, a {ex.ft.retirementMatchPct}% retirement
            match and {m(ex.ft.benefitsValue)} of benefits, against a 1099 contract at {m(ex.ct.rate)} an hour. The contractor takes{' '}
            {ex.ct.unpaidDaysOff} unpaid days off, expects {ex.ct.benchWeeks} weeks between contracts and spends {m(ex.ct.expenses)} a year on the business.
          </p>
          <ul>
            <li>Full-time package: <strong>{m(exR.ftPackage)}</strong> a year.</li>
            <li>Billable time: {Math.round(exR.billableDays)} days, or {Math.round(exR.billableHours).toLocaleString('en-US')} hours.</li>
            <li>Contract gross: {m(exR.ctGross)}; after the extra {ex.ct.extraContributionPct}% self-employment contribution and expenses: <strong>{m(exR.ctComparable)}</strong>.</li>
            <li>
              Break-even: <strong>{m(exR.breakEvenHourly, 2)}/hour</strong>, which is {exR.breakEvenMultiple.toFixed(2)}× the naive{' '}
              {m(exR.naiveHourly, 2)} you get from salary ÷ 2,080.
            </li>
          </ul>
          <p>
            In this example a rate that looks generous next to the naive figure is{' '}
            {exR.difference >= 0 ? `ahead of the full-time offer by ${m(exR.difference)} a year.` : `actually ${m(Math.abs(exR.difference))} a year behind the full-time offer.`}{' '}
            Your numbers will differ — that is the point of running them.
          </p>

          <h2>What the presets assume</h2>
          <p>Presets are only starting points. Change any value to match your offer.</p>
          <ul>
            {PRESETS.map((p) => (
              <li key={p.id}>
                <strong>{p.label}.</strong> {p.note}
                {p.source && (
                  <>
                    {' '}(<a href={p.source.url} target="_blank" rel="noopener noreferrer">{p.source.label}</a>)
                  </>
                )}
              </li>
            ))}
          </ul>

          <h2>What this calculator does not do</h2>
          <ul>
            <li>It does not calculate income tax, tax credits or deductions.</li>
            <li>It does not decide your legal employment status (IR35, 1099 vs W-2, false self-employment rules).</li>
            <li>It does not value job security, career progression or the type of work — weigh those yourself.</li>
          </ul>

          <h2>Related guides</h2>
          <ul>
            <li><Link href="/blog/software-contractor-rates-usa-2026">Software contractor rates in the USA</Link></li>
            <li><Link href="/blog/eu-contractor-day-rates-2026">EU contractor day rates</Link></li>
            <li><Link href="/blog/remote-developer-jobs-india-usd-2026">Earning in USD as a remote developer from India</Link></li>
            <li><Link href="/blog/startup-equity-explained-usa-2026">How to value startup equity</Link></li>
          </ul>
        </article>

        <FAQ items={FAQS} />

        <DisplayAd slot={AD_SLOTS.toolResult} />

        <p className="mt-10 text-sm leading-relaxed text-faint">
          Built and maintained by {SITE.name}. Last reviewed {SITE.legalUpdated}. Found an error or want a country added?{' '}
          <Link href="/contact" className="text-brand-600 underline underline-offset-2">Tell us</Link>. Read our{' '}
          <Link href="/disclaimer" className="text-brand-600 underline underline-offset-2">disclaimer</Link>.
        </p>
      </div>
    </div>
  );
}
