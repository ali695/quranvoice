import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { QURAN_TOOLS } from '@/lib/data/home';

export function QuranTools() {
  return (
    <section className="container-page py-12 md:py-16">
      <SectionHeader
        eyebrow="Tools"
        title="Quran Tools"
        description="Utilities to support your reading, learning, and worship."
      />

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {QURAN_TOOLS.map((t) => (
          <li key={t.id}>
            <Link
              href={t.href}
              className="group flex h-full items-center gap-4 rounded-2xl border border-ink-600/50 bg-ink-800/50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/40 hover:bg-ink-750/80 hover:shadow-card"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-700/60 text-gold-300 transition-colors group-hover:bg-gold-500/15">
                <Icon name={t.icon} size={18} />
              </span>
              <span className="flex-1 text-sm font-medium text-cream-100/90">
                {t.label}
              </span>
              <Icon
                name="arrow-right"
                size={14}
                className="text-cream-200/40 transition-transform group-hover:translate-x-0.5 group-hover:text-gold-300"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
