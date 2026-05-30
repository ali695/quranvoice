import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { SourceBadge } from '@/components/learn/SourceBadge';
import { PROPHET_STORIES } from '@/lib/data/learning/prophetStories';
import { getSurahByNumber } from '@/lib/data/fallbackSurahs';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/learn/stories-of-the-prophets',
    title: 'Stories of the Prophets — QuranVoice',
    description:
      "Per-prophet Quran source index. Open the referenced surah or verse to read the narrative in the QuranVoice reader.",
  });
}

export default function ProphetStoriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learning Library"
        title="Stories of the Prophets"
        description="QuranVoice does not paste narrative content into source code. Each prophet card below lists the surahs and key verses where their story is concentrated in the Quran — tap through to read the verified Arabic and translation in the reader."
      />
      <AppShell>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROPHET_STORIES.map((p) => (
            <Card key={p.id} as="li" variant="elevated" className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gold-400/80">
                    Quran narrative index
                  </p>
                  <h3 className="mt-1 font-display text-lg text-cream-50">
                    {p.title} <span className="text-cream-200/55 text-sm">{p.honorific}</span>
                  </h3>
                </div>
                <span className="arabic text-2xl text-gold-100" dir="rtl" lang="ar">
                  {p.titleArabic}
                </span>
              </div>
              {p.subtitle && <p className="text-sm text-cream-200/75">{p.subtitle}</p>}

              <div>
                <p className="text-[10px] uppercase tracking-wider text-cream-200/45">
                  Primary surahs
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {p.primarySurahs.map((n) => {
                    const meta = getSurahByNumber(n);
                    return (
                      <li key={n}>
                        <Link
                          href={`/quran/${n}`}
                          className="inline-flex items-center gap-1 rounded-full border border-ink-700/60 bg-ink-850/60 px-2.5 py-0.5 text-[11px] text-cream-100/90 hover:border-gold-500/40 hover:text-gold-200"
                        >
                          {n}. {meta?.transliteration ?? `Surah ${n}`}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {p.verseKeyHighlights && p.verseKeyHighlights.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-cream-200/45">
                    Key verses
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {p.verseKeyHighlights.map((vk) => (
                      <li key={vk}>
                        <Link
                          href={`/quran/${vk.replace(':', '/')}`}
                          className="inline-flex items-center gap-1 rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-[11px] font-mono text-gold-200 hover:bg-gold-500/15"
                        >
                          {vk}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-auto flex items-center justify-between pt-2">
                <SourceBadge status={p.sourceStatus} />
                <Link
                  href={`/quran/${p.primarySurahs[0]}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-gold-300 hover:text-gold-200"
                >
                  Open in reader
                  <Icon name="arrow-right" size={11} />
                </Link>
              </div>
            </Card>
          ))}
        </ul>

        <Card variant="feature" className="mt-10 p-6 md:p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-400/80">
            <Icon name="check" size={13} />
            Source policy
          </div>
          <p className="mt-3 text-sm leading-relaxed text-cream-100/85">
            We do not write or paraphrase narrative details about the Prophets in source code.
            Detailed seerah and israʾiliyyat references require a verified scholarly source to be
            registered. Until then, this page serves as a faithful Quran-index — your reading
            happens inside the QuranVoice reader, with the verified Arabic and translation.
          </p>
        </Card>
      </AppShell>
    </>
  );
}
