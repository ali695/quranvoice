import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';
import { UnavailableState } from '@/components/ui/ErrorState';
import { SourceBadge } from './SourceBadge';
import type { ReactNode } from 'react';
import type { SourceStatus } from '@/lib/types/learning';

interface LearningTopicShellProps {
  eyebrow: string;
  title: string;
  highlight?: string;
  description: string;
  sourceStatus: SourceStatus;
  sourceNote: string;
  icon?: IconName;
  pattern?: 'star' | 'arabesque' | 'lines';
  /** Optional rich content above the unavailable / verified body */
  intro?: ReactNode;
  /** Reading suggestions (Quran links). Each is just a verse-key + label. */
  readingSuggestions?: Array<{ verseKey: string; label: string }>;
  /** Internal cross-links */
  related?: Array<{ href: string; label: string }>;
  /** When the source isn't ready, the shell renders an unavailable state. */
  body?: ReactNode;
}

const PATTERN_PATHS: Record<NonNullable<LearningTopicShellProps['pattern']>, ReactNode> = {
  star: (
    <g fill="none" stroke="rgba(212,165,116,0.4)" strokeWidth="0.7">
      <circle cx="100" cy="100" r="80" />
      <circle cx="100" cy="100" r="55" />
      <circle cx="100" cy="100" r="30" />
      <path d="M100 20 L100 180 M20 100 L180 100 M40 40 L160 160 M160 40 L40 160" />
    </g>
  ),
  arabesque: (
    <g fill="none" stroke="rgba(212,165,116,0.4)" strokeWidth="0.6">
      <path d="M100 10 L185 60 L185 140 L100 190 L15 140 L15 60 Z" />
      <path d="M100 35 L160 70 L160 130 L100 165 L40 130 L40 70 Z" />
      <circle cx="100" cy="100" r="22" />
    </g>
  ),
  lines: (
    <g fill="none" stroke="rgba(212,165,116,0.32)" strokeWidth="0.5">
      <path d="M20 40 L180 40 M20 60 L180 60 M20 80 L180 80 M20 100 L180 100 M20 120 L180 120 M20 140 L180 140 M20 160 L180 160" />
    </g>
  ),
};

export function LearningTopicShell({
  eyebrow,
  title,
  highlight,
  description,
  sourceStatus,
  sourceNote,
  icon = 'book',
  pattern = 'star',
  intro,
  readingSuggestions = [],
  related = [],
  body,
}: LearningTopicShellProps) {
  const titleNode = highlight ? (
    <>
      {title.split(highlight)[0]}
      <span className="text-gradient-gold">{highlight}</span>
      {title.split(highlight)[1] ?? ''}
    </>
  ) : (
    title
  );

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-600/40">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-b from-ink-850/70 via-ink-900 to-ink-900" />
          <div className="absolute inset-0 pattern-ornament opacity-25" />
        </div>
        <div className="container-page relative py-10 md:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gold-400">
                  <span className="h-px w-6 bg-gold-500/60" />
                  {eyebrow}
                </span>
                <SourceBadge status={sourceStatus} />
              </div>
              <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-cream-50 sm:text-4xl">
                {titleNode}
              </h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-cream-200/70">
                {description}
              </p>
            </div>
            <div className="relative mx-auto hidden h-48 w-48 items-center justify-center lg:flex">
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
                {PATTERN_PATHS[pattern]}
              </svg>
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500 text-ink-950 shadow-gold-glow">
                <Icon name={icon} size={22} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppShell>
        {intro}

        {/* Body or unavailable state */}
        {body ?? (
          <UnavailableState
            title={
              sourceStatus === 'verified'
                ? 'Content arriving here soon'
                : sourceStatus === 'review_pending'
                  ? 'Awaiting source review'
                  : sourceStatus === 'needs_source'
                    ? 'Requires verified source data'
                    : 'Not connected yet'
            }
            description={sourceNote}
          />
        )}

        {/* Reading suggestions (always safe — links into the reader) */}
        {readingSuggestions.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl text-cream-50">Read in QuranVoice</h2>
            <p className="mt-1 text-sm text-cream-200/65">
              Open these references in the reader. Arabic text and translation come from the
              verified providers registered on{' '}
              <Link href="/sources" className="text-gold-300 hover:text-gold-200">/sources</Link>.
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {readingSuggestions.map((r) => (
                <li key={r.verseKey}>
                  <Link
                    href={`/quran/${r.verseKey.replace(':', '/')}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-ink-700/60 bg-ink-850/60 px-4 py-3 text-sm text-cream-100 hover:border-gold-500/40 hover:text-gold-200"
                  >
                    <span>{r.label}</span>
                    <span className="font-mono text-xs text-gold-300/80">{r.verseKey}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl text-cream-50">Related in QuranVoice</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {related.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink-600/70 bg-ink-800/40 px-3 py-1.5 text-xs text-cream-100/85 hover:border-gold-500/40 hover:text-gold-200"
                  >
                    {r.label}
                    <Icon name="arrow-right" size={11} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Source note */}
        <Card variant="feature" className="relative mt-10 overflow-hidden p-6 md:p-8">
          <div className="absolute inset-0 pattern-ornament opacity-25" aria-hidden="true" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-400/80">
              <Icon name="scroll" size={13} />
              Source &amp; review
            </div>
            <p className="mt-3 text-sm leading-relaxed text-cream-100/85">{sourceNote}</p>
            <Link
              href="/sources"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gold-500/40 bg-gold-500/10 px-4 py-2 text-sm font-medium text-gold-200 hover:bg-gold-500/15"
            >
              Full source disclosure
              <Icon name="arrow-right" size={14} />
            </Link>
          </div>
        </Card>
      </AppShell>
    </>
  );
}
