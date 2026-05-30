'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { getSurahByNumber } from '@/lib/data/fallbackSurahs';
import { JumpToAyah } from './JumpToAyah';

interface QuranNavigationProps {
  surahNumber: number;
}

export function QuranNavigation({ surahNumber }: QuranNavigationProps) {
  const prev = surahNumber > 1 ? getSurahByNumber(surahNumber - 1) : null;
  const next = surahNumber < 114 ? getSurahByNumber(surahNumber + 1) : null;
  const current = getSurahByNumber(surahNumber);
  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-600/50 bg-ink-800/40 p-4"
      aria-label="Quran navigation"
    >
      <div className="flex items-center gap-2">
        {prev ? (
          <Link
            href={`/quran/${prev.number}`}
            className="inline-flex items-center gap-2 rounded-lg border border-ink-600/60 px-3 py-2 text-sm text-cream-200/80 hover:border-gold-500/40 hover:text-gold-300"
          >
            <Icon name="arrow-left" size={14} />
            <span className="hidden sm:inline">{prev.transliteration}</span>
            <span className="sm:hidden">Prev</span>
          </Link>
        ) : (
          <span className="rounded-lg border border-ink-700/60 px-3 py-2 text-sm text-cream-200/35">
            ←
          </span>
        )}
        {next ? (
          <Link
            href={`/quran/${next.number}`}
            className="inline-flex items-center gap-2 rounded-lg border border-ink-600/60 px-3 py-2 text-sm text-cream-200/80 hover:border-gold-500/40 hover:text-gold-300"
          >
            <span className="hidden sm:inline">{next.transliteration}</span>
            <span className="sm:hidden">Next</span>
            <Icon name="arrow-right" size={14} />
          </Link>
        ) : (
          <span className="rounded-lg border border-ink-700/60 px-3 py-2 text-sm text-cream-200/35">
            →
          </span>
        )}
      </div>
      <JumpToAyah currentSurah={surahNumber} maxAyah={current?.ayahCount} />
    </nav>
  );
}
