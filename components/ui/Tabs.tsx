'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultId?: string;
  onChange?: (id: string) => void;
  variant?: 'pills' | 'underline';
}

export function Tabs({ items, defaultId, onChange, variant = 'pills' }: TabsProps) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id);

  const isPills = variant === 'pills';

  return (
    <div>
      <div
        role="tablist"
        className={cn(
          'flex gap-1',
          isPills
            ? 'inline-flex rounded-xl border border-ink-600/60 bg-ink-800/50 p-1'
            : 'border-b border-ink-600/60',
        )}
      >
        {items.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => {
                setActive(t.id);
                onChange?.(t.id);
              }}
              className={cn(
                'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                isPills && (isActive
                  ? 'bg-gold-500/15 text-gold-200'
                  : 'text-cream-200/70 hover:bg-ink-700/50 hover:text-cream-100'),
                !isPills && 'border-b-2 px-4 -mb-px',
                !isPills && (isActive
                  ? 'border-gold-500 text-gold-200'
                  : 'border-transparent text-cream-200/65 hover:text-cream-100'),
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="mt-5" role="tabpanel">
        {items.find((t) => t.id === active)?.content}
      </div>
    </div>
  );
}
