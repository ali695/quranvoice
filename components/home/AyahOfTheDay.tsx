import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AYAH_OF_THE_DAY_REF } from '@/lib/data/home';
import type { AyahWithMeta } from '@/lib/types/quran';

interface AyahOfTheDayProps {
  /**
   * When undefined, the section renders a clearly marked unavailable
   * placeholder. Religious text MUST come from a verified source.
   */
  ayah?: AyahWithMeta;
}

export function AyahOfTheDay({ ayah }: AyahOfTheDayProps) {
  const ref = ayah
    ? `${ayah.surahNumber}:${ayah.ayahNumber}`
    : AYAH_OF_THE_DAY_REF.reference;
  const surahName = ayah ? '' : AYAH_OF_THE_DAY_REF.surah;

  return (
    <section className="container-page py-12 md:py-16">
      <SectionHeader
        eyebrow="Daily Verse"
        title="Ayah of the Day"
        description="A daily verse from the Noble Quran to reflect upon."
      />

      <Card variant="feature" className="overflow-hidden">
        <div className="relative grid gap-0 lg:grid-cols-[1.4fr_1fr]">
          <div className="absolute inset-0 pattern-ornament opacity-30" aria-hidden="true" />

          {/* Verse */}
          <div className="relative p-7 md:p-10">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gold-400/80">
              <span className="h-px w-8 bg-gold-500/60" />
              {ref}
              {surahName && <span className="text-cream-200/50">· {surahName}</span>}
            </div>

            {/* Arabic */}
            <div className="mt-7">
              {ayah?.arabic ? (
                <p
                  className="arabic text-right text-3xl leading-[2] text-cream-50 sm:text-4xl"
                  dir="rtl"
                  lang="ar"
                >
                  {ayah.arabic}
                </p>
              ) : (
                <UnavailableBlock label="Arabic text" />
              )}
            </div>

            {/* Translation */}
            <div className="mt-8 border-l-2 border-gold-500/50 pl-5">
              {ayah?.translations?.[0] ? (
                <>
                  <p className="text-base leading-relaxed text-cream-100/90">
                    &ldquo;{ayah.translations[0].text}&rdquo;
                  </p>
                  <p className="mt-2 text-xs text-cream-200/55">
                    — {ayah.translations[0].source.name}
                  </p>
                </>
              ) : (
                <UnavailableBlock label="Translation" muted />
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-2">
              <Button href={`/quran/${AYAH_OF_THE_DAY_REF.surahNumber}/${AYAH_OF_THE_DAY_REF.ayahNumber}`} size="md">
                <Icon name="book" size={16} />
                Read
              </Button>
              <Button variant="secondary" size="md">
                <Icon name="play" size={14} />
                Listen
              </Button>
              <Button variant="ghost" size="md">
                <Icon name="bookmark" size={16} />
                Save
              </Button>
              <Button variant="ghost" size="md">
                <Icon name="share" size={16} />
                Share
              </Button>
            </div>
          </div>

          {/* Tafsir preview */}
          <div className="relative border-t border-ink-600/50 bg-ink-900/40 p-7 md:p-10 lg:border-l lg:border-t-0">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold-400/80">
              <Icon name="feather" size={14} />
              Tafsir Preview
            </div>
            <div className="mt-5">
              {ayah?.tafsir?.[0] ? (
                <>
                  <p className="text-sm leading-relaxed text-cream-200/80">
                    {ayah.tafsir[0].text}
                  </p>
                  <p className="mt-3 text-xs text-cream-200/55">
                    — {ayah.tafsir[0].book}, {ayah.tafsir[0].source.name}
                  </p>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-ink-600 bg-ink-800/40 p-5 text-sm leading-relaxed text-cream-200/60">
                  Tafsir will appear here when a verified source is connected.
                </div>
              )}
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-cream-200/50">
              <Icon name="check" size={14} className="text-gold-400" />
              Only verified tafsir works will be displayed.
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

function UnavailableBlock({ label, muted = false }: { label: string; muted?: boolean }) {
  return (
    <div
      className={[
        'rounded-xl border border-dashed border-ink-600 bg-ink-800/30 p-5 text-sm leading-relaxed',
        muted ? 'text-cream-200/55' : 'text-cream-200/65',
      ].join(' ')}
    >
      {label} will appear here when a verified Quran source is connected.
    </div>
  );
}
