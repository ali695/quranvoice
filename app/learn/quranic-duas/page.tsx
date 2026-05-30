import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { SourceBadge } from '@/components/learn/SourceBadge';
import { DUA_CATEGORIES, QURANIC_DUAS, type DuaCategory } from '@/lib/data/learning/quranicDuas';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/learn/quranic-duas',
    title: 'Quranic Duas — QuranVoice Learning Library',
    description:
      'Supplications taught directly in the Quran. Each dua opens in the QuranVoice reader so Arabic text and translation come from the verified provider.',
  });
}

interface SP {
  searchParams: Promise<{ cat?: string }>;
}

export default async function QuranicDuasPage({ searchParams }: SP) {
  const { cat } = await searchParams;
  const activeCategory = (cat && DUA_CATEGORIES.find((c) => c.slug === cat)?.slug) || null;
  const filtered = activeCategory
    ? QURANIC_DUAS.filter((d) => d.category === activeCategory)
    : QURANIC_DUAS;

  return (
    <>
      <PageHeader
        eyebrow="Learning Library"
        title="Quranic duas"
        description="Supplications taught directly in the Quran. The Arabic text and translation render in the QuranVoice reader using verified provider data — we never paste Quranic text into source code."
      />
      <AppShell>
        {/* Category filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/learn/quranic-duas"
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              !activeCategory
                ? 'border-gold-500/50 bg-gold-500/10 text-gold-200'
                : 'border-ink-600/70 text-cream-200/75 hover:border-gold-500/30'
            }`}
          >
            All ({QURANIC_DUAS.length})
          </Link>
          {DUA_CATEGORIES.map((c) => {
            const count = QURANIC_DUAS.filter((d) => d.category === c.slug).length;
            if (count === 0) return null;
            const isActive = activeCategory === c.slug;
            return (
              <Link
                key={c.slug}
                href={`/learn/quranic-duas?cat=${c.slug}`}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  isActive
                    ? 'border-gold-500/50 bg-gold-500/10 text-gold-200'
                    : 'border-ink-600/70 text-cream-200/75 hover:border-gold-500/30'
                }`}
              >
                {c.label} ({count})
              </Link>
            );
          })}
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <Card key={d.id} as="li" variant="elevated" className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-wider text-gold-400/80">
                  {DUA_CATEGORIES.find((c) => c.slug === d.category as DuaCategory)?.label ?? d.category}
                </span>
                <span className="font-mono text-xs text-gold-300/80">{d.verseKey}</span>
              </div>
              <h3 className="font-display text-base text-cream-50">{d.title}</h3>
              <p className="text-sm leading-relaxed text-cream-200/65">{d.context}</p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <SourceBadge status={d.sourceStatus} />
                <Link
                  href={`/quran/${d.verseKey.replace(':', '/')}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-gold-300 hover:text-gold-200"
                >
                  Open in reader
                  <Icon name="arrow-right" size={11} />
                </Link>
              </div>
            </Card>
          ))}
        </ul>

        <Card variant="feature" className="mt-10 p-6 md:p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-400/80">
            <Icon name="check" size={13} />
            Why this is only Quranic duas
          </div>
          <p className="mt-3 text-sm leading-relaxed text-cream-100/85">
            Duas from the prophetic Sunnah (hadith collections) require a verified hadith source
            to be published in QuranVoice. Until such a source is registered, this page lists
            only duas the Quran itself preserves.
          </p>
        </Card>
      </AppShell>
    </>
  );
}
