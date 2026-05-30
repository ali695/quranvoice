import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { SourceBadge } from '@/components/learn/SourceBadge';
import { NAMES_OF_ALLAH, NAMES_OF_ALLAH_PENDING_REVIEW } from '@/lib/data/learning/namesOfAllah';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/learn/names-of-allah',
    title: 'Names of Allah — QuranVoice Learning Library',
    description:
      "Divine names that appear directly in the Quran, each with verse references. Compiled lists from the wider tradition require per-entry source review.",
  });
}

export default function NamesOfAllahPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learning Library"
        title="The names of Allah"
        description="Each card below contains a name that appears explicitly in the Quran, with a direct verse reference. Names from the wider scholarly compilations require per-entry review before publication."
      />
      <AppShell>
        {/* Source-policy explainer */}
        <Card variant="feature" className="relative overflow-hidden p-6 md:p-8">
          <div className="absolute inset-0 pattern-ornament opacity-25" aria-hidden="true" />
          <div className="relative grid gap-5 md:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-400/80">
                <Icon name="check" size={13} />
                Source policy
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cream-100/85">
                QuranVoice does not publish a generic &ldquo;99 names&rdquo; list without
                per-entry source verification. Compiled lists in circulation rest on narrations
                of varying strength. We publish only names that appear directly in the Quran with
                a verse reference, and we mark wider-tradition names as <em>review pending</em>
                until a verified scholarly source is registered for each one.
              </p>
            </div>
            <Link
              href="/sources"
              className="inline-flex items-center gap-2 rounded-lg border border-gold-500/40 bg-gold-500/10 px-4 py-2 text-sm font-medium text-gold-200 hover:bg-gold-500/15"
            >
              Full source disclosure
              <Icon name="arrow-right" size={14} />
            </Link>
          </div>
        </Card>

        {/* Filter strip */}
        <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-cream-200/65">
          <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-gold-200">
            Quran-sourced ({NAMES_OF_ALLAH.length})
          </span>
          <span className="rounded-full border border-ink-600/70 bg-ink-800/40 px-3 py-1">
            Review pending ({NAMES_OF_ALLAH_PENDING_REVIEW.length})
          </span>
        </div>

        {/* Verified names grid */}
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NAMES_OF_ALLAH.map((n) => (
            <Card key={n.id} as="li" variant="elevated" className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gold-400/80">
                    {n.transliteration}
                  </p>
                  <h3 className="mt-1 font-display text-lg text-cream-50">{n.title}</h3>
                </div>
                <span className="arabic text-3xl text-gold-100" dir="rtl" lang="ar">
                  {n.titleArabic}
                </span>
              </div>
              {n.subtitle && <p className="text-sm text-cream-200/75">{n.subtitle}</p>}
              {n.relatedVerseKeys && n.relatedVerseKeys.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {n.relatedVerseKeys.slice(0, 3).map((vk) => (
                    <Link
                      key={vk}
                      href={`/quran/${vk.replace(':', '/')}`}
                      className="inline-flex items-center gap-1 rounded-full border border-ink-700/60 bg-ink-850/60 px-2.5 py-0.5 text-[11px] font-mono text-gold-300/90 hover:border-gold-500/40 hover:text-gold-200"
                    >
                      Quran {vk}
                      <Icon name="arrow-right" size={10} />
                    </Link>
                  ))}
                </div>
              )}
              <div className="mt-auto flex items-center justify-between pt-2">
                <SourceBadge status={n.sourceStatus} />
                <span className="text-[10px] uppercase tracking-wider text-cream-200/45">
                  {n.sourceRefs.length} ref{n.sourceRefs.length === 1 ? '' : 's'}
                </span>
              </div>
            </Card>
          ))}
        </ul>

        {/* Review-pending placeholder */}
        <section className="mt-10">
          <h2 className="font-display text-xl text-cream-50">From the wider tradition</h2>
          <p className="mt-2 text-sm text-cream-200/65">
            These names appear in the wider scholarly compilations. They are listed here as
            placeholders only — QuranVoice will publish them once each one has a verified source
            registered for it.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {NAMES_OF_ALLAH_PENDING_REVIEW.map((slug) => (
              <li
                key={slug}
                className="inline-flex items-center gap-2 rounded-full border border-ink-700/60 bg-ink-850/40 px-3 py-1.5 text-xs text-cream-200/55"
              >
                <Icon name="feather" size={11} />
                {slug}
                <span className="text-[10px] uppercase tracking-wider text-cream-200/40">
                  · review pending
                </span>
              </li>
            ))}
          </ul>
        </section>
      </AppShell>
    </>
  );
}
