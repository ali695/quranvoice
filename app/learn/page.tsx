import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CategoryGrid } from '@/components/learn/CategoryGrid';
import { LearningHero } from '@/components/learn/LearningHero';
import { LearningPathCard } from '@/components/learn/LearningPathCard';
import { LEARNING_CATEGORIES } from '@/lib/data/learning/categories';
import { LEARNING_PATHS } from '@/lib/data/learning/paths';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/learn',
    title: 'Learning Library — QuranVoice',
    description:
      'Structured Quran learning with verified source references — names of Allah, Quranic duas, stories of the prophets, Tajweed, themes, daily reflection, and study paths.',
  });
}

export default function LearnIndex() {
  return (
    <>
      <LearningHero />

      <AppShell>
        {/* Featured learning paths */}
        <SectionHeader
          eyebrow="Study paths"
          title="Featured learning paths"
          description="Step-by-step paths through the Quran — verified content where available, source-required states where it isn't."
          action={{ label: 'See sources', href: '/sources' }}
        />
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LEARNING_PATHS.map((p) => (
            <li key={p.id}>
              <LearningPathCard path={p} />
            </li>
          ))}
        </ul>

        {/* Pillars */}
        <div className="mt-14">
          <SectionHeader
            eyebrow="QuranVoice pillars inside the library"
            title="Learn the way QuranVoice is built"
            description="Each pillar lives inside the Learning Library — and stays source-aware."
          />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: '/learn/daily-reflection', icon: 'sparkle', label: 'QuranVoice Daily', body: 'A one-ayah-a-day rhythm. Verified Quran text, private notes.' },
              { href: '/learn/quranic-duas', icon: 'note', label: 'Quranic Duas', body: 'Supplications taught directly in the Quran — each with verse reference.' },
              { href: '/learn/names-of-allah', icon: 'feather', label: 'Names of Allah', body: 'Only names that appear in the Quran, with verse-key sources.' },
              { href: '/learn/names-of-prophet-muhammad', icon: 'feather', label: 'Names of Prophet ﷺ', body: 'Quranic names and titles of the Prophet ﷺ.' },
              { href: '/learn/stories-of-the-prophets', icon: 'scroll', label: 'Stories of the Prophets', body: 'Per-prophet Quran source index — read in the QuranVoice reader.' },
              { href: '/learn/tajweed-basics', icon: 'sparkle', label: 'Tajweed Basics', body: 'A neutral overview — never AI-generated rule rulings.' },
              { href: '/learn/quran-themes', icon: 'flag', label: 'Quran Themes', body: 'Themes the Quran returns to — mapping pending verified review.' },
              { href: '/learn/quran-vocabulary', icon: 'globe', label: 'Quran Vocabulary', body: 'Frequent Arabic words — activates with verified data.' },
              { href: '/learn/hifz-and-revision', icon: 'brain', label: 'Hifz & Revision', body: 'Practical workflow for memorization and review.' },
            ].map((p) => (
              <Card key={p.href} as="li" variant="elevated">
                <Link href={p.href} className="flex h-full flex-col gap-3 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-300">
                    <Icon name={p.icon as 'sparkle'} size={16} />
                  </span>
                  <h3 className="font-display text-base font-medium text-cream-50">{p.label}</h3>
                  <p className="text-sm leading-relaxed text-cream-200/65">{p.body}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-gold-300">
                    Open
                    <Icon name="arrow-right" size={13} />
                  </span>
                </Link>
              </Card>
            ))}
          </ul>
        </div>

        {/* Full category grid */}
        <div className="mt-14">
          <SectionHeader
            eyebrow="All categories"
            title="Browse by topic"
            description="Every card carries a live source status. Verified topics open into their full pages; source-required topics show a clean review state."
          />
          <CategoryGrid categories={LEARNING_CATEGORIES} />
        </div>

        {/* Source transparency strip */}
        <Card variant="feature" className="relative mt-14 overflow-hidden p-6 md:p-8">
          <div className="absolute inset-0 pattern-ornament opacity-25" aria-hidden="true" />
          <div className="relative grid items-center gap-5 md:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-400/80">
                <Icon name="check" size={13} />
                Source-first by design
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cream-100/85">
                QuranVoice publishes religious content only from registered, verified sources. We
                never auto-generate tafsir, hadith, divine names, or prophetic titles. See exactly
                what we serve and from where on the source page.
              </p>
            </div>
            <Link
              href="/sources"
              className="inline-flex items-center gap-2 rounded-lg border border-gold-500/40 bg-gold-500/10 px-4 py-2 text-sm font-medium text-gold-200 hover:bg-gold-500/15"
            >
              Sources &amp; attribution
              <Icon name="arrow-right" size={14} />
            </Link>
          </div>
        </Card>
      </AppShell>
    </>
  );
}
