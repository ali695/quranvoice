import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { QUICK_ACTIONS } from '@/lib/data/home';

export function QuickActions() {
  return (
    <section className="container-page py-12 md:py-16" aria-label="Quick actions">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {QUICK_ACTIONS.map((a) => (
          <li key={a.id}>
            <Link
              href={a.href}
              className="group flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-ink-600/50 bg-ink-800/40 p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/40 hover:bg-ink-750/70 hover:shadow-card"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-700/60 text-gold-300 transition-colors group-hover:bg-gold-500/15 group-hover:text-gold-200">
                <Icon name={a.icon} size={20} />
              </span>
              <span className="text-sm font-medium text-cream-100/90">
                {a.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
