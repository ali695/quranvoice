import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Prose } from '@/components/ui/Prose';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How QuranVoice handles your data.',
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated: 2026-05-30"
      />
      <AppShell>
        <Prose>
          <h2>Summary</h2>
          <p>
            QuranVoice is designed to be private by default. Bookmarks, notes, settings, and
            reading progress live on your device. We do not run third-party advertising or
            behavioral trackers.
          </p>

          <h2>What stays on your device</h2>
          <ul>
            <li>Bookmarks, collections, and tags</li>
            <li>Personal notes on ayahs</li>
            <li>Reading settings and audio preferences</li>
            <li>Reading history and streak data</li>
          </ul>

          <h2>What is sent to servers</h2>
          <p>
            When you open a surah, ayah, translation, tafsir, or recitation, QuranVoice fetches
            that content from upstream Quran data providers (e.g. AlQuran Cloud / the Quran.com
            Foundation API). These requests pass through our proxy and may be cached by our
            edge network. We log only what is necessary to operate the service.
          </p>

          <h2 id="cookies">Cookies</h2>
          <p>
            QuranVoice uses cookies only as needed for core functionality. We do not set
            advertising cookies. If account sync ships in the future, a small session cookie
            will be added — this policy will be updated to describe it.
          </p>

          <h2>Your choices</h2>
          <p>
            You can delete all local QuranVoice data at any time from the Settings page →
            Account → Delete local data. You can also export bookmarks and notes from the same
            page.
          </p>
        </Prose>
      </AppShell>
    </>
  );
}
