import type { ReactNode } from 'react';
import { Icon } from './Icon';

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this content. Please try again in a moment.',
  action,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300">
        <Icon name="close" size={22} />
      </span>
      <div className="max-w-md">
        <h3 className="font-display text-xl font-medium text-cream-50">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cream-200/65">{description}</p>
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

/**
 * Unavailable state — for content the active source does not (yet) provide.
 * Distinct from a runtime error: this is an intentional, source-aware state.
 * Supports an optional action (e.g. retry, "choose a source") and a short
 * status badge so the UI never has to fall back to an opaque "locked" label.
 */
export function UnavailableState({
  title = 'Content not available yet',
  description = 'This content will appear here when a verified source is connected.',
  badge,
  action,
}: {
  title?: string;
  description?: string;
  badge?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-dashed border-ink-600/70 bg-ink-800/40 p-4">
      <Icon name="feather" size={18} className="mt-0.5 text-gold-400/80" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-cream-100">{title}</p>
          {badge && (
            <span className="rounded-full border border-gold-500/25 bg-gold-500/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-gold-200/85">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-cream-200/65">{description}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}
