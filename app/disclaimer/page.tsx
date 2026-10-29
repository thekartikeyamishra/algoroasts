import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { LegalPage } from '@/components/layout/LegalPage';

export const metadata: Metadata = buildMetadata({
  title: 'Disclaimer',
  description: `${SITE.name} publishes general information, not financial, tax, legal or immigration advice. Read how to use our figures and calculators safely.`,
  path: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      intro="Our guides and calculators help you think through career decisions. They cannot know your full situation, so treat them as a starting point, not a final answer."
    >
      <h2>General information only</h2>
      <p>
        Content on {SITE.name} is general information. It is not financial, investment, tax, legal, immigration or employment advice,
        and it is not tailored to you. Speak to a qualified professional — an accountant, a lawyer or a registered immigration
        adviser — before acting on it.
      </p>

      <h2>Figures and estimates</h2>
      <p>
        Salary, rate and cost figures come from the public sources cited on each page (for example government labour statistics and tax
        authorities) on the date shown. Markets move, official figures are revised, and individual pay varies widely by location,
        employer, level and negotiation. Ranges and medians are not promises of what you will earn.
      </p>

      <h2>Tax and immigration rules</h2>
      <p>
        Rules change, often yearly. Where we mention a rate, threshold or visa route, check the official government page linked in the
        article for the current version before you rely on it.
      </p>

      <h2>No guarantees</h2>
      <p>
        We work hard to be accurate (see our <Link href="/editorial-policy">Editorial Policy</Link>), but we make no guarantee that
        content is complete, current or error-free, and we are not liable for decisions made on the basis of it.
      </p>

      <h2>Our own projects</h2>
      <p>
        Occasionally we write about open-source projects or products built by the {SITE.name} team. Those articles say so clearly at the
        top. We do not accept payment for editorial coverage.
      </p>

      <h2>Advertising</h2>
      <p>
        The site is funded by ads served by Google. Advertisers do not influence our content, and an ad appearing next to an article is
        not an endorsement of the product advertised.
      </p>

      <h2>Spotted an error?</h2>
      <p>
        Email <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a> or use the <Link href="/contact">contact form</Link>. We
        correct confirmed errors promptly and update the article’s “updated” date.
      </p>
    </LegalPage>
  );
}
