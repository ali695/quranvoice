import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DailyVerseExtras } from '@/components/home/DailyVerseExtras';
import { toArabicDigits } from '@/lib/utils/arabicNumber';
import { getDailyAyah } from '@/lib/services/dailyVerse';

/**
 * Server component — fetches the real Ayah of the Day from the configured
 * Quran provider chain (Quran.Foundation → AlQuran Cloud fallback) and
 * a verified English translation. No client-side placeholder text.
 */
export async function AyahOfTheDay() {
  const { verseKey, ayah, translation, surahLabel } = await getDailyAyah();

  return (
    <section className="container-page py-12 md:py-16">
      <SectionHeader
        eyebrow="Daily Verse"
        title="Ayah of the Day"
        description="A daily verse from the Noble Quran, served from verified sources."
        action={{ label: 'Open in reader', href: ayah ? `/quran/${ayah.surahNumber}/${ayah.ayahNumber}` : '/quran/2/255' }}
      />

      <Card variant="feature" className="overflow-hidden">
        <div className="relative grid gap-0 lg:grid-cols-[1.4fr_1fr]">
          <div className="absolute inset-0 pattern-ornament opacity-30" aria-hidden="true" />

          {/* Verse */}
          <div className="relative p-7 md:p-10">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gold-400/80">
              <span className="h-px w-8 bg-gold-500/60" />
              {verseKey}
              <span className="text-cream-200/50">· {surahLabel}</span>
            </div>

            {/* Arabic — from verified provider */}
            <div className="mt-7">
              {ayah?.arabic ? (
                <p
                  className="arabic text-right text-3xl text-cream-50 sm:text-4xl"
                  dir="rtl"
                  lang="ar"
                >
                  {ayah.arabic}
                  <span className="ayah-marker font-sans align-middle">
                    {toArabicDigits(ayah.ayahNumber)}
                  </span>
                </p>
              ) : (
                <ApiErrorBlock message="Could not load Arabic text from the verified Quran provider. Try again shortly." />
              )}
            </div>

            {/* Translation — from verified provider */}
            <div className="mt-8 border-l-2 border-gold-500/50 pl-5">
              {translation ? (
                <>
                  <p className="text-base leading-relaxed text-cream-100/90">
                    &ldquo;{translation.text}&rdquo;
                  </p>
                  <p className="mt-2 text-xs text-cream-200/55">
                    — {translation.resourceName}
                    {translation.source.verified && (
                      <span className="ml-2 inline-flex items-center gap-1 text-gold-300/80">
                        <Icon name="check" size={11} /> Verified source
                      </span>
                    )}
                  </p>
                </>
              ) : (
                <p className="text-sm leading-relaxed text-cream-200/65">
                  Select a translation source in{' '}
                  <Link href="/settings" className="text-gold-300 hover:text-gold-200">Settings</Link>{' '}
                  to see this verse in your preferred translation.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-2">
              <Button href={ayah ? `/quran/${ayah.surahNumber}/${ayah.ayahNumber}` : '/quran/2/255'} size="md">
                <Icon name="book" size={16} />
                Read
              </Button>
              <Button href={ayah ? `/quran/${ayah.surahNumber}#ayah-${ayah.surahNumber}-${ayah.ayahNumber}` : '/recitations'} variant="secondary" size="md">
                <Icon name="play" size={14} />
                Listen
              </Button>
              <Button href={ayah ? `/study/${ayah.surahNumber}/${ayah.ayahNumber}` : '/study'} variant="ghost" size="md">
                <Icon name="feather" size={14} />
                Study
              </Button>
              <Button href={`/tools/share-ayah?ref=${verseKey}`} variant="ghost" size="md">
                <Icon name="share" size={14} />
                Share
              </Button>
            </div>
          </div>

          {/* Side panel — open Tafsir + Source */}
          <div className="relative border-t border-ink-600/50 bg-ink-900/40 p-7 md:p-10 lg:border-l lg:border-t-0">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold-400/80">
              <Icon name="feather" size={14} />
              Study this verse
            </div>
            <p className="mt-3 text-sm leading-relaxed text-cream-200/80">
              Open this verse in the QuranVoice study panel to see tafsir from your selected
              source, related ayahs, and the option to add a private reflection note.
            </p>
            <div className="mt-5 space-y-2">
              <Button
                href={ayah ? `/study/${ayah.surahNumber}/${ayah.ayahNumber}` : '/study'}
                variant="outline"
                size="md"
                className="w-full justify-between"
              >
                <span>Open study panel</span>
                <Icon name="arrow-right" size={14} />
              </Button>
              <Button
                href="/tafsir"
                variant="ghost"
                size="md"
                className="w-full justify-between"
              >
                <span>Browse tafsir sources</span>
                <Icon name="arrow-right" size={14} />
              </Button>
              <Button
                href="/translations"
                variant="ghost"
                size="md"
                className="w-full justify-between"
              >
                <span>Browse translations</span>
                <Icon name="arrow-right" size={14} />
              </Button>
            </div>
            {ayah && <DailyVerseExtras surah={ayah.surahNumber} ayah={ayah.ayahNumber} />}

            <div className="mt-6 flex items-center gap-2 text-xs text-cream-200/50">
              <Icon name="check" size={14} className="text-gold-400" />
              Source labels travel with every block.
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

function ApiErrorBlock({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-4">
      <Icon name="close" size={16} className="mt-0.5 text-red-300" />
      <p className="text-sm leading-relaxed text-cream-100/85">{message}</p>
    </div>
  );
}
