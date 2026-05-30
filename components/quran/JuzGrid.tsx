import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { getSurahByNumber } from '@/lib/data/fallbackSurahs';
import type { Juz } from '@/lib/types/quran';

interface JuzGridProps {
  juzs: Juz[];
}

export function JuzGrid({ juzs }: JuzGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {juzs.map((j) => {
        const start = getSurahByNumber(j.startSurah);
        const end = getSurahByNumber(j.endSurah);
        return (
          <Card key={j.number} as="li" variant="elevated">
            <Link href={`/juz/${j.number}`} className="flex items-start gap-4 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/5 font-display text-sm font-medium text-gold-300">
                {j.number}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base font-medium text-cream-50">
                  Juz {j.number}
                </h3>
                <p className="mt-1 text-xs text-cream-200/65">
                  Starts at {start?.transliteration} {j.startSurah}:{j.startAyah}
                </p>
                <p className="text-xs text-cream-200/55">
                  Ends at {end?.transliteration} {j.endSurah}:{j.endAyah}
                </p>
              </div>
              <Icon name="chevron-right" size={16} className="text-cream-200/40" />
            </Link>
          </Card>
        );
      })}
    </ul>
  );
}
