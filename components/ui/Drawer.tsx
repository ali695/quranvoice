'use client';

import { useEffect, type ReactNode } from 'react';
import { Icon } from './Icon';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  side?: 'left' | 'right' | 'bottom';
  children: ReactNode;
  width?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  side = 'right',
  children,
  width = '420px',
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const panelClasses =
    side === 'left'
      ? 'left-0 top-0 h-full'
      : side === 'right'
        ? 'right-0 top-0 h-full'
        : 'bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl';

  const sizeStyle =
    side === 'bottom'
      ? { width: '100%' }
      : { width: `min(${width}, 92vw)` };

  return (
    <div className="fixed inset-0 z-[75]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={onClose} />
      <aside
        className={`absolute ${panelClasses} flex flex-col border-ink-600/70 bg-ink-900 shadow-2xl ${
          side === 'left' ? 'border-r' : side === 'right' ? 'border-l' : 'border-t'
        }`}
        style={sizeStyle}
      >
        <header className="flex items-start justify-between gap-4 border-b border-ink-700/60 px-5 py-4">
          <div>
            {title && <h2 className="font-display text-lg font-medium text-cream-50">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-cream-200/65">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-cream-100/80 hover:bg-ink-700/60"
            aria-label="Close"
          >
            <Icon name="close" size={18} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </aside>
    </div>
  );
}
