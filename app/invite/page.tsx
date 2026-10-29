import type { Metadata } from 'next';
import Link from 'next/link';
import { Bell, Compass, LineChart, ShieldCheck } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { InviteForm } from '@/components/invite/InviteForm';
import { AppStoreButtons } from '@/components/invite/AppStoreButtons';
import { SignalField } from '@/components/fx/SignalField';

export const metadata: Metadata = buildMetadata({
  title: 'Request an Invite — Early Access to the Algoroasts App',
  description:
    'The Algoroasts app is in invite-only early access: saved decisions, rate and offer checks, and alerts when the market moves. Join the list — invites go out in small batches.',
  path: '/invite',
});

const FEATURES = [
  { icon: Compass, title: 'Your decision path', body: 'Save guides and calculator results into one plan, on web and mobile.' },
  { icon: LineChart, title: 'Offer and rate checks', body: 'Run the calculators on your phone and keep every scenario you compared.' },
  { icon: Bell, title: 'Market-move alerts', body: 'Opt-in notifications when data behind a saved guide is updated.' },
  { icon: ShieldCheck, title: 'Private by default', body: 'No selling of your data. Calculator inputs stay on your device.' },
];

export default function InvitePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-950">
        <SignalField className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950" />
        <div className="container-x relative py-20 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Invite-only early access
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              Your career decisions, <span className="gradient-text">in your pocket.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              We’re opening the {SITE.name} app to a small group first so we can build it with them. Join the list and we’ll email you
              once, when your invite is ready.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-white/10 bg-white p-5 shadow-2xl dark:bg-slate-900 sm:p-6">
            <InviteForm source="invite-page" />
          </div>
          <div className="mt-8 flex justify-center">
            <AppStoreButtons />
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight text-ink">What early members get</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="spotlight rounded-3xl border border-line bg-surface p-6" data-reveal>
              <Icon className="h-6 w-6 text-brand-600" />
              <h3 className="mt-4 font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-faint">
          Features are planned and may change before launch. Joining doesn’t guarantee access by a particular date. Meanwhile, everything
          on the website stays free — try the <Link href="/tools/contract-vs-full-time-calculator" className="text-brand-600 hover:underline">Contract vs Full-Time Calculator</Link>.
        </p>
      </section>
    </>
  );
}
