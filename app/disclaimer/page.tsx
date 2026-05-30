import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Prose } from '@/components/ui/Prose';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'QuranVoice content disclaimer.',
};

export default function DisclaimerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Disclaimer"
        description="Important information about how content is sourced."
      />
      <AppShell>
        <Prose>
          <h2>Independent platform</h2>
          <p>
            QuranVoice is an independent reading platform. It is not affiliated with Quran.com,
            AlQuran Cloud, the Aladhan API, or any of the publishers whose translations or
            tafsir works may be served through it.
          </p>

          <h2>Content sourcing</h2>
          <p>
            All Quran text, translations, tafsir, recitations, and Asbab al-Nuzul entries are
            served from third-party sources attributed on each relevant page. When a verified
            source is not connected, QuranVoice shows an explicit unavailable state — we do not
            substitute synthesized religious content.
          </p>

          <h2>Religious accuracy</h2>
          <p>
            For matters of religious practice, please consult a qualified scholar. QuranVoice
            does not provide religious rulings (fatāwā) and does not generate religious
            commentary.
          </p>
        </Prose>
      </AppShell>
    </>
  );
}
