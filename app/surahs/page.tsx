import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { SurahGrid } from '@/components/quran/SurahGrid';
import { listAllSurahs } from '@/lib/services/quranService';

export const metadata: Metadata = {
  title: 'All Surahs',
  description: 'Browse all 114 surahs of the Quran with name, meaning, ayah count, and revelation.',
};

interface SearchParams {
  searchParams: Promise<{ revelation?: string }>;
}

export default async function SurahsPage({ searchParams }: SearchParams) {
  const { revelation } = await searchParams;
  const all = await listAllSurahs();
  const filtered =
    revelation === 'meccan'
      ? all.filter((s) => s.revelation === 'meccan')
      : revelation === 'medinan'
        ? all.filter((s) => s.revelation === 'medinan')
        : all;
  const label =
    revelation === 'meccan' ? 'Meccan surahs' : revelation === 'medinan' ? 'Medinan surahs' : 'Surahs';
  return (
    <>
      <PageHeader
        eyebrow="Mushaf"
        title={label}
        description={`${filtered.length} surahs in mushaf order.`}
      />
      <AppShell withSidebar>
        <SurahGrid surahs={filtered} />
      </AppShell>
    </>
  );
}
