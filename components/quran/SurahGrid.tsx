import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import type { Surah } from '@/lib/types/quran';

interface SurahGridProps {
  surahs: Surah[];
}

export function SurahGrid({ surahs }: SurahGridProps) {
  if (surahs.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-ink-600/70 bg-ink-800/30 p-8 text-center text-sm text-cream-200/60">
        No surahs match this filter.
      </p>
    );
  }
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {surahs.map((s) => (
        <Card key={s.number} as="li" variant="elevated" className="group transition-all">
          <Link href={`/quran/${s.number}`} className="flex items-center gap-4 p-4">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
              <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <polygon
                  points="24,3 41.7,13.5 41.7,34.5 24,45 6.3,34.5 6.3,13.5"
                  fill="none"
                  stroke="rgba(212,165,116,0.35)"
                  strokeWidth="1"
                />
              </svg>
              <span className="relative font-display text-sm font-medium text-gold-300">{s.number}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="truncate font-display text-base font-medium text-cream-50 transition-colors group-hover:text-gold-200">
                  {s.transliteration}
                </h3>
                <span className="arabic shrink-0 text-xl text-cream-100" dir="rtl" lang="ar">
                  {s.arabic}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-cream-200/55">
                {s.meaning} · {s.ayahCount} ayahs ·{' '}
                {s.revelation === 'meccan' ? 'Meccan' : 'Medinan'}
              </p>
            </div>
            <Icon
              name="chevron-right"
              size={16}
              className="text-cream-200/40 transition-transform group-hover:translate-x-0.5 group-hover:text-gold-300"
            />
          </Link>
        </Card>
      ))}
    </ul>
  );
}
