'use client';

import { useEffect, useState } from 'react';
import { useAudioPlayer } from '@/components/audio/AudioPlayerProvider';
import { cn } from '@/lib/utils/cn';
import { toArabicDigits } from '@/lib/utils/arabicNumber';
import type { WordToken } from '@/lib/types/quran';

interface WordAudioHighlighterProps {
  verseKey: string;
  ayahNumber: number;
  /** Plain Uthmani text — shown when word data / timing isn't active. */
  arabic: string;
  fontSize: number;
}

/**
 * Renders an ayah's Arabic and, while this exact ayah is being recited with
 * real Quran.Foundation word timing, highlights each word as the Qari reaches
 * it. Falls back to the plain ayah (ayah-level highlight handled by the card)
 * whenever word timing isn't available — it NEVER synthesizes word timing.
 *
 * Words are space-separated, so per-word spans don't break Arabic shaping,
 * ligatures, tashkeel or RTL flow within a word.
 */
export function WordAudioHighlighter({
  verseKey,
  ayahNumber,
  arabic,
  fontSize,
}: WordAudioHighlighterProps) {
  const { now, currentWordIndex, exactWordTimingAvailable } = useAudioPlayer();
  const isActive = now?.verseKey === verseKey;
  const wordMode = isActive && exactWordTimingAvailable;

  const [words, setWords] = useState<WordToken[] | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Lazily fetch the canonical word list only when this ayah enters word mode.
  useEffect(() => {
    if (!wordMode || loaded) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/quran/verses/by-key/${verseKey}/words`);
        if (res.ok) {
          const json = (await res.json()) as { data?: WordToken[] };
          if (!cancelled) setWords(json.data ?? null);
        }
      } catch {
        /* fall back to plain text */
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [wordMode, loaded, verseKey]);

  const marker = (
    <span className="ayah-marker font-sans align-middle">{toArabicDigits(ayahNumber)}</span>
  );

  // Plain rendering (no active word timing, or words not yet loaded).
  if (!wordMode || !words?.length) {
    return (
      <p
        className="arabic text-right text-cream-50"
        dir="rtl"
        lang="ar"
        style={{ fontSize: `${fontSize}px` }}
      >
        {arabic}
        {marker}
      </p>
    );
  }

  // Word-by-word highlighted rendering.
  return (
    <p
      className="arabic text-right text-cream-50"
      dir="rtl"
      lang="ar"
      style={{ fontSize: `${fontSize}px` }}
    >
      {words.map((w, i) => (
        <span key={w.position ?? i}>
          <span
            className={cn(
              currentWordIndex === w.position && 'word-active',
              currentWordIndex != null && w.position < currentWordIndex && 'word-done',
            )}
          >
            {w.arabic}
          </span>{' '}
        </span>
      ))}
      {marker}
    </p>
  );
}
