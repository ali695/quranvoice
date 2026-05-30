import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SEARCH_EXAMPLES } from '@/lib/data/home';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-600/40">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900 via-ink-850 to-ink-900" />
        <div className="absolute inset-0 pattern-ornament opacity-40" />
        <div className="absolute -top-32 left-1/2 h-96 w-[800px] -translate-x-1/2 rounded-full bg-gold-500/8 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-gold-500/5 blur-[100px]" />
      </div>

      <div className="container-page relative py-16 md:py-24 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left content */}
          <div className="lg:col-span-7">
            {/* Decorative line */}
            <div className="ornament-line mb-7 max-w-md">
              <span className="text-xs uppercase tracking-[0.3em] text-gold-400/90">
                Bismillah
              </span>
            </div>

            <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-tight text-cream-50 sm:text-5xl lg:text-6xl">
              Read, Listen, and Study{' '}
              <span className="text-gradient-gold">the Noble Quran</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream-200/70">
              A modern Quran platform for recitation, tafsir, translations,
              memorization, notes, bookmarks, and daily reflection.
            </p>

            {/* Search */}
            <form
              action="/search"
              method="get"
              role="search"
              className="mt-8 max-w-2xl"
            >
              <label htmlFor="hero-search" className="sr-only">
                Search Quran
              </label>
              <div className="group relative flex items-center rounded-2xl border border-ink-600/80 bg-ink-800/70 p-2 shadow-soft backdrop-blur-sm transition-all focus-within:border-gold-500/50 focus-within:shadow-gold-glow">
                <Icon name="search" size={20} className="ml-3 text-cream-200/50" />
                <input
                  id="hero-search"
                  name="q"
                  type="search"
                  placeholder="Search Surah, Ayah, topic, translation..."
                  className="h-12 flex-1 bg-transparent px-3 text-base text-cream-50 placeholder:text-cream-200/40 focus:outline-none"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="hidden h-12 items-center gap-2 rounded-xl bg-gold-500 px-5 text-sm font-medium text-ink-950 transition-colors hover:bg-gold-400 sm:flex"
                >
                  Search
                  <Icon name="arrow-right" size={16} />
                </button>
              </div>

              {/* Examples */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-cream-200/40">
                  Try:
                </span>
                {SEARCH_EXAMPLES.map((ex) => (
                  <Link
                    key={ex.label}
                    href={ex.href}
                    className="rounded-full border border-ink-600/70 bg-ink-800/40 px-3 py-1 text-xs text-cream-200/75 transition-colors hover:border-gold-500/40 hover:text-gold-300"
                  >
                    {ex.label}
                  </Link>
                ))}
              </div>
            </form>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="/quran" size="lg">
                <Icon name="book" size={18} />
                Start Reading
              </Button>
              <Button href="/recitations" size="lg" variant="outline">
                <Icon name="play" size={16} />
                Listen to Quran
              </Button>
            </div>

            {/* Trust strip */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-cream-200/55">
              <div className="flex items-center gap-2">
                <Icon name="check" size={14} className="text-gold-400" />
                Verified Quran sources
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check" size={14} className="text-gold-400" />
                Tafsir & translations
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check" size={14} className="text-gold-400" />
                No ads, no tracking
              </div>
            </div>
          </div>

          {/* Right visual: reading card mockup */}
          <div className="lg:col-span-5">
            <HeroMushafCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroMushafCard() {
  return (
    <div className="relative mx-auto max-w-md lg:ml-auto">
      {/* Glow */}
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-gold-500/15 opacity-60 blur-3xl" aria-hidden="true" />

      <div className="relative overflow-hidden rounded-3xl border border-ink-600/70 bg-gradient-to-b from-ink-800 via-ink-850 to-ink-900 shadow-card">
        <div className="absolute inset-0 pattern-stars opacity-40" aria-hidden="true" />

        {/* Top bar */}
        <div className="relative flex items-center justify-between border-b border-ink-600/50 px-6 py-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-cream-200/50">
              Surah 2 · Al-Baqarah
            </div>
            <div className="mt-0.5 text-sm font-medium text-cream-100">
              Ayah 255 · Ayat al-Kursi
            </div>
          </div>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gold-400 hover:bg-ink-700/60"
            aria-label="Bookmark"
          >
            <Icon name="bookmark" size={18} />
          </button>
        </div>

        {/* Arabic preview */}
        <div className="relative px-6 py-7">
          <div
            className="arabic text-right text-2xl leading-[2.1] text-cream-50"
            dir="rtl"
            lang="ar"
          >
            ﷽
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream-200/70">
            Open the mushaf to read this verse with translation, tafsir, and
            word-by-word analysis from verified sources.
          </p>
        </div>

        {/* Player */}
        <div className="relative flex items-center gap-3 border-t border-ink-600/50 bg-ink-900/40 px-6 py-4">
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-ink-950 shadow-[0_4px_12px_-2px_rgba(212,165,116,0.5)] hover:bg-gold-400"
            aria-label="Play recitation"
          >
            <Icon name="play" size={16} />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-cream-200/55">
              <span>00:00</span>
              <span>Recitation preview</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-700">
              <div className="h-full w-[18%] rounded-full bg-gradient-to-r from-gold-400 to-gold-600" />
            </div>
          </div>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-cream-200/70 hover:bg-ink-700/60"
            aria-label="Volume"
          >
            <Icon name="volume" size={16} />
          </button>
        </div>
      </div>

      {/* Floating mini-card */}
      <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-ink-600/70 bg-ink-800/95 px-4 py-3 shadow-card backdrop-blur md:flex md:items-center md:gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/15 text-gold-300">
          <Icon name="feather" size={16} />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-cream-200/50">
            Tafsir
          </div>
          <div className="text-xs font-medium text-cream-100">
            Verified sources
          </div>
        </div>
      </div>
    </div>
  );
}
