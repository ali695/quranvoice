'use client';

import { useEffect, type ReactNode } from 'react';
import { Icon } from './Icon';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' };

export function Modal({ open, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
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
  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={`relative w-full ${sizes[size]} rounded-2xl border border-ink-600/70 bg-ink-850 shadow-card`}>
          <div className="flex items-start justify-between gap-4 border-b border-ink-700/60 px-6 py-4">
            <div>
              {title && <h2 className="font-display text-xl font-medium text-cream-50">{title}</h2>}
              {description && <p className="mt-1 text-sm text-cream-200/65">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-cream-100/80 hover:bg-ink-700/60"
              aria-label="Close"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-ink-700/60 px-6 py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
