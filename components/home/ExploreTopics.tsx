import Link from 'next/link';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TOPICS } from '@/lib/data/home';

export function ExploreTopics() {
  return (
    <section className="container-page py-12 md:py-16">
      <SectionHeader
        eyebrow="Themes"
        title="Explore Topics"
        description="Discover ayahs grouped by theme — a guided way to study the Quran."
        action={{ label: 'All topics', href: '/topics' }}
      />

      <div className="relative -mx-4 sm:mx-0">
        <ul className="flex gap-2.5 overflow-x-auto px-4 pb-3 no-scrollbar sm:flex-wrap sm:px-0">
          {TOPICS.map((t) => (
            <li key={t.slug} className="shrink-0">
              <Link
                href={`/topics/${t.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-ink-600/70 bg-ink-800/50 px-4 py-2 text-sm font-medium text-cream-100/85 transition-all hover:-translate-y-0.5 hover:border-gold-500/40 hover:bg-gold-500/10 hover:text-gold-200"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500/70" aria-hidden="true" />
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
        {/* Edge fade on mobile */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-ink-900 to-transparent sm:hidden" aria-hidden="true" />
      </div>
    </section>
  );
}
