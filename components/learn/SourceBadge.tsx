import { Icon } from '@/components/ui/Icon';
import type { SourceStatus } from '@/lib/types/learning';
import { cn } from '@/lib/utils/cn';

const STATUS_CFG: Record<SourceStatus, { label: string; className: string; icon: 'check' | 'feather' | 'sparkle' }> = {
  verified: {
    label: 'Verified source',
    icon: 'check',
    className: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
  },
  review_pending: {
    label: 'Review pending',
    icon: 'sparkle',
    className: 'border-gold-500/40 bg-gold-500/10 text-gold-200',
  },
  needs_source: {
    label: 'Source required',
    icon: 'feather',
    className: 'border-cream-200/20 bg-ink-700/40 text-cream-200/70',
  },
  not_connected: {
    label: 'Not connected',
    icon: 'feather',
    className: 'border-cream-200/20 bg-ink-700/40 text-cream-200/60',
  },
};

export function SourceBadge({
  status,
  className,
}: {
  status: SourceStatus;
  className?: string;
}) {
  const cfg = STATUS_CFG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider',
        cfg.className,
        className,
      )}
    >
      <Icon name={cfg.icon} size={11} />
      {cfg.label}
    </span>
  );
}
