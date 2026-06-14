'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '@/components/audio/AudioPlayerProvider';
import type { Ayah, WordToken } from '@/lib/types/quran';
import type { TranslationVerse } from '@/lib/types/translation';
import { cn } from '@/lib/utils/cn';
import { toArabicDigits } from '@/lib/utils/arabicNumber';
import { Icon } from '@/components/ui/Icon';
import { AyahActions } from './AyahActions';
import { NowRecitingBadge } from './NowRecitingBadge';
import { TranslationBlock } from './TranslationBlock';
import { WordByWordBlock } from './WordByWordBlock';

interface AyahCardProps {
  ayah: Ayah;
  surahLabel: string;
  translations?: TranslationVerse[];
  /** Highlight when this verse key matches the URL/anchor */
  highlighted?: boolean;
  /** Reading-mode toggles */
  showTranslation?: boolean;
  arabicFontSize?: number;
  /** True when audio settings have auto-scroll-with-audio enabled */
  autoScrollWithAudio?: boolean;
  /** Show the word-by-word toggle (reading setting + source capability). */
  wordByWordEnabled?: boolean;
}

export function AyahCard({
  ayah,
  surahLabel,
  translations,
  highlighted = false,
  showTranslation = true,
  arabicFontSize = 32,
  autoScrollWithAudio = true,
  wordByWordEnabled = false,
}: AyahCardProps) {
  const { now, notice } = useAudioPlayer();
  const isPlaying = now?.surah === ayah.surahNumber && now?.ayah === ayah.ayahNumber;
  const showNotice = isPlaying && Boolean(notice);
  const rootRef = useRef<HTMLDivElement>(null);

  // Lazy word-by-word: only fetched when the reader opens this ayah's panel.
  const [wordsOpen, setWordsOpen] = useState(false);
  const [words, setWords] = useState<WordToken[] | null>(null);
  const [wordsLoading, setWordsLoading] = useState(false);
  const [wordsLoaded, setWordsLoaded] = useState(false);

  const loadWords = useCallback(async () => {
    setWordsLoading(true);
    try {
      const res = await fetch(`/api/quran/verses/by-key/${ayah.verseKey}/words`);
      if (res.ok) {
        const json = (await res.json()) as { data?: WordToken[] };
        setWords(json.data ?? null);
      } else {
        setWords(null);
      }
    } catch {
      setWords(null);
    } finally {
      setWordsLoading(false);
      setWordsLoaded(true);
    }
  }, [ayah.verseKey]);

  const toggleWords = () => {
    const next = !wordsOpen;
    setWordsOpen(next);
    if (next && !wordsLoaded) void loadWords();
  };

  // Scroll into view when the URL anchor selects this ayah.
  useEffect(() => {
    if (highlighted && rootRef.current) {
      rootRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlighted]);

  // Auto-scroll to the playing ayah, throttled to not fight user scroll.
  useEffect(() => {
    if (!isPlaying || !autoScrollWithAudio || !rootRef.current) return;
    rootRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [isPlaying, autoScrollWithAudio]);

  return (
    <article
      ref={rootRef}
      id={`ayah-${ayah.surahNumber}-${ayah.ayahNumber}`}
      data-playing={isPlaying || undefined}
      data-highlighted={highlighted || undefined}
      className={cn(
        'group relative rounded-2xl border p-5 transition-all md:p-7',
        isPlaying
          ? 'border-gold-500/60 bg-gradient-to-br from-gold-500/8 via-ink-800/70 to-ink-800/70 shadow-[0_0_0_1px_rgba(212,165,116,0.35),0_0_28px_-4px_rgba(212,165,116,0.45)]'
          : highlighted
            ? 'border-gold-500/40 bg-gold-500/5 shadow-gold-glow'
            : 'border-ink-600/50 bg-ink-800/40 hover:border-ink-500/60',
      )}
    >
      {isPlaying && (
        <span className="pointer-events-none absolute right-4 top-4 z-10">
          <NowRecitingBadge label={now?.reciterName ?? now?.reciterId} />
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
            <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <polygon
                points="20,3 34.5,11.5 34.5,28.5 20,37 5.5,28.5 5.5,11.5"
                fill="none"
                stroke={isPlaying ? 'rgba(212,165,116,0.9)' : 'rgba(212,165,116,0.45)'}
                strokeWidth="1"
              />
            </svg>
            <span className="relative font-display text-sm font-medium text-gold-300">
              {ayah.ayahNumber}
            </span>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-cream-200/45">
              Ayah {ayah.ayahNumber}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-cream-200/45">
              Juz {ayah.juz ?? '—'} · Page {ayah.page ?? '—'}
            </div>
          </div>
        </div>

        <AyahActions
          surah={ayah.surahNumber}
          ayah={ayah.ayahNumber}
          arabic={ayah.arabic}
          surahLabel={surahLabel}
        />
      </div>

      <div className="mt-6">
        <p
          className="arabic text-right text-cream-50"
          dir="rtl"
          lang="ar"
          style={{ fontSize: `${arabicFontSize}px` }}
        >
          {ayah.arabic}
          <span className="ayah-marker font-sans align-middle">
            {toArabicDigits(ayah.ayahNumber)}
          </span>
        </p>
      </div>

      {showNotice && (
        <p className="mt-4 rounded-lg border border-gold-500/25 bg-gold-500/5 px-3 py-2 text-xs text-gold-200/90">
          {notice}
        </p>
      )}

      {showTranslation && <TranslationBlock translations={translations} />}

      {wordByWordEnabled && (
        <div className="mt-4">
          <button
            type="button"
            onClick={toggleWords}
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink-600/70 px-3 py-1.5 text-xs font-medium text-cream-200/80 hover:border-gold-500/40 hover:text-gold-300"
            aria-expanded={wordsOpen}
          >
            <Icon name={wordsOpen ? 'chevron-down' : 'chevron-right'} size={12} />
            {wordsOpen ? 'Hide words' : 'Word by word'}
          </button>
          {wordsOpen && <WordByWordBlock words={words ?? undefined} loading={wordsLoading} />}
        </div>
      )}
    </article>
  );
}
