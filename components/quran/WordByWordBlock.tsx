import { UnavailableState } from '@/components/ui/ErrorState';
import type { WordToken } from '@/lib/types/quran';

interface WordByWordBlockProps {
  words?: WordToken[];
  /** True while the verse's word data is still being fetched. */
  loading?: boolean;
}

export function WordByWordBlock({ words, loading = false }: WordByWordBlockProps) {
  if (loading) {
    return (
      <div className="mt-5 flex flex-wrap gap-3" dir="rtl">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-16 w-[88px] animate-pulse rounded-xl border border-ink-700/60 bg-ink-850/60"
          />
        ))}
      </div>
    );
  }
  if (!words || words.length === 0) {
    return (
      <div className="mt-5">
        <UnavailableState
          title="Word-by-word"
          badge="Not in this source"
          description="The active content source did not return word-by-word data for this verse. When a source that provides per-word text is selected, every word appears here with its translation."
        />
      </div>
    );
  }
  return (
    <div className="mt-5 flex flex-wrap gap-3" dir="rtl">
      {words.map((w) => (
        <div
          key={w.position}
          className="flex min-w-[88px] flex-col items-center gap-1 rounded-xl border border-ink-700/60 bg-ink-850/60 px-3 py-2.5 text-center"
        >
          <span className="arabic text-xl text-cream-50" lang="ar">
            {w.arabic}
          </span>
          {w.transliteration && (
            <span dir="ltr" className="text-[10px] uppercase tracking-wider text-gold-400/80">
              {w.transliteration}
            </span>
          )}
          {w.translation && (
            <span dir="ltr" className="text-[11px] text-cream-200/75">
              {w.translation}
            </span>
          )}
          {(w.rootArabic || w.grammar) && (
            <span dir="ltr" className="text-[9px] text-cream-200/45">
              {[w.rootArabic, w.grammar].filter(Boolean).join(' · ')}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
