import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { LegalPage } from '@/components/layout/LegalPage';
import { ContactForm } from '@/components/invite/ContactForm';

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description: `Contact ${SITE.name}: corrections, data requests, partnership and press enquiries.`,
  path: '/contact',
});

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact us"
      intro="Found an error, want a country added to a calculator, or have a privacy request? We read every message."
    >
      <ul>
        <li>
          Email: <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>
        </li>
        <li>Run by: {SITE.founder.name}, {SITE.founder.location}</li>
        <li>
          Elsewhere: <a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a> ·{' '}
          <a href={SITE.social.x} target="_blank" rel="noopener noreferrer">X</a>
        </li>
      </ul>
      <p>For privacy requests (access, correction, deletion), please say which email address you used so we can find your data.</p>
      <div className="not-prose mt-8">
        <ContactForm />
      </div>
    </LegalPage>
  );
}
