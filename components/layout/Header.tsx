'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { NAV_LINKS } from '@/lib/data/navLinks';
import { MobileNav } from './MobileNav';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={[
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'border-b border-ink-600/50 bg-ink-900/85 backdrop-blur-lg'
            : 'border-b border-transparent bg-ink-900/40 backdrop-blur-md',
        ].join(' ')}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 md:h-18">
          <button
            onClick={() => setMenuOpen(true)}
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-lg text-cream-100 hover:bg-ink-800 md:hidden"
            aria-label="Open menu"
          >
            <Icon name="menu" size={22} />
          </button>

          <Logo size="md" />

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-cream-200/80 transition-colors hover:bg-ink-800/70 hover:text-gold-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/search"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-cream-100/80 transition-colors hover:bg-ink-800/70 hover:text-gold-300"
              aria-label="Search"
            >
              <Icon name="search" size={18} />
            </Link>
            <button
              type="button"
              className="hidden h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm text-cream-100/80 transition-colors hover:bg-ink-800/70 hover:text-gold-300 sm:flex"
              aria-label="Select language"
            >
              <Icon name="globe" size={16} />
              <span className="text-xs font-medium">EN</span>
              <Icon name="chevron-down" size={14} />
            </button>
            <Link
              href="/settings"
              className="hidden h-10 w-10 items-center justify-center rounded-lg text-cream-100/80 transition-colors hover:bg-ink-800/70 hover:text-gold-300 sm:flex"
              aria-label="Settings"
            >
              <Icon name="settings" size={18} />
            </Link>
            <Link
              href="/auth/sign-in"
              className="ml-1 hidden h-10 items-center gap-2 rounded-lg border border-gold-500/30 bg-gold-500/5 px-4 text-sm font-medium text-gold-200 transition-all hover:border-gold-400/60 hover:bg-gold-500/10 hover:text-gold-100 md:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/auth/sign-in"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-lg border border-gold-500/30 bg-gold-500/5 text-gold-300 transition-colors hover:bg-gold-500/10 md:hidden"
              aria-label="Sign in"
            >
              <Icon name="user" size={18} />
            </Link>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
