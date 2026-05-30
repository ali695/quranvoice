import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { SourceBadge } from './SourceBadge';
import type { LearningPath } from '@/lib/types/learning';

const LEVEL_LABEL: Record<LearningPath['level'], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export function LearningPathCard({ path }: { path: LearningPath }) {
  const enabled = path.sourceStatus === 'verified';
  const href = enabled ? `/learn/${path.itemSlugs[0] ?? 'beginner-quran-guide'}` : '/sources';
  return (
    <Card variant="elevated" className="group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/8] overflow-hidden bg-gradient-to-br from-ink-800 via-ink-850 to-ink-900">
        <div className="absolute inset-0 pattern-ornament opacity-40" aria-hidden="true" />
        <svg viewBox="0 0 200 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <g fill="none" stroke="rgba(212,165,116,0.5)" strokeWidth="0.7">
            <circle cx="100" cy="50" r="42" />
            <circle cx="100" cy="50" r="30" />
            <circle cx="100" cy="50" r="18" />
            <path d="M58 50 L142 50 M100 8 L100 92 M70 20 L130 80 M130 20 L70 80" />
          </g>
        </svg>
        <span className="absolute left-4 top-4">
          <SourceBadge status={path.sourceStatus} />
        </span>
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-ink-600/70 bg-ink-900/80 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-cream-200/75 backdrop-blur">
          {LEVEL_LABEL[path.level]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-medium text-cream-50 transition-colors group-hover:text-gold-200">
          {path.title}
        </h3>
        <p className="text-sm leading-relaxed text-cream-200/65">{path.description}</p>
        <ul className="mt-1 flex flex-wrap gap-3 text-xs text-cream-200/55">
          <li className="inline-flex items-center gap-1">
            <Icon name="book" size={11} className="text-gold-400" />
            {path.lessonCount || '—'} lessons
          </li>
          <li className="inline-flex items-center gap-1">
            <Icon name="clock" size={11} className="text-gold-400" />
            {path.estimatedMinutes || '—'} min
          </li>
        </ul>
        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-gold-300 hover:text-gold-200"
        >
          {enabled ? 'Start path' : 'Why this is locked'}
          <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </Card>
  );
}
