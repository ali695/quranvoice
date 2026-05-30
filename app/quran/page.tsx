import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { SurahGrid } from '@/components/quran/SurahGrid';
import { listAllSurahs } from '@/lib/services/quranService';

export const metadata: Metadata = {
  title: 'Read the Quran',
  description: 'Read the Noble Quran by Surah, Juz, or page. Browse all 114 surahs.',
};

export default async function QuranIndexPage() {
  const surahs = await listAllSurahs();
  return (
    <>
      <PageHeader
        eyebrow="Mushaf"
        title="Read the Quran"
        description="Browse all 114 surahs of the Noble Quran."
      />
      <AppShell withSidebar>
        <SurahGrid surahs={surahs} />
      </AppShell>
    </>
  );
}
