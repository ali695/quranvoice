import { Icon } from '@/components/ui/Icon';
import type { Surah } from '@/lib/types/quran';

interface SurahHeaderProps {
  surah: Surah;
  textSourceName?: string;
}

export function SurahHeader({ surah, textSourceName }: SurahHeaderProps) {
  const showBismillah = surah.number !== 1 && surah.number !== 9;
  return (
    <header className="relative overflow-hidden rounded-3xl border border-ink-600/60 bg-gradient-to-b from-ink-800/80 to-ink-850/80 p-6 md:p-10">
      <div className="absolute inset-0 pattern-ornament opacity-30" aria-hidden="true" />
      <div className="absolute -top-10 right-0 h-48 w-48 rounded-full bg-gold-500/8 blur-3xl" aria-hidden="true" />

      <div className="relative flex flex-col items-center text-center">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold-400">
          <span className="h-px w-6 bg-gold-500/60" />
          Surah {surah.number}
          <span className="h-px w-6 bg-gold-500/60" />
        </div>

        <h1 className="mt-4 font-display text-3xl font-medium text-cream-50 sm:text-4xl">
          {surah.transliteration}
        </h1>
        <p className="mt-1 text-sm text-cream-200/65">{surah.meaning}</p>

        <div
          className="arabic mt-6 text-5xl font-medium text-cream-50 sm:text-6xl"
          dir="rtl"
          lang="ar"
        >
          {surah.arabic}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-cream-200/65">
          <span className="inline-flex items-center gap-1.5">
            {surah.revelation === 'meccan' ? (
              <Icon name="crescent" size={13} className="text-gold-400" />
            ) : (
              <Icon name="mosque" size={13} className="text-gold-400" />
            )}
            {surah.revelation === 'meccan' ? 'Meccan' : 'Medinan'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="book" size={13} className="text-gold-400" />
            {surah.ayahCount} ayahs
          </span>
          {textSourceName && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="check" size={13} className="text-gold-400" />
              Text: {textSourceName}
            </span>
          )}
        </div>

        {showBismillah && (
          <div className="mt-8 w-full max-w-md border-t border-gold-500/20 pt-6">
            <div
              className="arabic text-2xl text-gold-100 sm:text-3xl"
              dir="rtl"
              lang="ar"
              aria-label="Bismillah ar-Rahman ar-Rahim"
            >
              ﷽
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
