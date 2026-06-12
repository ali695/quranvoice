'use client';

import { useCallback, useEffect, useState } from 'react';
import { WordByWordBlock } from '@/components/quran/WordByWordBlock';
import { Button } from '@/components/ui/Button';
import { UnavailableState } from '@/components/ui/ErrorState';
import { SURAHS } from '@/lib/data/surahs';
import { useCapabilities } from '@/lib/hooks/useCapabilities';
import type { WordToken } from '@/lib/types/quran';

export function WordByWordExplorer() {
  const { capabilities, loading: capLoading } = useCapabilities();
  const [surah, setSurah] = useState(1);
  const [ayah, setAyah] = useState(1);
  const [words, setWords] = useState<WordToken[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ayahCount = SURAHS.find((s) => s.number === surah)?.ayahCount ?? 7;

  const load = useCallback(async (s: number, a: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/quran/verses/by-key/${s}:${a}/words`);
      if (res.status === 404) {
        setWords(null);
        setError('not-available');
        return;
      }
      if (!res.ok) {
        setError('failed');
        return;
      }
      const json = (await res.json()) as { data?: WordToken[] };
      setWords(json.data ?? null);
    } catch {
      setError('failed');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load the opening verse once capabilities confirm word-by-word exists.
  useEffect(() => {
    if (capabilities?.hasWordByWord) void load(1, 1);
  }, [capabilities?.hasWordByWord, load]);

  // Source does not provide word-by-word — show a clean, source-aware state.
  if (!capLoading && capabilities && !capabilities.hasWordByWord) {
    return (
      <UnavailableState
        title="Word-by-word"
        badge="Not in this source"
        description={
          capabilities.provider === 'foundation'
            ? 'The connected Quran.Foundation source did not return word-by-word data for the probe verse. Verify your API plan includes word-level fields.'
            : 'Word-by-word data requires the Quran.Foundation source. Connect it to unlock per-word Arabic, transliteration, and translation.'
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-ink-600/50 bg-ink-800/40 p-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-cream-200/70">Surah</span>
          <select
            value={surah}
            onChange={(e) => {
              setSurah(Number(e.target.value));
              setAyah(1);
            }}
            className="h-11 min-w-[200px] appearance-none rounded-xl border border-ink-600/70 bg-ink-800/70 px-4 text-sm text-cream-50 focus:border-gold-500/50 focus:outline-none"
          >
            {SURAHS.map((s) => (
              <option key={s.number} value={s.number} className="bg-ink-900">
                {s.number}. {s.transliteration}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-cream-200/70">Ayah</span>
          <input
            type="number"
            min={1}
            max={ayahCount}
            value={ayah}
            onChange={(e) => setAyah(Math.max(1, Math.min(ayahCount, Number(e.target.value) || 1)))}
            className="h-11 w-24 rounded-xl border border-ink-600/70 bg-ink-800/70 px-4 text-sm text-cream-50 focus:border-gold-500/50 focus:outline-none"
          />
        </label>
        <Button size="sm" onClick={() => load(surah, ayah)} disabled={loading}>
          {loading ? 'Loading…' : 'Show words'}
        </Button>
        <span className="ml-auto self-center text-xs text-cream-200/55">
          {surah}:{ayah} · Source: Quran.Foundation word-by-word
        </span>
      </div>

      {error === 'failed' ? (
        <UnavailableState
          title="Could not load word-by-word"
          badge="Retry"
          description="The request failed. Please try again."
          action={
            <Button size="sm" variant="secondary" onClick={() => load(surah, ayah)}>
              Retry loading
            </Button>
          }
        />
      ) : error === 'not-available' ? (
        <UnavailableState
          title="Word-by-word"
          badge="Not in this source"
          description="The active source did not return word-by-word data for this specific verse."
        />
      ) : (
        <WordByWordBlock words={words ?? undefined} loading={loading} />
      )}
    </div>
  );
}
