import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';

export type MushafStatus = 'available' | 'preview' | 'locked';

export interface MushafLandingProps {
  eyebrow: string;
  title: string;
  highlight?: string;
  description: string;
  status: MushafStatus;
  /** What the user has to provide / what's pending */
  sourceRequirement: string;
  /** Where the verified data does (or would) come from */
  sourceCredit?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Decorative SVG pattern for the hero */
  pattern?: 'star' | 'circles' | 'lines';
  /** Bullet-style benefits */
  features: Array<{ icon: IconName; title: string; body: string }>;
}

const PATTERNS: Record<NonNullable<MushafLandingProps['pattern']>, React.ReactNode> = {
  star: (
    <g fill="none" stroke="rgba(212,165,116,0.35)" strokeWidth="0.75">
      <circle cx="100" cy="100" r="80" />
      <circle cx="100" cy="100" r="60" />
      <circle cx="100" cy="100" r="40" />
      <path d="M100 20 L100 180 M20 100 L180 100" />
      <path d="M40 40 L160 160 M160 40 L40 160" />
      <path d="M100 20 L130 90 L180 100 L130 110 L100 180 L70 110 L20 100 L70 90 Z" />
    </g>
  ),
  circles: (
    <g fill="none" stroke="rgba(212,165,116,0.3)" strokeWidth="0.75">
      <circle cx="100" cy="100" r="90" />
      <circle cx="100" cy="60" r="40" />
      <circle cx="100" cy="140" r="40" />
      <circle cx="60" cy="100" r="40" />
      <circle cx="140" cy="100" r="40" />
    </g>
  ),
  lines: (
    <g fill="none" stroke="rgba(212,165,116,0.28)" strokeWidth="0.5">
      <path d="M20 40 L180 40 M20 60 L180 60 M20 80 L180 80 M20 100 L180 100 M20 120 L180 120 M20 140 L180 140 M20 160 L180 160" />
    </g>
  ),
};

function StatusPill({ status }: { status: MushafStatus }) {
  const cfg =
    status === 'available'
      ? { label: 'Available', className: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' }
      : status === 'preview'
        ? { label: 'Preview · API-ready', className: 'border-gold-500/40 bg-gold-500/10 text-gold-200' }
        : { label: 'Locked · needs verified data', className: 'border-cream-200/20 bg-ink-700/40 text-cream-200/70' };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider ${cfg.className}`}
    >
      <Icon name={status === 'locked' ? 'feather' : 'check'} size={11} />
      {cfg.label}
    </span>
  );
}

export function MushafLanding({
  eyebrow,
  title,
  highlight,
  description,
  status,
  sourceRequirement,
  sourceCredit,
  primaryCta,
  secondaryCta,
  pattern = 'star',
  features,
}: MushafLandingProps) {
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
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        </div>
        <div className="container-page relative py-12 md:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gold-400">
                  <span className="h-px w-6 bg-gold-500/60" />
                  {eyebrow}
                </span>
                <StatusPill status={status} />
              </div>
              <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-cream-50 sm:text-4xl">
                {titleNode}
              </h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-cream-200/70">
                {description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {primaryCta && (
                  <Button href={primaryCta.href} size="md">
                    <Icon name="book" size={16} />
                    {primaryCta.label}
                  </Button>
                )}
                {secondaryCta && (
                  <Button href={secondaryCta.href} size="md" variant="outline">
                    {secondaryCta.label}
                    <Icon name="arrow-right" size={14} />
                  </Button>
                )}
              </div>
            </div>
            <div className="relative mx-auto hidden h-64 w-64 items-center justify-center lg:flex">
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
                {PATTERNS[pattern]}
              </svg>
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500 text-ink-950 shadow-gold-glow">
                <Icon name="book" size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppShell>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} as="li" variant="elevated" className="p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-300">
                <Icon name={f.icon} size={18} />
              </span>
              <h3 className="mt-3 font-display text-base font-medium text-cream-50">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cream-200/65">{f.body}</p>
            </Card>
          ))}
        </ul>

        <Card variant="feature" className="relative mt-10 overflow-hidden p-6 md:p-8">
          <div className="absolute inset-0 pattern-ornament opacity-25" aria-hidden="true" />
          <div className="relative grid gap-5 md:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-400/80">
                <Icon name="scroll" size={13} />
                Source &amp; verification
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cream-100/85">
                {sourceRequirement}
              </p>
              {sourceCredit && (
                <p className="mt-2 text-xs text-cream-200/55">{sourceCredit}</p>
              )}
            </div>
            <div className="flex items-center">
              <Link
                href="/sources"
                className="inline-flex items-center gap-2 rounded-lg border border-gold-500/40 bg-gold-500/10 px-4 py-2 text-sm font-medium text-gold-200 hover:bg-gold-500/15"
              >
                See full source disclosure
                <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </div>
        </Card>
      </AppShell>
    </>
  );
}
