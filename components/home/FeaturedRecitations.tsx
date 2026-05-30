import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RECITERS } from '@/lib/data/home';

/**
 * Decorative geometric reciter avatar — never a photo of a real person.
 * Uses initials inside a calm gold-tinted pattern.
 */
function ReciterMark({ name, seed }: { name: string; seed: number }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const rotate = (seed * 41) % 360;
  return (
    <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-gold-500/30 bg-ink-900">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            'conic-gradient(from var(--r), rgba(212,165,116,0.35), rgba(212,165,116,0.05), rgba(212,165,116,0.35))',
          // @ts-expect-error CSS var
          '--r': `${rotate}deg`,
        }}
        aria-hidden="true"
      />
      <span className="relative font-display text-sm font-semibold text-gold-200">
        {initials}
      </span>
    </div>
  );
}

export function FeaturedRecitations() {
  return (
    <section className="container-page py-12 md:py-16">
      <SectionHeader
        eyebrow="Audio"
        title="Featured Recitations"
        description="Listen to renowned reciters once verified audio sources are connected."
        action={{ label: 'All reciters', href: '/reciters' }}
      />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Reciter grid */}
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {RECITERS.map((r, i) => (
            <Card key={r.id} as="li" variant="elevated" className="flex items-center gap-4 p-4">
              <ReciterMark name={r.name} seed={i + 1} />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-cream-50">
                  {r.name}
                </h3>
                <p className="mt-0.5 text-xs text-cream-200/55">
                  {r.style || 'Recitation style'} ·{' '}
                  <span className="text-cream-200/45">Source pending</span>
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500/15 text-gold-300 transition-colors hover:bg-gold-500/25"
                    aria-label={`Play recitation by ${r.name}`}
                    disabled
                    title="Audio will be enabled when a verified source is connected"
                  >
                    <Icon name="play" size={14} />
                  </button>
                  <Link
                    href={`/reciters/${r.id}`}
                    className="text-xs font-medium text-gold-300/90 hover:text-gold-200"
                  >
                    View recitations
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </ul>

        {/* Now-playing-style preview */}
        <PlayerPreview />
      </div>
    </section>
  );
}

function PlayerPreview() {
  return (
    <Card variant="feature" className="relative flex flex-col gap-5 overflow-hidden p-6">
      <div className="absolute inset-0 pattern-stars opacity-40" aria-hidden="true" />

      <div className="relative flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-400/80">
        <Icon name="volume" size={14} />
        Now playing — preview
      </div>

      <div className="relative">
        <div className="text-xs uppercase tracking-wider text-cream-200/50">
          Surah 36
        </div>
        <div className="mt-1 flex items-baseline gap-3">
          <h3 className="font-display text-xl font-medium text-cream-50">
            Ya-Sin
          </h3>
          <span className="arabic text-xl text-gold-200" dir="rtl" lang="ar">
            يس
          </span>
        </div>
        <p className="mt-1 text-sm text-cream-200/65">
          Reciter: <span className="text-cream-100/85">Choose a reciter</span>
        </p>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between text-xs text-cream-200/55">
          <span>00:00</span>
          <span>—:—</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-700">
          <div className="h-full w-0 rounded-full bg-gradient-to-r from-gold-400 to-gold-600" />
        </div>
      </div>

      <div className="relative flex items-center justify-center gap-2">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-cream-100 hover:bg-ink-700/60"
          aria-label="Previous"
        >
          <Icon name="arrow-left" size={16} />
        </button>
        <button
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-ink-950 shadow-[0_4px_12px_-2px_rgba(212,165,116,0.55)] hover:bg-gold-400"
          aria-label="Play"
        >
          <Icon name="play" size={18} />
        </button>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-cream-100 hover:bg-ink-700/60"
          aria-label="Next"
        >
          <Icon name="arrow-right" size={16} />
        </button>
      </div>

      <p className="relative text-center text-[11px] leading-relaxed text-cream-200/45">
        Audio playback is UI-ready and will activate once a verified Quran
        audio source is connected.
      </p>
    </Card>
  );
}
