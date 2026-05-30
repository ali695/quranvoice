'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { QURAN_SIDEBAR_LINKS } from '@/lib/data/navLinks';
import { cn } from '@/lib/utils/cn';

interface SidebarProps {
  /** Optional title for the sidebar header */
  title?: string;
}

export function Sidebar({ title = 'My Quran' }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] flex-col gap-1 overflow-y-auto py-6 lg:flex">
      <div className="px-3 pb-2 text-[11px] uppercase tracking-[0.18em] text-gold-400/80">
        {title}
      </div>
      <nav className="flex flex-col gap-0.5" aria-label="Quran sidebar">
        {QURAN_SIDEBAR_LINKS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-gold-500/10 text-gold-200'
                  : 'text-cream-200/75 hover:bg-ink-800/60 hover:text-cream-100',
              )}
            >
              <Icon name={item.icon} size={16} className={isActive ? 'text-gold-300' : 'text-gold-400/60'} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
