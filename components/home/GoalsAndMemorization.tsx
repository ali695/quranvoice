import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function GoalsAndMemorization() {
  return (
    <section className="container-page py-12 md:py-16">
      <SectionHeader
        eyebrow="Habit & Hifz"
        title="Build a daily Quran practice"
        description="Set realistic reading goals, track your streak, and dedicate focused time to memorization."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <GoalsCard />
        <MemorizationCard />
      </div>
    </section>
  );
}

function GoalsCard() {
  return (
    <Card variant="elevated" className="relative overflow-hidden p-6 md:p-8">
      <div className="absolute right-0 top-0 h-48 w-48 -translate-y-1/3 translate-x-1/3 rounded-full bg-gold-500/8 blur-3xl" aria-hidden="true" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold-400/80">
            <Icon name="target" size={14} />
            Quran Goals
          </div>
          <h3 className="mt-3 font-display text-2xl font-medium text-cream-50">
            Daily reading target
          </h3>
          <p className="mt-2 text-sm text-cream-200/65">
            Choose a daily portion you can sustain, and watch your streak grow.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-300">
          <Icon name="chart" size={20} />
        </div>
      </div>

      <dl className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Daily target" value="—" hint="Set goal" />
        <Stat label="Weekly progress" value="0%" hint="0 / 0 pages" />
        <Stat label="Streak" value="0" hint="days" />
        <Stat label="Pages done" value="0" hint="total" />
      </dl>

      <div className="relative mt-6 h-2 overflow-hidden rounded-full bg-ink-700">
        <div className="h-full w-0 rounded-full bg-gradient-to-r from-gold-400 to-gold-600" />
      </div>

      <div className="relative mt-6 flex flex-wrap gap-3">
        <Button href="/goals" size="md">
          <Icon name="target" size={16} />
          Set Goal
        </Button>
        <Button href="/goals" size="md" variant="ghost">
          Learn how it works
        </Button>
      </div>
    </Card>
  );
}

function MemorizationCard() {
  return (
    <Card variant="elevated" className="relative overflow-hidden p-6 md:p-8">
      <div className="absolute left-0 bottom-0 h-48 w-48 translate-y-1/3 -translate-x-1/3 rounded-full bg-gold-500/8 blur-3xl" aria-hidden="true" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold-400/80">
            <Icon name="brain" size={14} />
            Memorization
          </div>
          <h3 className="mt-3 font-display text-2xl font-medium text-cream-50">
            Hifz with focused review
          </h3>
          <p className="mt-2 text-sm text-cream-200/65">
            Repeat ayahs, hide translations, loop audio, and review on schedule.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-300">
          <Icon name="brain" size={20} />
        </div>
      </div>

      <ul className="relative mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {[
          { icon: 'volume' as const, label: 'Audio loop' },
          { icon: 'sparkle' as const, label: 'Repeat ayah' },
          { icon: 'globe' as const, label: 'Hide translation' },
          { icon: 'check' as const, label: 'Review mode' },
        ].map((f) => (
          <li
            key={f.label}
            className="flex items-center gap-2.5 rounded-lg border border-ink-700/60 bg-ink-850/60 px-3 py-2.5 text-sm text-cream-200/80"
          >
            <Icon name={f.icon} size={14} className="text-gold-400" />
            {f.label}
          </li>
        ))}
      </ul>

      <div className="relative mt-6 flex flex-wrap gap-3">
        <Button href="/memorization" size="md">
          Start Review
          <Icon name="arrow-right" size={16} />
        </Button>
        <Button href="/memorization?guide=1" size="md" variant="ghost">
          How review works
        </Button>
      </div>
    </Card>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-ink-700/60 bg-ink-850/60 p-3.5">
      <dt className="text-[11px] uppercase tracking-wider text-cream-200/45">
        {label}
      </dt>
      <dd className="mt-1 font-display text-xl font-medium text-cream-50">
        {value}
      </dd>
      {hint && <p className="mt-0.5 text-xs text-cream-200/50">{hint}</p>}
    </div>
  );
}
