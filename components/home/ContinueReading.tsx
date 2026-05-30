import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { ReadingProgress } from '@/lib/types/quran';

interface ContinueReadingProps {
  /** When undefined, renders the empty (default) state. */
  progress?: ReadingProgress;
}

export function ContinueReading({ progress }: ContinueReadingProps) {
  return (
    <section className="container-page py-12 md:py-16">
      <SectionHeader
        eyebrow="Your Mushaf"
        title="Continue Reading"
        description="Pick up where you left off, anytime and on any device."
      />

      {progress ? <ProgressCard p={progress} /> : <EmptyCard />}
    </section>
  );
}

function EmptyCard() {
  return (
    <Card variant="feature" className="overflow-hidden">
      <div className="relative grid items-center gap-6 p-6 md:grid-cols-[1fr_auto] md:p-10">
        <div className="absolute inset-0 pattern-ornament opacity-30" aria-hidden="true" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold-400/80">
            <Icon name="sparkle" size={14} />
            Welcome
          </div>
          <h3 className="mt-3 font-display text-2xl font-medium text-cream-50 sm:text-3xl">
            Start your Quran journey with Al-Fatihah
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-cream-200/65">
            Begin with the first surah of the mushaf — &ldquo;The Opening&rdquo; — and let
            QuranVoice save your position as you read.
          </p>
        </div>
        <div className="relative flex flex-wrap gap-3 md:flex-col md:items-end">
          <Button href="/quran/1" size="lg">
            <Icon name="book" size={18} />
            Open Al-Fatihah
          </Button>
          <Button href="/surahs" size="lg" variant="secondary">
            Browse Surahs
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ProgressCard({ p }: { p: ReadingProgress }) {
  return (
    <Card variant="elevated" className="overflow-hidden">
      <div className="grid items-center gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:gap-8 md:p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10 text-gold-300 md:h-20 md:w-20">
          <Icon name="book" size={28} />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-gold-400/80">
            Surah {p.surah.number}
          </div>
          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <h3 className="font-display text-2xl font-medium text-cream-50">
              {p.surah.transliteration}
            </h3>
            <span className="arabic text-2xl text-gold-200" dir="rtl" lang="ar">
              {p.surah.arabic}
            </span>
          </div>
          <p className="mt-2 text-sm text-cream-200/65">
            Ayah {p.ayah} of {p.surah.ayahCount} · {new Date(p.lastReadAt).toLocaleString()}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600"
                style={{ width: `${Math.min(100, Math.max(0, p.percent))}%` }}
              />
            </div>
            <span className="text-xs font-medium text-cream-200/70">
              {Math.round(p.percent)}%
            </span>
          </div>
        </div>
        <Button href={`/quran/${p.surah.number}/${p.ayah}`} size="lg">
          Continue
          <Icon name="arrow-right" size={16} />
        </Button>
      </div>
    </Card>
  );
}
