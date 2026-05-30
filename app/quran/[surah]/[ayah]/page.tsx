import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { ErrorState } from '@/components/ui/ErrorState';
import { QuranReader } from '@/components/quran/QuranReader';
import { getSurahMeta, getSurahWithAyahs } from '@/lib/services/quranService';

interface Params {
  params: Promise<{ surah: string; ayah: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { surah, ayah } = await params;
  const s = Number(surah);
  const a = Number(ayah);
  const meta = s >= 1 && s <= 114 ? await getSurahMeta(s) : null;
  if (!meta) return { title: 'Ayah not found' };
  return {
    title: `Quran ${s}:${a} · Surah ${meta.transliteration}`,
    description: `Read ayah ${a} of Surah ${meta.transliteration} (${meta.meaning}).`,
    alternates: { canonical: `/quran/${s}/${a}` },
  };
}

export default async function AyahPage({ params }: Params) {
  const { surah, ayah } = await params;
  const s = Number(surah);
  const a = Number(ayah);
  if (!Number.isInteger(s) || s < 1 || s > 114) notFound();
  if (!Number.isInteger(a) || a < 1) notFound();
  const data = await getSurahWithAyahs(s);
  return (
    <AppShell withSidebar>
      {data ? (
        <QuranReader
          surah={data.surah}
          ayahs={data.ayahs}
          textSourceName={data.textSourceName}
          highlightAyah={a}
        />
      ) : (
        <ErrorState />
      )}
    </AppShell>
  );
}
