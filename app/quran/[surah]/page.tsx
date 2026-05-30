import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { ErrorState } from '@/components/ui/ErrorState';
import { QuranReader } from '@/components/quran/QuranReader';
import { getSurahMeta, getSurahWithAyahs } from '@/lib/services/quranService';

interface Params {
  params: Promise<{ surah: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { surah } = await params;
  const n = Number(surah);
  if (!Number.isInteger(n) || n < 1 || n > 114) return { title: 'Surah not found' };
  const meta = await getSurahMeta(n);
  if (!meta) return { title: 'Surah not found' };
  return {
    title: `Surah ${meta.transliteration} (${meta.meaning})`,
    description: `Read Surah ${meta.transliteration} — ${meta.meaning}. ${meta.ayahCount} ayahs · ${meta.revelation === 'meccan' ? 'Meccan' : 'Medinan'}.`,
    alternates: { canonical: `/quran/${n}` },
  };
}

export default async function SurahPage({ params }: Params) {
  const { surah } = await params;
  const n = Number(surah);
  if (!Number.isInteger(n) || n < 1 || n > 114) notFound();
  const data = await getSurahWithAyahs(n);
  return (
    <AppShell withSidebar>
      {data ? (
        <QuranReader
          surah={data.surah}
          ayahs={data.ayahs}
          textSourceName={data.textSourceName}
        />
      ) : (
        <ErrorState
          title="Surah text unavailable"
          description="We could not load the Arabic text from the verified source. Please try again."
        />
      )}
    </AppShell>
  );
}
