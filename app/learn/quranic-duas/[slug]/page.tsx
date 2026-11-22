import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { DuaPlayButton } from '@/components/learn/DuaPlayButton';
import {
  DUA_CATEGORIES,
  DUA_GROUPS,
  QURANIC_DUAS,
  duaReference,
  getDua,
} from '@/lib/data/learning/quranicDuas';
import { getSurahByNumber } from '@/lib/data/fallbackSurahs';
import { DUA_TRANSLATIONS, duaOpening, getDuaContent } from '@/lib/services/duaService';
import { breadcrumbSchema } from '@/lib/seo/schema';
import { toArabicDigits } from '@/lib/utils/arabicNumber';

export const revalidate = 86400;

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return QURANIC_DUAS.map((d) => ({ slug: d.slug }));
}

/** "Rabbanā ātinā fī l-dun'yā" → "Rabbana atina fi l-dunya" for titles. */
function plain(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[ʿʾ']/g, '')
    .replace(/…$/, '')
    .trim();
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const d = getDua(slug);
  if (!d) return { title: 'Dua not found' };
  const c = await getDuaContent(d);
  const ref = duaReference(d);
  const opening = c ? plain(duaOpening(c, 4)) : d.title;
  const en = c?.ayahs[0]?.en ?? '';
  return {
    title: `${opening} — Quranic Dua ${ref} with Urdu & English Meaning`,
    description: `${d.title} (Quran ${ref}) — ${d.speaker}. Arabic text, transliteration, Urdu and English translation, with audio. ${en.slice(0, 90)}${en.length > 90 ? '…' : ''}`,
    alternates: { canonical: `/learn/quranic-duas/${d.slug}` },
  };
}

export default async function DuaPage({ params }: Params) {
  const { slug } = await params;
  const d = getDua(slug);
  if (!d) notFound();
  const c = await getDuaContent(d);
  const surahName = getSurahByNumber(d.surah)?.transliteration ?? `Surah ${d.surah}`;
  const ref = duaReference(d);
  const index = QURANIC_DUAS.findIndex((x) => x.slug === d.slug);
  const prev = QURANIC_DUAS[index - 1];
  const next = QURANIC_DUAS[index + 1];
  const related = QURANIC_DUAS.filter((x) => x.category === d.category && x.slug !== d.slug).slice(0, 4);
  const group = DUA_GROUPS.find((g) => g.slug === d.group);
  const category = DUA_CATEGORIES.find((x) => x.slug === d.category);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Learn', path: '/learn' },
          { name: 'Quranic duas', path: '/learn/quranic-duas' },
          { name: d.title, path: `/learn/quranic-duas/${d.slug}` },
        ])}
      />
      <PageHeader
        eyebrow={`${group?.label ?? 'Quranic dua'} · Surah ${surahName} ${ref}`}
        title={d.title}
        description={d.speaker}
        actions={<DuaPlayButton surah={d.surah} from={d.from} to={d.to} label={d.title} />}
      />
      <AppShell>
        {!c ? (
          <Card variant="elevated" className="p-6 text-sm text-cream-200/75">
            The dua text could not be loaded right now. Please try again in a moment, or{' '}
            <Link href={`/quran/${d.surah}/${d.from}`} className="text-gold-300 hover:text-gold-200">
              read it in the Quran reader
            </Link>
            .
          </Card>
        ) : (
          <div className="space-y-8">
            <section aria-label="Arabic text" className="rounded-2xl border border-gold-500/25 bg-ink-850/50 p-6 md:p-8">
              {c.ayahs.map((a) => (
                <p key={a.verseKey} className="arabic text-right text-3xl leading-[2.2] md:text-4xl" dir="rtl" lang="ar">
                  {a.leadArabic && <span className="text-cream-200/40">{a.leadArabic} </span>}
                  <span className="text-cream-50">{a.duaArabic}</span>{' '}
                  <span className="ayah-marker font-sans align-middle text-base">{toArabicDigits(a.ayah)}</span>
                </p>
              ))}
              {c.ayahs.some((a) => a.leadArabic) && (
                <p className="mt-4 text-xs text-cream-200/50">
                  The dimmed words introduce the dua in the verse; the dua itself is shown in full brightness.
                </p>
              )}
            </section>

            <section aria-labelledby="translit">
              <h2 id="translit" className="font-display text-lg text-cream-50">
                Transliteration
              </h2>
              <div className="mt-3 space-y-2">
                {c.ayahs.map((a) => (
                  <p key={a.verseKey} className="text-base italic leading-relaxed text-gold-100/90">
                    {a.transliteration}
                  </p>
                ))}
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <section aria-labelledby="english" className="rounded-2xl border border-ink-600/50 bg-ink-800/40 p-5">
                <h2 id="english" className="font-display text-lg text-cream-50">
                  English meaning
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-cream-200/85">
                  {c.ayahs.map((a) => (
                    <p key={a.verseKey}>
                      <span className="mr-1 font-mono text-xs text-gold-300/70">{a.verseKey}</span>
                      {a.en}
                    </p>
                  ))}
                </div>
                <p className="mt-3 text-xs text-cream-200/45">{DUA_TRANSLATIONS.en.name}</p>
              </section>
              <section
                aria-labelledby="urdu"
                lang="ur"
                dir="rtl"
                className="rounded-2xl border border-ink-600/50 bg-ink-800/40 p-5"
              >
                <h2 id="urdu" className="font-display text-lg text-cream-50">
                  اردو ترجمہ
                </h2>
                <div className="mt-3 space-y-3 text-lg leading-loose text-cream-200/90">
                  {c.ayahs.map((a) => (
                    <p key={a.verseKey}>{a.ur}</p>
                  ))}
                </div>
                <p className="mt-3 text-xs text-cream-200/45" dir="ltr" lang="en">
                  {DUA_TRANSLATIONS.ur.name}
                </p>
              </section>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link
                href={`/quran/${d.surah}/${d.from}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-600/70 px-4 py-2 text-cream-100 hover:border-gold-500/40"
              >
                <Icon name="book" size={14} />
                Read in context — Surah {surahName}
              </Link>
              <Link
                href={`/tafsir`}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-600/70 px-4 py-2 text-cream-100 hover:border-gold-500/40"
              >
                <Icon name="feather" size={14} />
                Read the tafsir
              </Link>
            </div>
          </div>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related" className="mt-12">
            <h2 id="related" className="font-display text-lg text-cream-50">
              More duas for {category?.label.toLowerCase()}
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/learn/quranic-duas/${r.slug}`}
                    className="flex h-full flex-col rounded-xl border border-ink-600/50 px-4 py-3 hover:border-gold-500/40"
                  >
                    <span className="text-sm text-cream-50">{r.title}</span>
                    <span className="mt-1 text-xs text-cream-200/55">
                      {r.speaker} · {duaReference(r)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav aria-label="Dua navigation" className="mt-10 flex items-center justify-between gap-3 text-sm">
          {prev ? (
            <Link href={`/learn/quranic-duas/${prev.slug}`} className="text-gold-300 hover:text-gold-200">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          <Link href="/learn/quranic-duas" className="text-cream-200/70 hover:text-cream-100">
            All duas
          </Link>
          {next ? (
            <Link href={`/learn/quranic-duas/${next.slug}`} className="text-right text-gold-300 hover:text-gold-200">
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </AppShell>
    </>
  );
}
