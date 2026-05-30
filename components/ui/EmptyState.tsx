import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon = 'sparkle', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-ink-600/70 bg-ink-800/30 px-6 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-500/20 bg-gold-500/8 text-gold-300">
        <Icon name={icon} size={22} />
      </span>
      <div className="max-w-md">
        <h3 className="font-display text-xl font-medium text-cream-50">{title}</h3>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-cream-200/65">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
