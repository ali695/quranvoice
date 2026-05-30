import type { ReactNode } from 'react';

interface TooltipProps {
  label: string;
  children: ReactNode;
}

/** Lightweight CSS-only tooltip. Title-attribute fallback for accessibility. */
export function Tooltip({ label, children }: TooltipProps) {
  return (
    <span className="group/tooltip relative inline-flex" title={label}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-ink-600/70 bg-ink-900/95 px-2.5 py-1 text-xs text-cream-100 opacity-0 shadow-card transition-opacity duration-200 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}
