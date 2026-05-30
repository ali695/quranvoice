import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withWordmark?: boolean;
  href?: string;
}

const sizes = {
  sm: { icon: 28, text: 'text-lg' },
  md: { icon: 34, text: 'text-xl' },
  lg: { icon: 44, text: 'text-2xl' },
};

export function Logo({ size = 'md', withWordmark = true, href = '/' }: LogoProps) {
  const s = sizes[size];

  const mark = (
    <span className="flex items-center gap-2.5">
      <span
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 text-ink-950 shadow-[0_4px_16px_-4px_rgba(212,165,116,0.5)]"
        style={{ width: s.icon, height: s.icon }}
        aria-hidden="true"
      >
        <svg
          width={s.icon * 0.62}
          height={s.icon * 0.62}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Open book mark with crescent arch */}
          <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H12v18H5.5A2.5 2.5 0 0 1 3 18.5v-13z" />
          <path d="M21 5.5A2.5 2.5 0 0 0 18.5 3H12v18h6.5a2.5 2.5 0 0 0 2.5-2.5v-13z" />
          <path d="M8 8.5h1.5M8 11.5h2" strokeWidth="1.5" />
          <path d="M16 8.5h-1.5M16 11.5h-2" strokeWidth="1.5" />
        </svg>
      </span>
      {withWordmark && (
        <span className={`${s.text} font-display font-semibold leading-none tracking-tight text-cream-50`}>
          Quran<span className="text-gold-400">Voice</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
        aria-label="QuranVoice — home"
      >
        {mark}
      </Link>
    );
  }
  return mark;
}
