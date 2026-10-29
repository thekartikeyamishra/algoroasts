import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { LegalPage } from '@/components/layout/LegalPage';

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Use',
  description: `The terms that apply when you use ${SITE.name}, its guides, calculators and invite list.`,
  path: '/terms',
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro={`By using ${SITE.name} you agree to these terms. They are written to be read, so please do read them — especially the parts about advice and liability.`}
    >
      <h2>1. What we provide</h2>
      <p>
        {SITE.name} publishes general information about developer careers, compensation, skills and relocation, and offers free
        calculators. The service is provided free of charge and is funded by advertising.
      </p>

      <h2>2. Not professional advice</h2>
      <p>
        Nothing on this site is financial, investment, tax, legal, immigration or employment advice, and no professional relationship
        is created by using it. Salaries, rates, tax rules and visa requirements change and vary by person. Always confirm with the
        official source and a qualified professional before making a decision. See the <Link href="/disclaimer">Disclaimer</Link>.
      </p>

      <h2>3. Calculators</h2>
      <p>
        Calculator results are estimates based only on the numbers you enter and the assumptions shown on the page. They are provided
        for comparison and education and may not reflect your actual income, costs or tax position.
      </p>

      <h2>4. Invite list and early access</h2>
      <p>
        Joining the invite list does not guarantee access by any date, any particular features or any price. We may open access in
        batches, change the product or end the programme. Store links for our mobile apps will be added only when the apps are
        actually available.
      </p>

      <h2>5. Acceptable use</h2>
      <p>
        Do not misuse the site: no automated scraping that degrades performance, no attempts to break security, no submitting
        false or other people’s details, and no generating invalid ad clicks or impressions.
      </p>

      <h2>6. Content and intellectual property</h2>
      <p>
        Our text, design and code are owned by {SITE.name} unless stated otherwise. You may quote short excerpts with a link to the
        original page. Trademarks and data from third parties belong to their owners and are referenced for identification and
        commentary only.
      </p>

      <h2>7. Third-party links and ads</h2>
      <p>
        We link to external sources and show third-party advertising. We do not control and are not responsible for those websites,
        products or offers. An ad on this site is not an endorsement.
      </p>

      <h2>8. Liability</h2>
      <p>
        The site is provided “as is” without warranties of any kind. To the fullest extent permitted by law, {SITE.name} and its
        operator are not liable for any loss or damage arising from your use of, or reliance on, the site or its tools. Nothing in these
        terms limits liability that cannot be limited by law.
      </p>

      <h2>9. Changes and law</h2>
      <p>
        We may update these terms; the date above shows the latest version. These terms are governed by the laws of India, without
        prejudice to any mandatory consumer protections you have where you live.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions: <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>.
      </p>
    </LegalPage>
  );
}
