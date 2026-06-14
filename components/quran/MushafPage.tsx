'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { UnavailableState } from '@/components/ui/ErrorState';
import { MUSHAF_LAYOUTS, type MushafLine, type MushafPageData } from '@/lib/types/mushaf';

interface MushafPageProps {
  page: number;
  /** '15-line' (Madani) | '16-line' (Indo-Pak) */
  layoutKey?: '15-line' | '16-line';
}

const mushafIdFor = (key?: string) =>
  MUSHAF_LAYOUTS.find((l) => l.key === key)?.mushafId ?? MUSHAF_LAYOUTS[0].mushafId;

/**
 * Renders a real printed Mushaf page: words placed on their actual lines
 * (from the Quran.Foundation `line_number` data), justified like the printed
 * page, with ornamental verse-end markers and surah headers. Premium Uthmani
 * typography (Amiri Quran). Nothing here synthesizes line breaks.
 */
export function MushafPage({ page: initialPage, layoutKey = '15-line' }: MushafPageProps) {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<MushafPageData | null>(null);
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');

  const load = useCallback(
    async (p: number) => {
      setState('loading');
      try {
        const res = await fetch(`/api/quran/mushaf/${p}?mushaf=${mushafIdFor(layoutKey)}`);
        if (!res.ok) {
          setState('error');
          return;
        }
        const json = (await res.json()) as { data?: MushafPageData };
        setData(json.data ?? null);
        setState(json.data ? 'loaded' : 'error');
      } catch {
        setState('error');
      }
    },
    [layoutKey],
  );

  useEffect(() => {
    void load(page);
  }, [page, load]);

  const go = (delta: number) => setPage((p) => Math.max(1, Math.min(604, p + delta)));

  if (state === 'error') {
    return (
      <UnavailableState
        title="Mushaf page layout unavailable"
        badge="Source"
        description="The active source did not return printed-page line data for this page. Connect Quran.Foundation to read the page-by-page Mushaf."
        action={
          <Button size="sm" variant="secondary" onClick={() => load(page)}>
            Retry loading
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Button size="sm" variant="secondary" onClick={() => go(-1)} disabled={page <= 1}>
          <Icon name="arrow-right" size={14} />
          Previous
        </Button>
        <div className="text-center">
          <p className="font-display text-sm text-cream-50">Page {page}</p>
          {data?.juz && <p className="text-[11px] text-cream-200/55">Juz {data.juz}</p>}
        </div>
        <Button size="sm" variant="secondary" onClick={() => go(1)} disabled={page >= 604}>
          Next
          <Icon name="arrow-left" size={14} />
        </Button>
      </div>

      <div className="mushaf-page relative overflow-hidden rounded-3xl border border-gold-500/30 p-5 sm:p-8">
        <div className="pointer-events-none absolute inset-0 pattern-ornament opacity-[0.15]" aria-hidden />
        {state === 'loading' ? (
          <div className="relative flex flex-col gap-4 py-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-7 w-full animate-pulse rounded bg-ink-700/30" />
            ))}
          </div>
        ) : (
          <div className="relative flex flex-col" lang="ar">
            {data?.lines.map((line) => (
              <MushafLineRow key={line.lineNumber} line={line} />
            ))}
          </div>
        )}
      </div>

      <p className="text-center text-[11px] uppercase tracking-wider text-cream-200/45">
        {MUSHAF_LAYOUTS.find((l) => l.key === layoutKey)?.label} · Source: Quran.Foundation
      </p>
    </div>
  );
}

function MushafLineRow({ line }: { line: MushafLine }) {
  if (line.surahHeader) {
    return (
      <>
        <div className="my-3 flex items-center justify-center gap-3">
          <span className="h-px flex-1 bg-gold-500/30" />
          <span className="rounded-lg border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-center">
            <span className="quran-mushaf block text-xl text-gold-300" dir="rtl">
              {line.surahHeader.arabic}
            </span>
          </span>
          <span className="h-px flex-1 bg-gold-500/30" />
        </div>
        {line.words.length > 0 && <MushafWords line={line} />}
      </>
    );
  }
  return <MushafWords line={line} />;
}

function MushafWords({ line }: { line: MushafLine }) {
  // Justify full lines like a printed page; center short / final lines.
  const justify = line.words.length >= 4 ? 'justify-between' : 'justify-center gap-2';
  return (
    <div
      dir="rtl"
      className={`quran-mushaf flex flex-wrap items-center ${justify} py-1 leading-[2.4] text-cream-50`}
    >
      {line.words.map((w, i) =>
        w.type === 'end' ? (
          <span
            key={i}
            className="mx-1 inline-flex min-w-[1.6em] items-center justify-center text-gold-400"
            title={w.verseKey}
          >
            {w.text}
          </span>
        ) : (
          <span key={i}>{w.text}</span>
        ),
      )}
    </div>
  );
}
