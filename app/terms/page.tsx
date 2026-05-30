import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Prose } from '@/components/ui/Prose';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for QuranVoice — how the app may be used, content sourcing, and content authenticity.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        description="Last updated: 2026-05-31. By using QuranVoice you agree to these terms."
      />
      <AppShell>
        <Prose>
          <h2>1. About QuranVoice</h2>
          <p>
            QuranVoice (“we”, “us”, or “the service”) is an independent Quran
            reading, listening, study, and memorization platform. We are not
            affiliated with Quran.com, Quran.Foundation, AlQuran Cloud, Aladhan,
            Archive.org, Supabase, or any translation/tafsir publisher whose work
            may be served through the service.
          </p>

          <h2>2. Acceptable use</h2>
          <p>You agree to use QuranVoice with respect for the source material and other users. You must not:</p>
          <ul>
            <li>scrape, redistribute, or rehost Quran data in violation of the licenses of the upstream providers we attribute on each relevant page;</li>
            <li>use the service to harass, defame, or harm others;</li>
            <li>attempt to bypass authentication, rate limits, or security controls;</li>
            <li>misrepresent QuranVoice content as your own scholarship.</li>
          </ul>

          <h2>3. Content sourcing &amp; authenticity</h2>
          <p>
            QuranVoice serves Quranic text, translations, tafsir, recitations,
            Asbab al-Nuzul, and Shan-e-Nuzool entries only from verified third-party
            sources or approved reviewed entries.
          </p>
          <ul>
            <li>
              <strong>Quran text</strong> is served from the Quran.Foundation
              Content API when configured, otherwise from the open Tanzil dataset
              via AlQuran Cloud. The Arabic text is in the public domain.
            </li>
            <li>
              <strong>Translations</strong> remain the copyright of their original
              translators and publishers. QuranVoice serves them as a reader
              interface only; attribution appears beneath every translated ayah.
            </li>
            <li>
              <strong>Tafsir</strong> works remain the copyright of their authors and
              publishers. QuranVoice serves them only when the underlying provider
              licenses redistribution and full source attribution is shown.
            </li>
            <li>
              <strong>Audio recitations</strong> are streamed from third-party CDNs
              (Quran.Foundation, Islamic.Network, or AlQuran Cloud); we do not host
              the audio. Each reciter card lists the source.
            </li>
            <li>
              <strong>Shan-e-Nuzool</strong> entries are shown only after passing a
              manual review workflow. We do not auto-import OCR text into the
              reader. See the source disclosure at <code>/sources/shan-e-nuzool</code>.
            </li>
          </ul>

          <h2>4. No AI-generated religious content</h2>
          <p>
            QuranVoice does not generate tafsir, Asbab al-Nuzul, Shan-e-Nuzool,
            Tajweed rulings, or any other Quranic explanation using AI and present
            it as source-backed religious content. Editorial reading guides in the
            Learning Library are clearly marked as editorial and do not constitute
            tafsir.
          </p>

          <h2>5. Quran.Foundation Content API</h2>
          <p>
            When configured, QuranVoice retrieves Quranic content through the
            Quran.Foundation Content API under their terms of service. Your use of
            QuranVoice does not grant you any rights to the Quran.Foundation API
            beyond what their terms permit. If a downstream resource becomes
            unavailable, the affected UI section shows an explicit
            “Content not available yet” state.
          </p>

          <h2>6. User accounts &amp; user data</h2>
          <p>
            QuranVoice optionally uses Supabase for user authentication and to sync
            bookmarks, notes, collections, reading progress, memorization items,
            reading goals, and user settings. Guests can use the app without an
            account; in that case study data lives in the browser only. See our
            <a href="/privacy"> Privacy Policy</a> for details.
          </p>

          <h2>7. No warranty</h2>
          <p>
            The service is provided “as is”. We do our best to keep content
            accurate and available, but make no warranty of uninterrupted service,
            error-free operation, or fitness for a particular purpose. For matters
            of religious practice, please consult a qualified scholar.
          </p>

          <h2>8. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by applicable law, QuranVoice and its
            contributors shall not be liable for any indirect, incidental,
            consequential, or special damages arising out of or in connection with
            your use of the service.
          </p>

          <h2>9. Changes</h2>
          <p>
            We may update these terms over time. When we do, we will update the
            “Last updated” date above. Material changes will be highlighted in the
            app and, where appropriate, communicated by email to signed-in users.
          </p>

          <h2>10. Contact</h2>
          <p>
            Questions about these terms? Reach us via the{' '}
            <a href="/contact">Contact</a> page.
          </p>
        </Prose>
      </AppShell>
    </>
  );
}
