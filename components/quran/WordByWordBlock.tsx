import { UnavailableState } from '@/components/ui/ErrorState';
import type { WordToken } from '@/lib/types/quran';

interface WordByWordBlockProps {
  words?: WordToken[];
}

export function WordByWordBlock({ words }: WordByWordBlockProps) {
  if (!words || words.length === 0) {
    return (
      <div className="mt-5">
        <UnavailableState
          title="Word-by-word analysis not available"
          description="Word-by-word data will appear here when a verified grammar dataset is connected."
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
        </div>
      ))}
    </div>
  );
}
