import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { getSurahByNumber } from '@/lib/data/fallbackSurahs';
import { getJuzDetails } from '@/lib/data/juzDetails';
import { STRUCTURE_SOURCE } from '@/lib/data/quranStructure';

interface Params {
  params: Promise<{ juz: string }>;
}

const QUARTER_LABEL = ['Start of Hizb', '¼ Hizb', '½ Hizb', '¾ Hizb'] as const;

function surahName(n: number): string {
  return getSurahByNumber(n)?.transliteration ?? `Surah ${n}`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { juz } = await params;
  const d = getJuzDetails(Number(juz));
  if (!d) return { title: 'Juz not found' };
  const names = d.surahs.map((s) => surahName(s.surah));
  const span = names.length > 3 ? `${names[0]} to ${names[names.length - 1]}` : names.join(', ');
  return {
    title: `Juz ${d.number} (Para ${d.number}) · ${span}`,
    description: `Juz ${d.number} of the Quran runs from ${surahName(d.start[0])} ${d.start.join(':')} to ${surahName(d.end[0])} ${d.end.join(':')}: ${d.ayahCount} ayahs on mushaf pages ${d.firstPage}–${d.lastPage}, with its hizb quarters and surahs.`,
    alternates: { canonical: `/juz/${d.number}` },
  };
}

export default async function JuzDetail({ params }: Params) {
  const { juz } = await params;
  const d = getJuzDetails(Number(juz));
  if (!d) notFound();
  const [startSurah, startAyah] = d.start;
  const [endSurah, endAyah] = d.end;

  const facts: Array<{ label: string; value: string }> = [
    { label: 'Ayahs', value: String(d.ayahCount) },
    { label: 'Surahs', value: String(d.surahs.length) },
    { label: 'Mushaf pages', value: `${d.firstPage}–${d.lastPage}` },
    { label: 'Hizb', value: `${d.quarters[0].hizb}–${d.quarters[7].hizb}` },
    { label: 'Rukus starting here', value: String(d.rukusStarting) },
    { label: 'Manzil', value: String(d.manzil) },
  ];

  return (
    <>
      <PageHeader
        eyebrow={`Juz ${d.number} · Para ${d.number}`}
        title={`Part ${d.number} of the Quran`}
        description={`Starts at ${surahName(startSurah)} ${startSurah}:${startAyah} and ends at ${surahName(endSurah)} ${endSurah}:${endAyah}.`}
        actions={
          <Button href={`/quran/${startSurah}/${startAyah}`}>
            <Icon name="book" size={16} />
            Start reading
          </Button>
        }
      />
      <AppShell withSidebar>
        <div className="space-y-10">
          <section aria-labelledby="juz-facts">
            <h2 id="juz-facts" className="sr-only">
              Juz {d.number} at a glance
            </h2>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {facts.map((f) => (
                <Card key={f.label} variant="elevated" className="p-4">
                  <dt className="text-xs uppercase tracking-wider text-cream-200/45">{f.label}</dt>
                  <dd className="mt-1 font-display text-xl text-cream-50">{f.value}</dd>
                </Card>
              ))}
            </dl>
          </section>

          <section aria-labelledby="juz-surahs">
            <h2 id="juz-surahs" className="font-display text-xl text-cream-50">
              Surahs in Juz {d.number}
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {d.surahs.map((s) => {
                const meta = getSurahByNumber(s.surah);
                return (
                  <Card key={s.surah} as="li" variant="elevated">
                    <Link
                      href={s.fromAyah === 1 ? `/quran/${s.surah}` : `/quran/${s.surah}/${s.fromAyah}`}
                      className="flex items-center justify-between gap-4 p-4"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-wider text-cream-200/45">Surah {s.surah}</p>
                        <p className="mt-0.5 font-display text-base text-cream-50">{meta?.transliteration}</p>
                        <p className="mt-1 text-xs text-cream-200/60">
                          {s.complete
                            ? `Complete · ${s.toAyah} ayahs`
                            : `Ayahs ${s.fromAyah}–${s.toAyah} of ${meta?.ayahCount ?? '?'}`}
                        </p>
                      </div>
                      {meta && (
                        <span className="arabic text-2xl text-cream-100" dir="rtl" lang="ar">
                          {meta.arabic}
                        </span>
                      )}
                    </Link>
                  </Card>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="juz-quarters">
            <h2 id="juz-quarters" className="font-display text-xl text-cream-50">
              Hizb quarters
            </h2>
            <p className="mt-1 text-sm text-cream-200/65">
              Each juz holds two hizbs, and each hizb is split into four quarters (rub&apos; al-hizb) — common
              stopping points for daily reading and revision.
            </p>
            <ol className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {d.quarters.map((q) => {
                const [s, a] = q.start;
                return (
                  <li key={`${q.hizb}-${q.quarter}`}>
                    <Link
                      href={`/quran/${s}/${a}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-ink-600/50 px-4 py-3 text-sm transition-colors hover:border-gold-500/50"
                    >
                      <span className="text-cream-100">
                        Hizb {q.hizb} · {QUARTER_LABEL[q.quarter]}
                      </span>
                      <span className="text-cream-200/60">
                        {surahName(s)} {s}:{a}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>

          {d.sajdahs.length > 0 && (
            <section aria-labelledby="juz-sajdah">
              <h2 id="juz-sajdah" className="font-display text-xl text-cream-50">
                Verses of prostration (sajdah)
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {d.sajdahs.map(([s, a]) => (
                  <li key={`${s}:${a}`}>
                    <Link
                      href={`/quran/${s}/${a}`}
                      className="inline-flex rounded-full border border-gold-500/40 px-3 py-1 text-sm text-gold-200 hover:border-gold-400"
                    >
                      {surahName(s)} {s}:{a}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <nav aria-label="Juz navigation" className="flex items-center justify-between gap-3 text-sm">
            {d.number > 1 ? (
              <Link href={`/juz/${d.number - 1}`} className="text-gold-300 hover:text-gold-200">
                ← Juz {d.number - 1}
              </Link>
            ) : (
              <span />
            )}
            <Link href="/juz" className="text-cream-200/70 hover:text-cream-100">
              All 30 juz
            </Link>
            {d.number < 30 ? (
              <Link href={`/juz/${d.number + 1}`} className="text-gold-300 hover:text-gold-200">
                Juz {d.number + 1} →
              </Link>
            ) : (
              <span />
            )}
          </nav>

          <p className="text-xs text-cream-200/45">
            Juz, hizb, page, ruku and sajdah positions:{' '}
            <a href={STRUCTURE_SOURCE.url} className="underline hover:text-cream-200" rel="noopener">
              {STRUCTURE_SOURCE.name}
            </a>{' '}
            metadata, licensed{' '}
            <a href={STRUCTURE_SOURCE.licenseUrl} className="underline hover:text-cream-200" rel="noopener license">
              {STRUCTURE_SOURCE.license}
            </a>
            . Page numbers follow the 604-page Madani mushaf.
          </p>
        </div>
      </AppShell>
    </>
  );
}
