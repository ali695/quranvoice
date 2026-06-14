'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { UnavailableState } from '@/components/ui/ErrorState';
import { SURAHS } from '@/lib/data/surahs';
import { useCapabilities } from '@/lib/hooks/useCapabilities';
import { toArabicDigits } from '@/lib/utils/arabicNumber';

interface TajweedAyah {
  ayahNumber: number;
  verseKey: string;
  tajweedHtml: string;
}

const LEGEND: Array<{ label: string; color: string }> = [
  { label: 'Necessary Madd', color: '#000ebc' },
  { label: 'Obligatory Madd', color: '#2144c1' },
  { label: 'Permissible Madd', color: '#4050ff' },
  { label: 'Normal Madd', color: '#537fff' },
  { label: 'Ghunnah', color: '#ff7e1e' },
  { label: 'Qalqalah', color: '#d80008' },
  { label: 'Ikhafa', color: '#9400a8' },
  { label: 'Idgham (ghunnah)', color: '#169777' },
  { label: 'Silent / Hamzat Wasl', color: '#9a9a9a' },
];

/**
 * Color-coded Tajweed Mushaf — renders Quran.Foundation's real
 * `text_uthmani_tajweed` markup with the standard Tajweed colors. Available
 * only when the source provides verified Tajweed data (capability-gated).
 */
export function TajweedReader({ initialSurah = 1 }: { initialSurah?: number }) {
  const { capabilities, loading } = useCapabilities();
  const [surah, setSurah] = useState(initialSurah);
  const [ayahs, setAyahs] = useState<TajweedAyah[] | null>(null);
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');

  const load = useCallback(async (s: number) => {
    setState('loading');
    try {
      const res = await fetch(`/api/quran/tajweed/${s}`);
      if (!res.ok) {
        setState('error');
        return;
      }
      const json = (await res.json()) as { data?: TajweedAyah[] };
      setAyahs(json.data ?? null);
      setState(json.data ? 'loaded' : 'error');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    if (capabilities?.hasTajweed) void load(surah);
  }, [surah, capabilities?.hasTajweed, load]);

  if (!loading && capabilities && !capabilities.hasTajweed) {
    return (
      <UnavailableState
        title="Tajweed Quran"
        badge="Requires verified data"
        description="Color-coded Tajweed requires verified Tajweed rule data. Connect Quran.Foundation (which provides text_uthmani_tajweed) to read the Tajweed Mushaf — QuranVoice never infers Tajweed colors itself."
      />
    );
  }

  const meta = SURAHS.find((s) => s.number === surah);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-cream-200/70">Surah</span>
          <select value={surah} onChange={(e) => setSurah(Number(e.target.value))} className="select-base min-w-[220px]">
            {SURAHS.map((s) => (
              <option key={s.number} value={s.number} className="bg-ink-900">
                {s.number}. {s.transliteration}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 rounded-xl border border-ink-600/50 bg-ink-800/40 p-3">
        {LEGEND.map((l) => (
          <span key={l.label} className="inline-flex items-center gap-1.5 text-xs text-cream-100/85">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: l.color }} />
            {l.label}
          </span>
        ))}
      </div>

      {state === 'error' ? (
        <UnavailableState
          title="Couldn’t load the Tajweed text"
          badge="Retry"
          description="The active source did not return Tajweed text for this surah."
          action={<Button size="sm" variant="secondary" onClick={() => load(surah)}>Retry loading</Button>}
        />
      ) : (
        <div className="tajweed-panel relative overflow-hidden rounded-3xl border border-gold-500/30 p-5 sm:p-8">
          <div className="pointer-events-none absolute inset-0 pattern-ornament opacity-[0.12]" aria-hidden />
          {meta && (
            <div className="relative mb-5 text-center">
              <h2 className="font-display text-xl text-[#3a2c18]">
                {meta.number}. {meta.transliteration}
                <span className="quran-mushaf ml-2 text-2xl text-[#7a5a2a]" dir="rtl">{meta.arabic}</span>
              </h2>
            </div>
          )}
          {state === 'loading' ? (
            <div className="relative flex flex-col gap-4 py-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 w-full animate-pulse rounded bg-[#e7dcc6]" />
              ))}
            </div>
          ) : (
            <div className="relative flex flex-col gap-5">
              {ayahs?.map((a) => (
                <p
                  key={a.verseKey}
                  className="tajweed-text text-right text-2xl leading-[2.4] sm:text-3xl"
                  dir="rtl"
                  lang="ar"
                  // Markup comes only from Quran.Foundation's verified
                  // text_uthmani_tajweed field — never generated locally.
                  dangerouslySetInnerHTML={{
                    __html: `${a.tajweedHtml}<span class="ayah-marker" style="color:#9a6a28">${toArabicDigits(a.ayahNumber)}</span>`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-center text-[11px] uppercase tracking-wider text-cream-200/45">
        Source: Quran.Foundation · text_uthmani_tajweed
      </p>
    </div>
  );
}
