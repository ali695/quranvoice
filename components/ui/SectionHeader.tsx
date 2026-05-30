import Link from 'next/link';
import { Icon } from './Icon';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: {
    label: string;
    href: string;
  };
}

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
}: SectionHeaderProps) {
  const alignClasses = align === 'center' ? 'text-center mx-auto items-center' : 'text-left';

  return (
    <div className={cx('mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6', align === 'center' && 'md:flex-col md:items-center md:gap-3')}>
      <div className={cx('flex flex-col gap-3', alignClasses, align === 'center' && 'max-w-2xl')}>
        {eyebrow && (
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-gold-400">
            <span className="h-px w-6 bg-gold-500/60" />
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-3xl font-medium leading-tight text-cream-50 sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="max-w-2xl text-base leading-relaxed text-cream-200/70">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex items-center gap-2 self-start text-sm font-medium text-gold-400 transition-colors hover:text-gold-300 md:self-end"
        >
          {action.label}
          <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
