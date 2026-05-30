import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';
import { SourceBadge } from './SourceBadge';
import type { LearningCategory } from '@/lib/types/learning';

export function CategoryGrid({ categories }: { categories: LearningCategory[] }) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((c) => (
        <Card key={c.slug} as="li" variant="elevated" className="group">
          <Link href={c.href ?? `/learn/${c.slug}`} className="flex h-full flex-col gap-3 p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-300">
                <Icon name={(c.icon as IconName) ?? 'book'} size={18} />
              </span>
              <SourceBadge status={c.sourceStatus} />
            </div>
            <h3 className="font-display text-base font-medium text-cream-50 transition-colors group-hover:text-gold-200">
              {c.title}
            </h3>
            <p className="text-sm leading-relaxed text-cream-200/65">{c.description}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-gold-300">
              Open
              <Icon name="arrow-right" size={13} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </Card>
      ))}
    </ul>
  );
}
