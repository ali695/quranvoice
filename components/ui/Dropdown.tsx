'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface DropdownProps {
  trigger: ReactNode;
  align?: 'left' | 'right';
  children: (close: () => void) => ReactNode;
}

export function Dropdown({ trigger, align = 'right', children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-lg"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            'absolute z-40 mt-2 min-w-[200px] overflow-hidden rounded-xl border border-ink-600/70 bg-ink-850 shadow-card',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
  href,
  destructive = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  destructive?: boolean;
}) {
  const className = cn(
    'flex w-full items-center gap-2 px-3.5 py-2 text-sm transition-colors',
    destructive ? 'text-red-300 hover:bg-red-500/10' : 'text-cream-100/85 hover:bg-ink-700/60 hover:text-gold-200',
  );
  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className} role="menuitem">
      {children}
    </button>
  );
}
