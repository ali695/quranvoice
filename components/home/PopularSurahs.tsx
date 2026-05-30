import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getPopularSurahs } from '@/lib/data/surahs';

export function PopularSurahs() {
  const surahs = getPopularSurahs();

  return (
    <section className="container-page py-12 md:py-16">
      <SectionHeader
        eyebrow="Frequently Recited"
        title="Popular Surahs"
        description="Surahs often opened by readers around the world."
        action={{ label: 'View all surahs', href: '/surahs' }}
      />

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {surahs.map((s) => (
          <Card key={s.number} as="li" variant="elevated" className="group overflow-hidden">
            <Link href={`/quran/${s.number}`} className="flex h-full flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/5 font-display text-base font-medium text-gold-300">
                  {s.number}
                </span>
                <span
                  className="arabic text-2xl font-medium text-cream-50 transition-colors group-hover:text-gold-200"
                  dir="rtl"
                  lang="ar"
                >
                  {s.arabic}
                </span>
              </div>
              <div>
                <h3 className="font-display text-lg font-medium text-cream-50">
                  {s.transliteration}
                </h3>
                <p className="mt-0.5 text-sm text-cream-200/55">{s.meaning}</p>
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-ink-700/60 pt-4 text-xs text-cream-200/55">
                <span className="flex items-center gap-1.5">
                  <Icon name="book" size={13} />
                  {s.ayahCount} ayahs
                </span>
                <span className="flex items-center gap-1.5">
                  {s.revelation === 'meccan' ? (
                    <Icon name="crescent" size={13} className="text-gold-400" />
                  ) : (
                    <Icon name="mosque" size={13} className="text-gold-400" />
                  )}
                  {s.revelation === 'meccan' ? 'Meccan' : 'Medinan'}
                </span>
                <span className="inline-flex items-center gap-1 text-gold-300/90 transition-transform group-hover:translate-x-0.5">
                  Open
                  <Icon name="arrow-right" size={13} />
                </span>
              </div>
            </Link>
          </Card>
        ))}
      </ul>
    </section>
  );
}
