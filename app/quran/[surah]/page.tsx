import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { ErrorState } from '@/components/ui/ErrorState';
import { QuranReader } from '@/components/quran/QuranReader';
import { SurahIntro } from '@/components/quran/SurahIntro';
import { getCurrentLocale } from '@/lib/i18n/server';
import { getSurahMeta, getSurahWithAyahs } from '@/lib/services/quranService';
import { getSurahIntro } from '@/lib/services/surahInfoService';

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
    description: `Read Surah ${meta.transliteration} (${meta.meaning}) in Arabic with translation and audio: ${meta.ayahCount} ayahs, ${meta.revelation === 'meccan' ? 'Meccan' : 'Medinan'}, with an introduction to its name, period of revelation and themes.`,
    alternates: { canonical: `/quran/${n}` },
  };
}

export default async function SurahPage({ params }: Params) {
  const { surah } = await params;
  const n = Number(surah);
  if (!Number.isInteger(n) || n < 1 || n > 114) notFound();
  const [data, locale] = await Promise.all([getSurahWithAyahs(n), getCurrentLocale()]);
  const intro = data ? await getSurahIntro(n, locale) : null;
  return (
    <AppShell withSidebar>
      {data ? (
        <QuranReader
          surah={data.surah}
          ayahs={data.ayahs}
          textSourceName={data.textSourceName}
          intro={intro ? <SurahIntro intro={intro} surahName={data.surah.transliteration} surahNameArabic={data.surah.arabic} /> : null}
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
