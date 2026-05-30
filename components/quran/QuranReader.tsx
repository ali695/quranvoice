'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAudioPlayer } from '@/components/audio/AudioPlayerProvider';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Skeleton } from '@/components/ui/Skeleton';
import { recordRead } from '@/lib/services/progressService';
import { loadSettings } from '@/lib/services/settingsService';
import type { Ayah, Surah } from '@/lib/types/quran';
import type { TranslationVerse } from '@/lib/types/translation';
import { AyahCard } from './AyahCard';
import { QuranNavigation } from './QuranNavigation';
import { SurahHeader } from './SurahHeader';

interface QuranReaderProps {
  surah: Surah;
  ayahs: Ayah[];
  textSourceName: string;
  /** Optional ayah to scroll into view and highlight */
  highlightAyah?: number;
}

export function QuranReader({ surah, ayahs, textSourceName, highlightAyah }: QuranReaderProps) {
  const { playSurah } = useAudioPlayer();
  const [translationsByAyah, setTranslationsByAyah] = useState<Map<number, TranslationVerse[]>>(new Map());
  const [translationLoading, setTranslationLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [arabicSize, setArabicSize] = useState(32);

  // Hydrate display preferences from settings.
  useEffect(() => {
    const s = loadSettings();
    setShowTranslation(s.reading.showTranslation);
    setArabicSize(s.reading.arabicFontSize);
  }, []);

  // Record reading progress when this surah opens (or highlight changes).
  useEffect(() => {
    recordRead(surah.number, highlightAyah ?? 1);
  }, [surah.number, highlightAyah]);

  // Fetch the default translation on mount.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const s = loadSettings();
      const id = (s.translation.selected[0] as string) || 'en.sahih';
      setTranslationLoading(true);
      try {
        const res = await fetch(
          `/api/quran/translations/by-chapter/${surah.number}?id=${encodeURIComponent(id)}`,
        );
        if (!res.ok) {
          setTranslationLoading(false);
          return;
        }
        const json = (await res.json()) as { data?: TranslationVerse[] };
        if (cancelled || !json.data) return;
        const map = new Map<number, TranslationVerse[]>();
        json.data.forEach((t, i) => {
          const ayahNumber = ayahs[i]?.ayahNumber ?? i + 1;
          map.set(ayahNumber, [t]);
        });
        setTranslationsByAyah(map);
      } catch {
        // Silent: translations are optional.
      } finally {
        if (!cancelled) setTranslationLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [surah.number, ayahs]);

  const surahLabel = useMemo(
    () => `Surah ${surah.number} · ${surah.transliteration}`,
    [surah.number, surah.transliteration],
  );

  return (
    <div className="flex flex-col gap-6">
      <SurahHeader surah={surah} textSourceName={textSourceName} />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-600/50 bg-ink-800/40 p-3">
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => playSurah(surah.number, surahLabel)}>
            <Icon name="play" size={14} />
            Play Surah
          </Button>
          <button
            type="button"
            onClick={() => setShowTranslation((v) => !v)}
            className="rounded-lg border border-ink-600/70 px-3 py-2 text-xs font-medium text-cream-200/80 hover:border-gold-500/40 hover:text-gold-300"
          >
            {showTranslation ? 'Hide translation' : 'Show translation'}
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-cream-200/65">
          <span>Arabic size</span>
          <button
            type="button"
            onClick={() => setArabicSize((s) => Math.max(20, s - 2))}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-ink-600/60 hover:border-gold-500/40"
            aria-label="Decrease Arabic font size"
          >
            <Icon name="minus" size={12} />
          </button>
          <span className="w-6 text-center font-mono">{arabicSize}</span>
          <button
            type="button"
            onClick={() => setArabicSize((s) => Math.min(56, s + 2))}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-ink-600/60 hover:border-gold-500/40"
            aria-label="Increase Arabic font size"
          >
            <Icon name="plus" size={12} />
          </button>
        </div>
      </div>

      <QuranNavigation surahNumber={surah.number} />

      {translationLoading && (
        <div className="flex flex-col gap-3 rounded-2xl border border-ink-600/40 bg-ink-800/30 p-4 text-xs text-cream-200/55">
          <Skeleton className="h-3 w-32" />
          Loading translation…
        </div>
      )}

      <ol className="flex flex-col gap-4">
        {ayahs.map((a) => (
          <li key={a.verseKey}>
            <AyahCard
              ayah={a}
              surahLabel={surahLabel}
              translations={translationsByAyah.get(a.ayahNumber)}
              highlighted={highlightAyah === a.ayahNumber}
              showTranslation={showTranslation}
              arabicFontSize={arabicSize}
            />
          </li>
        ))}
      </ol>

      <QuranNavigation surahNumber={surah.number} />
    </div>
  );
}
