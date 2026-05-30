import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { JUZS } from '@/lib/data/juz';
import { getSurahByNumber } from '@/lib/data/fallbackSurahs';

interface Params {
  params: Promise<{ juz: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { juz } = await params;
  const n = Number(juz);
  return {
    title: `Juz ${n}`,
    description: `Quran Juz ${n} — read the verses and surahs covered by this part.`,
    alternates: { canonical: `/juz/${n}` },
  };
}

export default async function JuzDetail({ params }: Params) {
  const { juz } = await params;
  const n = Number(juz);
  if (!Number.isInteger(n) || n < 1 || n > 30) notFound();
  const data = JUZS.find((j) => j.number === n)!;
  const start = getSurahByNumber(data.startSurah);
  const end = getSurahByNumber(data.endSurah);
  const span: Array<{ surah: number; name: string; arabic: string }> = [];
  for (let s = data.startSurah; s <= data.endSurah; s++) {
    const m = getSurahByNumber(s);
    if (m) span.push({ surah: s, name: m.transliteration, arabic: m.arabic });
  }
  return (
    <>
      <PageHeader
        eyebrow={`Juz ${n}`}
        title={`Part ${n} of the Quran`}
        description={`Starts at ${start?.transliteration} ${data.startSurah}:${data.startAyah}, ends at ${end?.transliteration} ${data.endSurah}:${data.endAyah}.`}
        actions={
          <Button href={`/quran/${data.startSurah}/${data.startAyah}`}>
            <Icon name="book" size={16} />
            Start reading
          </Button>
        }
      />
      <AppShell withSidebar>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {span.map((s) => (
            <Card key={s.surah} as="li" variant="elevated">
              <Link href={`/quran/${s.surah}`} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-cream-200/45">Surah {s.surah}</p>
                  <p className="mt-0.5 font-display text-base text-cream-50">{s.name}</p>
                </div>
                <span className="arabic text-2xl text-cream-100" dir="rtl" lang="ar">
                  {s.arabic}
                </span>
              </Link>
            </Card>
          ))}
        </ul>
      </AppShell>
    </>
  );
}
