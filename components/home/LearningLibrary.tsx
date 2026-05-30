import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LEARNING_ARTICLES } from '@/lib/data/home';

/**
 * CSS-pattern cover for each library card — keeps the page free of
 * AI-looking religious imagery while remaining visually elegant.
 */
const COVER_THEMES = [
  'from-[#1a2542] via-[#1e2c4f] to-[#0f1830]',
  'from-[#2a1f1a] via-[#3a2a1f] to-[#1f1610]',
  'from-[#1a2a2a] via-[#1f3a36] to-[#0f1f1c]',
  'from-[#2a1a2a] via-[#3a1f33] to-[#1a0f1a]',
  'from-[#1a2230] via-[#243144] to-[#0f1622]',
  'from-[#2a2a1a] via-[#3a3322] to-[#1a1a0f]',
];

function ArticleCover({ index, title }: { index: number; title: string }) {
  const theme = COVER_THEMES[index % COVER_THEMES.length];
  return (
    <div className={`relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-gradient-to-br ${theme}`}>
      <div className="absolute inset-0 pattern-ornament opacity-50" aria-hidden="true" />
      <div className="absolute inset-0 pattern-stars opacity-30" aria-hidden="true" />
      {/* Inline SVG calligraphy-style mark — geometric, not real script */}
      <svg
        viewBox="0 0 200 120"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`g-${index}`} x1="0" x2="1">
            <stop offset="0" stopColor="rgba(212,165,116,0.5)" />
            <stop offset="1" stopColor="rgba(212,165,116,0.15)" />
          </linearGradient>
        </defs>
        <g fill="none" stroke={`url(#g-${index})`} strokeWidth="0.6">
          <circle cx="100" cy="60" r="40" />
          <circle cx="100" cy="60" r="30" />
          <circle cx="100" cy="60" r="20" />
          <path d="M60 60 L140 60 M100 20 L100 100" />
          <path d="M72 32 L128 88 M128 32 L72 88" />
        </g>
        <g fill="rgba(212,165,116,0.85)">
          <circle cx="100" cy="60" r="2.5" />
        </g>
      </svg>
      <div className="absolute bottom-3 left-4 right-4 text-[10px] uppercase tracking-[0.2em] text-gold-200/80">
        QuranVoice · Library
      </div>
      <span className="sr-only">{title} cover</span>
    </div>
  );
}

export function LearningLibrary() {
  return (
    <section className="container-page py-12 md:py-16">
      <SectionHeader
        eyebrow="Library"
        title="Learning Library"
        description="Curated guides and reflections to deepen your relationship with the Quran."
        action={{ label: 'Browse library', href: '/learn' }}
      />

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {LEARNING_ARTICLES.map((a, i) => (
          <Card key={a.slug} as="li" variant="elevated" className="group overflow-hidden">
            <Link href={`/learn/${a.slug}`} className="flex h-full flex-col">
              <ArticleCover index={i} title={a.title} />
              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-gold-300">
                  {a.category}
                </span>
                <h3 className="font-display text-lg font-medium text-cream-50 transition-colors group-hover:text-gold-200">
                  {a.title}
                </h3>
                <p className="text-sm leading-relaxed text-cream-200/65">
                  {a.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-gold-300">
                  Read more
                  <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </Card>
        ))}
      </ul>
    </section>
  );
}
