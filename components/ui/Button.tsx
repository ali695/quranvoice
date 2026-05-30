import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary:
    'bg-gold-500 text-ink-950 hover:bg-gold-400 active:bg-gold-600 shadow-[0_4px_16px_-4px_rgba(212,165,116,0.45)] hover:shadow-[0_6px_20px_-4px_rgba(212,165,116,0.55)]',
  secondary:
    'bg-ink-700/80 text-cream-100 border border-ink-600 hover:bg-ink-600 hover:border-ink-500',
  ghost:
    'text-cream-200/80 hover:text-gold-300 hover:bg-ink-800/60',
  outline:
    'border border-gold-500/40 text-gold-300 hover:bg-gold-500/10 hover:border-gold-400/70',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm rounded-lg',
  md: 'h-11 px-5 text-sm rounded-xl',
  lg: 'h-13 px-7 text-base rounded-xl py-3.5',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = CommonProps & {
  href: string;
  'aria-label'?: string;
  target?: string;
  rel?: string;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

export function Button(props: ButtonProps | LinkProps) {
  const { variant = 'primary', size = 'md', className, children } = props;
  const classes = cx(base, variants[variant], sizes[size], className);

  if ('href' in props && props.href) {
    const { href, target, rel } = props;
    return (
      <Link
        href={href}
        className={classes}
        target={target}
        rel={rel}
        aria-label={props['aria-label']}
      >
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as ButtonProps;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
