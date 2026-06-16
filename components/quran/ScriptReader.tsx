'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { UnavailableState } from '@/components/ui/ErrorState';
import { SURAHS } from '@/lib/data/surahs';
import { useCapabilities } from '@/lib/hooks/useCapabilities';
import type { Capabilities } from '@/lib/types/capability';
import { toArabicDigits } from '@/lib/utils/arabicNumber';

type ApiType = 'uthmani' | 'imlaei' | 'uthmani_simple';

interface ScriptAyah {
  ayahNumber: number;
  verseKey: string;
  text: string;
}

const CAP_FLAG: Record<ApiType, keyof Capabilities> = {
  uthmani: 'hasUthmaniText',
  imlaei: 'hasImlaei',
  uthmani_simple: 'hasUthmaniSimple',
};

/**
 * ScriptReader — renders a verified Quran script (Uthmani, Imlaei, or
 * simplified Uthmani) for a selectable surah, fetched live from the active
 * source via `/api/quran/script/{surah}/{type}`. Text is never altered or
 * generated locally. Capability-gated so it degrades honestly when the source
 * for that script isn't connected.
 */
export function ScriptReader({
  type,
  initialSurah = 1,
  sourceNote,
}: {
  type: ApiType;
  initialSurah?: number;
  sourceNote: string;
}) {
  const { capabilities, loading } = useCapabilities();
  const [surah, setSurah] = useState(initialSurah);
  const [ayahs, setAyahs] = useState<ScriptAyah[] | null>(null);
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');

  const supported = capabilities ? Boolean(capabilities[CAP_FLAG[type]]) : true;

  const load = useCallback(
    async (s: number) => {
      setState('loading');
      try {
        const res = await fetch(`/api/quran/script/${s}/${type}`);
        if (!res.ok) {
          setState('error');
          return;
        }
        const json = (await res.json()) as { data?: ScriptAyah[] };
        setAyahs(json.data ?? null);
        setState(json.data?.length ? 'loaded' : 'error');
      } catch {
        setState('error');
      }
    },
    [type],
  );

  useEffect(() => {
    if (supported) void load(surah);
  }, [surah, supported, load]);

  if (!loading && capabilities && !supported) {
    return (
      <UnavailableState
        title="This script needs a verified source"
        badge="Source"
        description="Connect the Quran.Foundation Content API to read this script with verified, source-attributed text. QuranVoice never generates Arabic text itself."
        action={
          <Link
            href="/sources"
            className="inline-flex items-center gap-2 rounded-lg border border-gold-500/40 bg-gold-500/10 px-4 py-2 text-sm font-medium text-gold-200 hover:bg-gold-500/15"
          >
            See source disclosure
            <Icon name="arrow-right" size={14} />
          </Link>
        }
      />
    );
  }

  const meta = SURAHS.find((s) => s.number === surah);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-cream-200/70">Surah</span>
          <select
            value={surah}
            onChange={(e) => setSurah(Number(e.target.value))}
            className="select-base min-w-[220px]"
            aria-label="Select surah"
          >
            {SURAHS.map((s) => (
              <option key={s.number} value={s.number} className="bg-ink-900">
                {s.number}. {s.transliteration} — {s.meaning}
              </option>
            ))}
          </select>
        </label>
        <Link
          href={`/quran/${surah}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink-600/70 px-3 py-2 text-xs font-medium text-cream-200/80 hover:border-gold-500/40 hover:text-gold-300"
        >
          Open full reader (translation + audio)
          <Icon name="arrow-right" size={13} />
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-gold-500/25 bg-ink-800/40 p-5 sm:p-8">
        <div className="pointer-events-none absolute inset-0 pattern-ornament opacity-[0.12]" aria-hidden />
        {meta && (
          <div className="relative mb-6 text-center">
            <h2 className="font-display text-xl text-cream-50">
              {meta.number}. {meta.transliteration}
              <span className="quran-mushaf ml-2 text-2xl text-gold-300" dir="rtl">
                {meta.arabic}
              </span>
            </h2>
            <p className="mt-1 text-xs uppercase tracking-wider text-cream-200/50">
              {meta.meaning} · {meta.ayahCount} ayahs · {meta.revelation}
            </p>
          </div>
        )}

        {state === 'error' ? (
          <UnavailableState
            title="Couldn’t load this surah"
            badge="Retry"
            description="The active source did not return text for this surah."
            action={
              <Button size="sm" variant="secondary" onClick={() => load(surah)}>
                Retry
              </Button>
            }
          />
        ) : state === 'loading' ? (
          <div className="relative flex flex-col gap-4 py-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-9 w-full animate-pulse rounded bg-ink-700/50" />
            ))}
          </div>
        ) : (
          <p
            className="quran-mushaf relative text-right text-2xl leading-[2.5] text-cream-50 sm:text-[2rem]"
            dir="rtl"
            lang="ar"
          >
            {ayahs?.map((a) => (
              <span key={a.verseKey}>
                {a.text}
                <span className="ayah-marker mx-1 font-sans align-middle text-gold-300/90">
                  {toArabicDigits(a.ayahNumber)}
                </span>{' '}
              </span>
            ))}
          </p>
        )}
      </div>

      <p className="text-center text-[11px] uppercase tracking-wider text-cream-200/45">{sourceNote}</p>
    </div>
  );
}
