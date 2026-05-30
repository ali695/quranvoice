import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { StudyPanel } from '@/components/study/StudyPanel';
import { getAyah, getSurahMeta } from '@/lib/services/quranService';

interface Params {
  params: Promise<{ surah: string; ayah: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { surah, ayah } = await params;
  return {
    title: `Study ${surah}:${ayah}`,
    description: `Tafsir, word-by-word, Asbab al-Nuzul, and reflections for Quran ${surah}:${ayah}.`,
    alternates: { canonical: `/study/${surah}/${ayah}` },
  };
}

export default async function StudyDetail({ params }: Params) {
  const { surah, ayah } = await params;
  const s = Number(surah);
  const a = Number(ayah);
  if (!Number.isInteger(s) || s < 1 || s > 114) notFound();
  if (!Number.isInteger(a) || a < 1) notFound();
  const meta = await getSurahMeta(s);
  const ayahData = await getAyah(s, a);
  return (
    <>
      <PageHeader
        eyebrow={`Surah ${s} · Ayah ${a}`}
        title={meta ? `Studying ${meta.transliteration} ${a}` : `Quran ${s}:${a}`}
        description="Tafsir, word-by-word, Asbab al-Nuzul, and personal study tools."
        actions={
          <Button href={`/quran/${s}/${a}`} variant="outline">
            <Icon name="book" size={14} />
            Open in reader
          </Button>
        }
      />
      <AppShell>
        {ayahData?.arabic && (
          <div className="mb-8 rounded-2xl border border-ink-600/50 bg-ink-800/40 p-6 md:p-8">
            <p
              className="arabic text-right text-3xl leading-[2.1] text-cream-50 sm:text-4xl"
              dir="rtl"
              lang="ar"
            >
              {ayahData.arabic}
            </p>
          </div>
        )}
        <StudyPanel surah={s} ayah={a} />
      </AppShell>
    </>
  );
}
