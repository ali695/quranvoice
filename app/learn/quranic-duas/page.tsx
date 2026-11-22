import type { Metadata } from 'next';
import Link from 'next/link';
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
  type DuaCategory,
} from '@/lib/data/learning/quranicDuas';
import { getSurahByNumber } from '@/lib/data/fallbackSurahs';
import { getDuaContent } from '@/lib/services/duaService';
import { breadcrumbSchema, collectionPageSchema } from '@/lib/seo/schema';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Quranic Duas — Rabbana & Rabbi Duas with Urdu, English & Transliteration',
  description: `${QURANIC_DUAS.length} duas from the Quran — the Rabbana duas, the duas of the Prophets (Ibrahim, Musa, Yunus, Zakariya, Nuh and more) and verses of seeking refuge — each with Arabic text, transliteration, Urdu and English translation, and audio.`,
  alternates: { canonical: '/learn/quranic-duas' },
};

interface SP {
  searchParams: Promise<{ cat?: string }>;
}

export default async function QuranicDuasPage({ searchParams }: SP) {
  const { cat } = await searchParams;
  const activeCategory = (cat && DUA_CATEGORIES.find((c) => c.slug === cat)?.slug) || null;
  const list = activeCategory ? QURANIC_DUAS.filter((d) => d.category === activeCategory) : QURANIC_DUAS;
  const contents = await Promise.all(list.map((d) => getDuaContent(d)));
  const byslug = new Map(list.map((d, i) => [d.slug, contents[i]]));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Learn', path: '/learn' },
            { name: 'Quranic duas', path: '/learn/quranic-duas' },
          ]),
          collectionPageSchema({
            name: 'Quranic duas',
            description: 'Rabbana duas, duas of the Prophets and verses of seeking refuge from the Quran.',
            path: '/learn/quranic-duas',
          }),
        ]}
      />
      <PageHeader
        eyebrow="Learning Library"
        title="Quranic duas"
        description={`${QURANIC_DUAS.length} supplications preserved in the Quran — the Rabbana duas, the duas of the Prophets and the verses of seeking refuge — with Arabic, transliteration, Urdu and English, and recitation.`}
      />
      <AppShell>
        <nav aria-label="Filter duas by theme" className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/learn/quranic-duas"
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              !activeCategory
                ? 'border-gold-500/50 bg-gold-500/10 text-gold-200'
                : 'border-ink-600/70 text-cream-200/75 hover:border-gold-500/30'
            }`}
          >
            All ({QURANIC_DUAS.length})
          </Link>
          {DUA_CATEGORIES.map((c) => {
            const count = QURANIC_DUAS.filter((d) => d.category === c.slug).length;
            if (count === 0) return null;
            const isActive = activeCategory === c.slug;
            return (
              <Link
                key={c.slug}
                href={`/learn/quranic-duas?cat=${c.slug}`}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  isActive
                    ? 'border-gold-500/50 bg-gold-500/10 text-gold-200'
                    : 'border-ink-600/70 text-cream-200/75 hover:border-gold-500/30'
                }`}
              >
                {c.label} ({count})
              </Link>
            );
          })}
        </nav>

        <div className="space-y-12">
          {DUA_GROUPS.map((g) => {
            const duas = list.filter((d) => d.group === g.slug);
            if (duas.length === 0) return null;
            return (
              <section key={g.slug} aria-labelledby={`group-${g.slug}`}>
                <h2 id={`group-${g.slug}`} className="font-display text-xl text-cream-50">
                  {g.label} <span className="text-cream-200/45">({duas.length})</span>
                </h2>
                <p className="mt-1 text-sm text-cream-200/65">{g.description}</p>
                <ul className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {duas.map((d) => {
                    const c = byslug.get(d.slug);
                    const first = c?.ayahs[0];
                    const surahName = getSurahByNumber(d.surah)?.transliteration ?? `Surah ${d.surah}`;
                    return (
                      <Card key={d.slug} as="li" variant="elevated" className="flex flex-col gap-3 p-5">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="uppercase tracking-wider text-gold-400/80">
                            {DUA_CATEGORIES.find((x) => x.slug === (d.category as DuaCategory))?.label}
                          </span>
                          <span className="font-mono text-gold-300/80">
                            {surahName} {duaReference(d)}
                          </span>
                        </div>
                        <h3 className="font-display text-base text-cream-50">
                          <Link href={`/learn/quranic-duas/${d.slug}`} className="hover:text-gold-200">
                            {d.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-cream-200/55">{d.speaker}</p>
                        {first && (
                          <>
                            <p
                              className="arabic line-clamp-2 text-right text-2xl leading-loose text-cream-50"
                              dir="rtl"
                              lang="ar"
                            >
                              {first.duaArabic}
                            </p>
                            <p className="line-clamp-2 text-sm italic text-gold-100/80">{first.transliteration}</p>
                            <p className="line-clamp-3 text-sm leading-relaxed text-cream-200/75">{first.en}</p>
                          </>
                        )}
                        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                          <DuaPlayButton surah={d.surah} from={d.from} to={d.to} label={d.title} size="sm" />
                          <Link
                            href={`/learn/quranic-duas/${d.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-gold-300 hover:text-gold-200"
                          >
                            Urdu, English &amp; full dua
                            <Icon name="arrow-right" size={11} />
                          </Link>
                        </div>
                      </Card>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        <p className="mt-12 text-xs text-cream-200/50">
          Translations: Saheeh International (English) and Fateh Muhammad Jalandhari (Urdu). Arabic in the Uthmani
          script. Full credits are on the{' '}
          <Link href="/sources" className="underline hover:text-cream-200">
            Sources page
          </Link>
          .
        </p>
      </AppShell>
    </>
  );
}
