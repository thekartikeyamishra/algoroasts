import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { LegalPage } from '@/components/layout/LegalPage';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: `How ${SITE.name} handles personal data, cookies and Google advertising, and the rights you have under the GDPR, UK GDPR, India's DPDP Act and US state privacy laws.`,
  path: '/privacy',
});

export default function PrivacyPage() {
  const email = SITE.contact.email;
  return (
    <LegalPage
      title="Privacy Policy"
      intro={`This policy explains what ${SITE.name} collects, why, who it is shared with and the choices you have. We collect as little as possible: there are no accounts, and the calculators run entirely in your browser.`}
    >
      <h2>Who is responsible</h2>
      <p>
        {SITE.name} ({SITE.url.replace('https://', '')}) is operated by {SITE.founder.name}, {SITE.founder.location} (“we”, “us”).
        For any privacy question or request, email <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Information you give us.</strong> If you join the invite list or contact us, we receive your email address, the role you
          select, any message you write and the date you gave consent.
        </li>
        <li>
          <strong>Calculator inputs.</strong> Numbers you type into our tools are processed in your browser and are not sent to us. They
          appear in the page address only so you can bookmark or share a result.
        </li>
        <li>
          <strong>Data stored on your device.</strong> We use your browser’s local storage for your theme, saved articles, visit streak
          and invite status. It stays on your device and you can clear it at any time in your browser settings.
        </li>
        <li>
          <strong>Technical data.</strong> Our hosting provider processes standard server logs (IP address, browser type, pages
          requested) to deliver and secure the site.
        </li>
      </ul>

      <h2>Advertising and cookies (Google AdSense)</h2>
      <p>
        We show ads served by Google AdSense to keep the site free. Third-party vendors, including Google, use cookies to serve ads based
        on your previous visits to this and other websites. Google’s use of advertising cookies enables it and its partners to serve ads
        to you based on your visits to this and/or other sites on the internet.
      </p>
      <ul>
        <li>
          You can opt out of personalised advertising in{' '}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google’s Ads Settings</a>, or opt out of
          some third-party vendors’ cookies at{' '}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info</a>.
        </li>
        <li>
          Learn how Google uses information from sites that use its services:{' '}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
            How Google uses information from sites or apps that use our services
          </a>.
        </li>
        <li>
          Visitors in the European Economic Area, the UK and Switzerland are shown a consent message (provided by Google, a certified
          consent management platform) before personalised ads or advertising cookies are used. If you decline, Google may still show
          non-personalised ads, which use cookies for frequency capping, fraud prevention and aggregated reporting.
        </li>
      </ul>

      <h2>Why we use your data (legal bases)</h2>
      <ul>
        <li><strong>Invite list and product updates</strong> — your consent, which you can withdraw at any time.</li>
        <li><strong>Replying to messages</strong> — our legitimate interest in answering you, or steps you asked us to take.</li>
        <li><strong>Personalised advertising</strong> — your consent where the law requires it (for example the EEA and UK).</li>
        <li><strong>Security and site operation</strong> — our legitimate interest in keeping the site available and safe.</li>
      </ul>

      <h2>Who we share data with</h2>
      <p>We do not sell your personal data. We share it only with service providers who help us run the site:</p>
      <ul>
        <li>our hosting provider (site delivery and logs);</li>
        <li>Google (advertising, as described above);</li>
        <li>the tool we use to store invite-list sign-ups and messages (for example a spreadsheet or email service).</li>
      </ul>
      <p>These providers may process data outside your country, including in the United States, under their own safeguards.</p>

      <h2>How long we keep it</h2>
      <p>
        Invite-list data is kept until you unsubscribe or ask us to delete it, or until the invite programme ends. Messages are kept as
        long as needed to deal with them and then deleted within 24 months.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live — including under the EU and UK GDPR, India’s Digital Personal Data Protection Act, 2023, and US
        state laws such as the California Consumer Privacy Act — you may have the right to access, correct or delete your data,
        withdraw consent, object to processing, and complain to a data protection authority. Email{' '}
        <a href={`mailto:${email}`}>{email}</a> and we will respond within 30 days. We do not sell or share personal information for
        cross-context behavioural advertising beyond the Google advertising described above, which you can control through the consent
        message and Google’s settings.
      </p>

      <h2>Children</h2>
      <p>This site is intended for adults. We do not knowingly collect personal data from anyone under 18.</p>

      <h2>Security</h2>
      <p>The site is served only over HTTPS. Submissions are validated, rate-limited and sent to our storage over an encrypted connection.</p>

      <h2>Changes</h2>
      <p>
        If we change this policy, we will update the date at the top of this page. Significant changes will be highlighted on the site.
        See also our <Link href="/terms">Terms of Use</Link>.
      </p>
    </LegalPage>
  );
}
