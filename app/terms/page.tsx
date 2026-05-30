import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Prose } from '@/components/ui/Prose';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for QuranVoice.',
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        description="Last updated: 2026-05-30"
      />
      <AppShell>
        <Prose>
          <h2>Acceptable use</h2>
          <p>
            QuranVoice is provided for the personal study and recitation of the Quran. You agree
            not to use the service to scrape, redistribute, or rehost Quran data in ways that
            violate the licenses of the upstream providers we attribute on every relevant page.
          </p>

          <h2>Content disclaimer</h2>
          <p>
            QuranVoice is not a substitute for qualified scholarship. Translations, tafsir,
            recitations, and Asbab al-Nuzul entries — when displayed — are the work of their
            original authors and publishers; QuranVoice serves them only as a reader interface.
          </p>

          <h2>No warranty</h2>
          <p>
            The service is provided “as is”. We do our best to keep content accurate and
            available, but we make no warranty of uninterrupted service or fitness for a
            particular purpose.
          </p>

          <h2>Liability</h2>
          <p>
            To the maximum extent permitted by law, QuranVoice shall not be liable for any
            indirect, incidental, or consequential damages arising out of your use of the
            service.
          </p>

          <h2>Changes</h2>
          <p>
            We may update these terms over time. When we do, we will update the &ldquo;last
            updated&rdquo; date above. Material changes will be highlighted in-app.
          </p>
        </Prose>
      </AppShell>
    </>
  );
}
