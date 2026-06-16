import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import type { Reciter } from '@/lib/types/audio';

interface ReciterCardProps {
  reciter: Reciter;
  index?: number;
}

/**
 * Geometric initials avatar — never a real photo of a reciter.
 */
function ReciterAvatar({ name, seed = 0 }: { name: string; seed?: number }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const rotate = (seed * 41) % 360;
  return (
    <div
      className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gold-500/30 bg-ink-900"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: `conic-gradient(from ${rotate}deg, rgba(212,165,116,0.35), rgba(212,165,116,0.05), rgba(212,165,116,0.35))`,
        }}
      />
      <span className="relative font-display text-sm font-semibold text-gold-200">
        {initials}
      </span>
    </div>
  );
}

export function ReciterCard({ reciter, index = 0 }: ReciterCardProps) {
  return (
    <Card variant="elevated" className="flex items-center gap-4 p-4">
      <ReciterAvatar name={reciter.name} seed={index + 1} />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-cream-50">{reciter.name}</h3>
        {reciter.arabicName && (
          <p className="arabic text-xs text-cream-200/65" dir="rtl" lang="ar">
            {reciter.arabicName}
          </p>
        )}
        <p className="mt-1 text-xs text-cream-200/55">
          {reciter.style ?? 'Recitation'}
          {reciter.source.verified && (
            <>
              {' · '}
              <span className="text-gold-300/80">Verified source</span>
            </>
          )}
        </p>
        <div className="mt-3">
          <Link
            href={`/reciters/${reciter.id}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-gold-300/90 hover:text-gold-200"
          >
            View profile
            <Icon name="arrow-right" size={12} />
          </Link>
        </div>
      </div>
    </Card>
  );
}

export { ReciterAvatar };
