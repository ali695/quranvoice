import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Prose } from '@/components/ui/Prose';

export const metadata: Metadata = {
  title: 'Copyright',
  description: 'Copyright notice and attribution for QuranVoice content.',
};

export default function CopyrightPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Copyright & Attribution"
        description="Notices for the content QuranVoice displays."
      />
      <AppShell>
        <Prose>
          <h2>QuranVoice software</h2>
          <p>
            The QuranVoice user interface, code, and editorial content (e.g. the Learning
            Library articles) are copyright © QuranVoice. UI elements may not be copied without
            permission.
          </p>

          <h2>Quran text</h2>
          <p>
            The Arabic text of the Quran is in the public domain. QuranVoice serves the
            Uthmani script via Tanzil.net / AlQuran Cloud and attributes the source on the
            reader.
          </p>

          <h2>Translations and tafsir</h2>
          <p>
            Each translation or tafsir is the copyright of its respective author or publisher.
            QuranVoice acts as a reader interface only; attribution appears on every translation
            and tafsir display. If you are a rights holder and would like a work removed from
            the catalog, please <a href="/contact">contact us</a>.
          </p>

          <h2>Audio recitations</h2>
          <p>
            Audio recitations are streamed from third-party CDNs (e.g. AlQuran Cloud / Islamic
            Network). Each reciter card lists the source. QuranVoice does not own the audio.
          </p>
        </Prose>
      </AppShell>
    </>
  );
}
