import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export function LearningHero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-600/40">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-ink-850/70 via-ink-900 to-ink-900" />
        <div className="absolute inset-0 pattern-ornament opacity-25" />
        <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
      </div>

      <div className="container-page relative py-12 md:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-gold-400">
              <span className="h-px w-6 bg-gold-500/60" />
              Learning Library
            </span>
            <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-cream-50 sm:text-4xl lg:text-5xl">
              Structured Quran learning,{' '}
              <span className="text-gradient-gold">with sources you can trust.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-cream-200/75">
              Verified source references, daily reflections, duas, stories, names, themes
              and study paths — never auto-generated religious content.
            </p>

            {/* Search */}
            <form action="/search" method="get" role="search" className="mt-7 max-w-xl">
              <label htmlFor="learn-search" className="sr-only">
                Search the Learning Library
              </label>
              <div className="group relative flex items-center rounded-2xl border border-ink-600/80 bg-ink-800/70 p-2 shadow-soft backdrop-blur-sm focus-within:border-gold-500/50">
                <Icon name="search" size={18} className="ml-3 text-cream-200/55" />
                <input
                  id="learn-search"
                  name="q"
                  type="search"
                  placeholder="Search topics, duas, names, stories, reflections…"
                  className="h-11 flex-1 bg-transparent px-3 text-sm text-cream-50 placeholder:text-cream-200/40 focus:outline-none"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="hidden h-11 items-center gap-2 rounded-xl bg-gold-500 px-5 text-sm font-medium text-ink-950 hover:bg-gold-400 sm:flex"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              <Button href="/learn/beginner-quran-guide" size="md">
                <Icon name="book" size={16} />
                Start Beginner Path
              </Button>
              <Button href="/learn/quran-themes" size="md" variant="outline">
                Explore Quran Themes
                <Icon name="arrow-right" size={14} />
              </Button>
              <Button href="/learn/tajweed-basics" size="md" variant="ghost">
                <Icon name="sparkle" size={14} />
                Learn Tajweed
              </Button>
              <Button href="/learn/names-of-allah" size="md" variant="ghost">
                <Icon name="feather" size={14} />
                Names of Allah
              </Button>
            </div>
          </div>

          {/* Decorative ornament */}
          <div className="relative mx-auto hidden h-72 w-72 items-center justify-center lg:flex">
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <linearGradient id="lhg" x1="0" x2="1">
                  <stop offset="0" stopColor="rgba(212,165,116,0.55)" />
                  <stop offset="1" stopColor="rgba(212,165,116,0.10)" />
                </linearGradient>
              </defs>
              <g fill="none" stroke="url(#lhg)" strokeWidth="0.8">
                <circle cx="100" cy="100" r="90" />
                <circle cx="100" cy="100" r="70" />
                <circle cx="100" cy="100" r="50" />
                <circle cx="100" cy="100" r="30" />
                <path d="M100 10 L130 90 L190 100 L130 110 L100 190 L70 110 L10 100 L70 90 Z" />
              </g>
            </svg>
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500 text-ink-950 shadow-gold-glow">
              <Icon name="book" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Source-transparency strip */}
      <div className="border-t border-ink-600/40 bg-ink-900/60">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3 text-xs text-cream-200/70">
          <p className="flex items-center gap-2">
            <Icon name="check" size={12} className="text-gold-400" />
            QuranVoice never publishes religious content without a verified source.
          </p>
          <Link
            href="/sources"
            className="inline-flex items-center gap-1 text-gold-300 hover:text-gold-200"
          >
            See source disclosure
            <Icon name="arrow-right" size={11} />
          </Link>
        </div>
      </div>
    </section>
  );
}
