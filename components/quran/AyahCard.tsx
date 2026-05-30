'use client';

import { useEffect, useRef } from 'react';
import { useAudioPlayer } from '@/components/audio/AudioPlayerProvider';
import type { Ayah } from '@/lib/types/quran';
import type { TranslationVerse } from '@/lib/types/translation';
import { cn } from '@/lib/utils/cn';
import { AyahActions } from './AyahActions';
import { NowRecitingBadge } from './NowRecitingBadge';
import { TranslationBlock } from './TranslationBlock';

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
}

export function AyahCard({
  ayah,
  surahLabel,
  translations,
  highlighted = false,
  showTranslation = true,
  arabicFontSize = 32,
  autoScrollWithAudio = true,
}: AyahCardProps) {
  const { now } = useAudioPlayer();
  const isPlaying = now?.surah === ayah.surahNumber && now?.ayah === ayah.ayahNumber;
  const rootRef = useRef<HTMLDivElement>(null);

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
          className="arabic text-right leading-[2.1] text-cream-50"
          dir="rtl"
          lang="ar"
          style={{ fontSize: `${arabicFontSize}px` }}
        >
          {ayah.arabic}
        </p>
      </div>

      {showTranslation && <TranslationBlock translations={translations} />}
    </article>
  );
}
