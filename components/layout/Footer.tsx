import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { FOOTER_LINKS } from '@/lib/data/footerLinks';

const COLUMNS: { title: string; key: keyof typeof FOOTER_LINKS }[] = [
  { title: 'Navigate', key: 'navigate' },
  { title: 'Quran', key: 'quran' },
  { title: 'Study', key: 'study' },
  { title: 'Learn', key: 'learn' },
  { title: 'Tools', key: 'tools' },
  { title: 'Account & Support', key: 'account' },
  { title: 'Legal & Developers', key: 'legal' },
];

const SOCIAL = [
  { name: 'GitHub', href: '#', icon: 'github' as const },
  { name: 'Twitter', href: '#', icon: 'twitter' as const },
  { name: 'YouTube', href: '#', icon: 'youtube' as const },
  { name: 'Instagram', href: '#', icon: 'instagram' as const },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-ink-600/50 bg-ink-950">
      <div className="absolute inset-0 pattern-ornament opacity-30" aria-hidden="true" />
      <div className="relative">
        <div className="container-page py-16">
          {/* Top: brand + columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-12">
            {/* Brand column */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-4">
              <Logo size="md" />
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream-200/60">
                A modern Quran platform built to help Muslims read, listen, reflect,
                memorize, and stay connected with the Book of Allah.
              </p>
              <div className="mt-6 rounded-xl border border-ink-600/60 bg-ink-800/40 p-4">
                <p className="text-xs leading-relaxed text-cream-200/55">
                  <span className="font-medium text-gold-300/90">Disclaimer.</span>{' '}
                  Independent Quran learning platform. All Quran content must be
                  sourced from verified resources.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-ink-600 bg-ink-800/60 px-3 text-xs font-medium text-cream-100/80 hover:border-gold-500/40 hover:text-gold-300">
                  <Icon name="apple" size={14} />
                  App Store
                </button>
                <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-ink-600 bg-ink-800/60 px-3 text-xs font-medium text-cream-100/80 hover:border-gold-500/40 hover:text-gold-300">
                  <Icon name="android" size={14} />
                  Google Play
                </button>
              </div>
            </div>

            {/* Link columns */}
            {COLUMNS.map((col) => (
              <FooterColumn key={col.key} title={col.title} links={FOOTER_LINKS[col.key]} />
            ))}
          </div>

          {/* Divider */}
          <div className="divider-gold mt-16" />

          {/* Bottom row */}
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-cream-200/70">
                © {new Date().getFullYear()} QuranVoice. All rights reserved.
              </p>
              <p className="text-xs italic text-cream-200/45">
                Made to serve the Quran with care and respect.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Language selector */}
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-ink-600 bg-ink-800/60 px-3 text-xs text-cream-100/80 hover:border-gold-500/40"
              >
                <Icon name="globe" size={14} />
                English
                <Icon name="chevron-down" size={12} />
              </button>
              {/* Theme selector */}
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-ink-600 bg-ink-800/60 px-3 text-xs text-cream-100/80 hover:border-gold-500/40"
                aria-label="Theme: Dark"
              >
                <Icon name="moon" size={14} />
                Dark
              </button>
              {/* Socials */}
              <div className="flex items-center gap-1">
                {SOCIAL.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-600/60 bg-ink-800/40 text-cream-100/70 transition-colors hover:border-gold-500/40 hover:text-gold-300"
                  >
                    <Icon name={s.icon} size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterColumnProps {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="lg:col-span-2">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-gold-400/90">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-sm text-cream-200/65 transition-colors hover:text-gold-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
