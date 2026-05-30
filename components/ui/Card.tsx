import type { HTMLAttributes, ReactNode } from 'react';

type Variant = 'default' | 'elevated' | 'cream' | 'subtle' | 'feature';

const variants: Record<Variant, string> = {
  default:
    'rounded-2xl border border-ink-600/60 bg-ink-800/60 backdrop-blur-sm',
  elevated:
    'rounded-2xl border border-ink-600/60 bg-ink-800/70 backdrop-blur-sm shadow-card hover:border-gold-500/30 hover:bg-ink-750/80 transition-all duration-300',
  cream:
    'rounded-2xl border border-cream-300/30 card-cream',
  subtle:
    'rounded-2xl border border-ink-700/60 bg-ink-850/60',
  feature:
    'rounded-2xl border border-gold-500/20 bg-gradient-to-br from-ink-800/80 via-ink-800/60 to-ink-850/80 shadow-gold-glow',
};

type CardElement = 'div' | 'article' | 'section' | 'li';

interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: Variant;
  children: ReactNode;
  as?: CardElement;
}

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

export function Card({
  variant = 'default',
  className,
  children,
  as: Tag = 'div',
  ...rest
}: CardProps) {
  const Component = Tag as React.ElementType;
  return (
    <Component className={cx(variants[variant], className)} {...rest}>
      {children}
    </Component>
  );
}
