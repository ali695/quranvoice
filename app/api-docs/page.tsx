import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Prose } from '@/components/ui/Prose';

export const metadata: Metadata = {
  title: 'API Documentation',
  description: 'API documentation for QuranVoice proxy routes.',
};

export default function ApiDocsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Developers"
        title="API Documentation"
        description="Server-side JSON endpoints exposed by QuranVoice."
      />
      <AppShell>
        <Prose>
          <h2>Authentication</h2>
          <p>
            The QuranVoice proxy is read-only and does not require client-side authentication.
            On the server, the proxy may call upstream providers using OAuth credentials stored
            as environment variables: <code>QURAN_API_CLIENT_ID</code> /
            <code> QURAN_API_CLIENT_SECRET</code> for the Quran.com Foundation API. When these
            are absent, the proxy falls back to the open AlQuran Cloud provider.
          </p>

          <h2>Common response shape</h2>
          <p>
            Successful responses use <code>{`{ "data": ... }`}</code>. Failures use{' '}
            <code>{`{ "error": { "message": "…" } }`}</code> with HTTP 4xx/5xx codes.
          </p>

          <h2>Endpoints</h2>
          <ul>
            <li>
              <strong>GET</strong> <code>/api/quran/chapters</code> — list all surahs metadata.
            </li>
            <li>
              <strong>GET</strong> <code>/api/quran/surah/[surah]</code> — Arabic text and ayah list.
            </li>
            <li>
              <strong>GET</strong> <code>/api/quran/ayah/[surah]/[ayah]</code> — single ayah.
            </li>
            <li>
              <strong>GET</strong> <code>/api/quran/translations</code> — translation catalog.
            </li>
            <li>
              <strong>GET</strong> <code>/api/quran/translations/[surah]?id=…</code> — translation per surah.
            </li>
            <li>
              <strong>GET</strong> <code>/api/quran/tafsirs</code> · <code>/api/quran/tafsirs/[surah]/[ayah]?id=…</code> — tafsir
              when registered.
            </li>
            <li>
              <strong>GET</strong> <code>/api/quran/recitations</code> — reciter list.
            </li>
            <li>
              <strong>GET</strong> <code>/api/quran/audio/[reciter]/[surah]</code> — audio URL.
            </li>
            <li>
              <strong>GET</strong> <code>/api/quran/asbab/[surah]/[ayah]</code> — Asbab al-Nuzul when registered.
            </li>
            <li>
              <strong>GET</strong> <code>/api/quran/search?q=…</code> — search surahs, references,
              and English translation.
            </li>
            <li>
              <strong>GET</strong> <code>/api/quran/juz/[juz]</code>, <code>/api/quran/page/[page]</code> — juz / page metadata.
            </li>
          </ul>

          <h2>Caching</h2>
          <p>
            Surah and translation endpoints are cached at the edge with a 1-hour revalidation
            window. Catalogs (chapters, translations, recitations) are cached for 24 hours.
          </p>
        </Prose>
      </AppShell>
    </>
  );
}
