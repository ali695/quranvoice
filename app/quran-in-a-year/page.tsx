import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { JUZS } from '@/lib/data/juz';
import { getSurahByNumber } from '@/lib/data/fallbackSurahs';

export const metadata: Metadata = {
  title: 'Quran in a Year',
  description: 'Read the full Quran over one year by completing one Juz every 12 days.',
};

export default function QuranInAYearPage() {
  return (
    <>
      <PageHeader
        eyebrow="Plan"
        title="Quran in a Year"
        description="A gentle reading plan: complete one juz roughly every 12 days, finishing the Quran in 12 months."
      />
      <AppShell>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {JUZS.map((j) => {
            const start = getSurahByNumber(j.startSurah);
            const dayRangeStart = (j.number - 1) * 12 + 1;
            const dayRangeEnd = j.number * 12;
            return (
              <Card key={j.number} variant="elevated" className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gold-400/80">
                      Days {dayRangeStart}–{dayRangeEnd}
                    </p>
                    <p className="mt-1 font-display text-base text-cream-50">Juz {j.number}</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-300">
                    <Icon name="book" size={16} />
                  </span>
                </div>
                <p className="mt-2 text-xs text-cream-200/65">
                  Begins at {start?.transliteration} {j.startSurah}:{j.startAyah}
                </p>
                <div className="mt-3">
                  <Button href={`/juz/${j.number}`} size="sm" variant="secondary">
                    Open juz
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
        <p className="mt-8 text-xs text-cream-200/55">
          Adjust your pace any time in <a href="/goals" className="text-gold-300 hover:text-gold-200">Reading Goals</a>.
        </p>
      </AppShell>
    </>
  );
}
