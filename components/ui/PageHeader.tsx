import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

/** Standard top-of-page header used by most route pages. */
export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden border-b border-ink-600/40">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-ink-850/60 via-ink-900 to-ink-900" />
        <div className="absolute inset-0 pattern-ornament opacity-25" />
      </div>
      <div className="container-page relative py-10 md:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {eyebrow && (
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gold-400">
                <span className="h-px w-6 bg-gold-500/60" />
                {eyebrow}
              </span>
            )}
            <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-cream-50 sm:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="mt-3 text-base leading-relaxed text-cream-200/70">{description}</p>
            )}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
