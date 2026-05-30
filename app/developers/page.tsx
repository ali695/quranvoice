import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Prose } from '@/components/ui/Prose';

export const metadata: Metadata = {
  title: 'Developers',
  description: 'How QuranVoice is built and how to integrate.',
};

export default function DevelopersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Developers"
        title="QuranVoice for developers"
        description="Architecture, public proxy routes, and how the Resource Registry works."
      />
      <AppShell>
        <Prose>
          <h2>Architecture</h2>
          <p>
            QuranVoice is built with Next.js (App Router), React, TypeScript, and Tailwind. The
            service layer accepts either the Quran.com Foundation API (via OAuth) or the open
            AlQuran Cloud provider — switching automatically based on environment variables.
          </p>

          <h2>Public proxy routes</h2>
          <p>The server exposes the following JSON proxy routes:</p>
          <ul>
            <li><code>/api/quran/chapters</code></li>
            <li><code>/api/quran/surah/[surah]</code></li>
            <li><code>/api/quran/ayah/[surah]/[ayah]</code></li>
            <li><code>/api/quran/juz/[juz]</code></li>
            <li><code>/api/quran/page/[page]</code></li>
            <li><code>/api/quran/search?q=…</code></li>
            <li><code>/api/quran/translations</code> · <code>/api/quran/translations/[surah]?id=…</code></li>
            <li><code>/api/quran/tafsirs</code> · <code>/api/quran/tafsirs/[surah]/[ayah]?id=…</code></li>
            <li><code>/api/quran/recitations</code></li>
            <li><code>/api/quran/audio/[reciter]/[surah]</code></li>
            <li><code>/api/quran/asbab/[surah]/[ayah]</code></li>
          </ul>

          <h2>Resource Registry</h2>
          <p>
            Every piece of religious content displayed by QuranVoice must come from a registered
            resource. Registry entries include source attribution, license status, and a flag that
            controls whether the resource can be displayed. Unregistered or unverified sources are
            never rendered — the UI shows an explicit unavailable state instead.
          </p>
        </Prose>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button href="/api-docs" variant="secondary">API documentation</Button>
          <Button href="/disclaimer" variant="ghost">Disclaimer</Button>
        </div>
      </AppShell>
    </>
  );
}
