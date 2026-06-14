'use client';

import { useState } from 'react';
import { MushafPage } from '@/components/quran/MushafPage';
import { UnavailableState } from '@/components/ui/ErrorState';
import { useCapabilities } from '@/lib/hooks/useCapabilities';
import { MUSHAF_LAYOUTS } from '@/lib/types/mushaf';

/**
 * Page-by-page Mushaf reader with real printed-line layouts. Offers only the
 * layouts the active source actually provides (15-line Madani / 16-line
 * Indo-Pak from Quran.Foundation) — gated by capability detection.
 */
export function MushafReader({
  initialPage = 1,
  defaultLayout = '15-line',
}: {
  initialPage?: number;
  defaultLayout?: '15-line' | '16-line';
}) {
  const { capabilities, loading } = useCapabilities();
  const [layout, setLayout] = useState<'15-line' | '16-line'>(defaultLayout);

  const available = MUSHAF_LAYOUTS.filter((l) =>
    l.key === '15-line'
      ? capabilities?.hasMushafLineBreaks15
      : capabilities?.hasMushafLineBreaks16,
  );

  if (!loading && capabilities && available.length === 0) {
    return (
      <UnavailableState
        title="Mushaf page layouts"
        badge="Source"
        description="Printed page-by-page Mushaf layouts require the Quran.Foundation source. Connect it to read the 15-line Madani and 16-line Indo-Pak Mushaf with real line breaks."
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {available.length > 1 && (
        <div className="inline-flex items-center gap-1 self-start rounded-xl border border-ink-600/70 bg-ink-800/60 p-1">
          {available.map((l) => (
            <button
              key={l.key}
              type="button"
              onClick={() => setLayout(l.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                layout === l.key
                  ? 'bg-gold-500 text-ink-950'
                  : 'text-cream-200/75 hover:bg-ink-700/60 hover:text-gold-300'
              }`}
            >
              {l.lines}-line
            </button>
          ))}
        </div>
      )}
      <MushafPage page={initialPage} layoutKey={layout} />
    </div>
  );
}
