import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { LEARNING_ARTICLES } from '@/lib/data/learningCards';

export const metadata: Metadata = {
  title: 'Learning Library',
  description: 'Editorial guides and reflections to deepen your relationship with the Quran.',
};

export default function LearnIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="Learning Library"
        description="Editorial reading guides. Religious content inside articles uses only registered sources."
      />
      <AppShell>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LEARNING_ARTICLES.map((a) => (
            <Card key={a.slug} as="li" variant="elevated">
              <Link href={`/learn/${a.slug}`} className="flex h-full flex-col gap-3 p-5">
                <span className="inline-flex w-fit items-center gap-1 rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-gold-300">
                  {a.category}
                </span>
                <h3 className="font-display text-lg text-cream-50">{a.title}</h3>
                <p className="text-sm leading-relaxed text-cream-200/65">{a.description}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-gold-300">
                  Read
                  <Icon name="arrow-right" size={14} />
                </span>
              </Link>
            </Card>
          ))}
        </ul>
      </AppShell>
    </>
  );
}
