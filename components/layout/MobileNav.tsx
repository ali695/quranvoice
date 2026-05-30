'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { NAV_LINKS, QURAN_SIDEBAR_LINKS } from '@/lib/data/navLinks';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-0 top-0 flex h-full w-[88%] max-w-sm flex-col gap-6 overflow-y-auto border-r border-ink-600/60 bg-ink-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-cream-100 hover:bg-ink-800"
            aria-label="Close menu"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <Link
          href="/search"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl border border-ink-600 bg-ink-800 px-4 py-3 text-sm text-cream-200/80"
        >
          <Icon name="search" size={18} />
          Search the Quran…
        </Link>

        <div>
          <div className="px-3 pb-2 text-[11px] uppercase tracking-[0.18em] text-gold-400/80">
            Browse
          </div>
          <nav className="flex flex-col gap-1" aria-label="Mobile primary">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-cream-100 hover:bg-ink-800"
              >
                {item.label}
                <Icon name="chevron-right" size={16} className="text-cream-200/40" />
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <div className="px-3 pb-2 text-[11px] uppercase tracking-[0.18em] text-gold-400/80">
            My Quran
          </div>
          <nav className="flex flex-col gap-1" aria-label="My Quran">
            {QURAN_SIDEBAR_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream-200/85 hover:bg-ink-800"
              >
                <Icon name={item.icon} size={16} className="text-gold-400/70" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="divider-gold" />

        <div className="flex flex-col gap-2">
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-cream-200/80 hover:bg-ink-800"
          >
            <Icon name="settings" size={18} />
            Settings
          </Link>
          <Link
            href="/auth/sign-in"
            onClick={onClose}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-4 py-3 text-sm font-medium text-ink-950 hover:bg-gold-400"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
