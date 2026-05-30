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
 * Unavailable state — for religious content that lacks a verified source.
 * Distinct from a runtime error: this is an intentional safety state.
 */
export function UnavailableState({
  title = 'Content not available yet',
  description = 'This content will appear here when a verified source is connected.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-dashed border-ink-600/70 bg-ink-800/40 p-4">
      <Icon name="feather" size={18} className="mt-0.5 text-gold-400/80" />
      <div>
        <p className="text-sm font-medium text-cream-100">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-cream-200/65">{description}</p>
      </div>
    </div>
  );
}
