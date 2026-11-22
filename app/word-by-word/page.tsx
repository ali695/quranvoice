import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { WordByWordExplorer } from '@/components/quran/WordByWordExplorer';

export const metadata: Metadata = {
  title: 'Word by Word',
  description: 'Word-by-word Quran with transliteration and the meaning of every word.',
};

export default function WordByWordPage() {
  return (
    <>
      <PageHeader
        eyebrow="Study"
        title="Word by Word"
        description="Per-word Arabic, transliteration, and meaning — loaded live from the connected source."
      />
      <AppShell>
        <WordByWordExplorer />
      </AppShell>
    </>
  );
}
