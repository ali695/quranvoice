import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { SourceBadge } from '@/components/learn/SourceBadge';
import { UnavailableState } from '@/components/ui/ErrorState';
import { NAMES_OF_PROPHET } from '@/lib/data/learning/namesOfProphet';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/learn/names-of-prophet-muhammad',
    title: 'Names of Prophet Muhammad ﷺ — QuranVoice',
    description:
      "Names and titles of the Prophet ﷺ that appear directly in the Quran. Additional titles from hadith and seerah literature require verified source review.",
  });
}

export default function NamesOfProphetPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learning Library"
        title="The names and titles of Prophet Muhammad ﷺ"
        description="Each card below contains a name or title of the Prophet ﷺ that appears directly in the Quran, with a verse reference. Names drawn from the wider hadith and seerah corpus require verified per-entry review before publication."
      />
      <AppShell>
        <Card variant="feature" className="relative overflow-hidden p-6 md:p-8">
          <div className="absolute inset-0 pattern-ornament opacity-25" aria-hidden="true" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-400/80">
              <Icon name="check" size={13} />
              Source policy
            </div>
            <p className="mt-3 text-sm leading-relaxed text-cream-100/85">
              We publish only names that appear explicitly in the Quran, each with a direct verse
              reference. Titles from the wider hadith and seerah tradition (collections of his ﷺ
              titles often number 99 or more) require a verified hadith / seerah source
              registration before they can be published in QuranVoice.
            </p>
          </div>
        </Card>

        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NAMES_OF_PROPHET.map((n) => (
            <Card key={n.id} as="li" variant="elevated" className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gold-400/80">
                    {n.transliteration}
                  </p>
                  <h3 className="mt-1 font-display text-lg text-cream-50">{n.title}</h3>
                </div>
                <span className="arabic text-2xl text-gold-100" dir="rtl" lang="ar">
                  {n.titleArabic}
                </span>
              </div>
              {n.subtitle && <p className="text-sm text-cream-200/75">{n.subtitle}</p>}
              {n.relatedVerseKeys && (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {n.relatedVerseKeys.slice(0, 3).map((vk) => (
                    <Link
                      key={vk}
                      href={`/quran/${vk.replace(':', '/')}`}
                      className="inline-flex items-center gap-1 rounded-full border border-ink-700/60 bg-ink-850/60 px-2.5 py-0.5 text-[11px] font-mono text-gold-300/90 hover:border-gold-500/40 hover:text-gold-200"
                    >
                      Quran {vk}
                      <Icon name="arrow-right" size={10} />
                    </Link>
                  ))}
                </div>
              )}
              <div className="mt-auto flex items-center justify-between pt-2">
                <SourceBadge status={n.sourceStatus} />
                <span className="text-[10px] uppercase tracking-wider text-cream-200/45">
                  Quran source
                </span>
              </div>
            </Card>
          ))}
        </ul>

        <div className="mt-10">
          <UnavailableState
            title="Hadith- and seerah-sourced titles"
            description='Titles from hadith collections (e.g. "Ash-Shafīʿ", "Al-Mubashshir") and from classical seerah works will appear here once a verified hadith / seerah source is registered. QuranVoice will not publish titles whose source has not been confirmed.'
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-2 text-xs text-cream-200/65">
          <Link
            href="/learn/seerah"
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-600/70 bg-ink-800/40 px-3 py-1.5 hover:border-gold-500/40 hover:text-gold-200"
          >
            Continue to Seerah
            <Icon name="arrow-right" size={11} />
          </Link>
          <Link
            href="/learn/stories-of-the-prophets"
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-600/70 bg-ink-800/40 px-3 py-1.5 hover:border-gold-500/40 hover:text-gold-200"
          >
            Stories of the Prophets
            <Icon name="arrow-right" size={11} />
          </Link>
        </div>
      </AppShell>
    </>
  );
}
