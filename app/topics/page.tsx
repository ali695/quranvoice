import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { TOPICS } from '@/lib/data/home';

export const metadata: Metadata = {
  title: 'Topics',
  description: 'Explore ayahs grouped by theme. Topic indexes use registered, verified data.',
};

export default function TopicsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Themes"
        title="Quran Topics"
        description="A guided way to study the Quran by theme."
      />
      <AppShell>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t) => (
            <Card key={t.slug} as="li" variant="elevated">
              <Link href={`/topics/${t.slug}`} className="flex items-center gap-3 p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-300">
                  <Icon name="flag" size={16} />
                </span>
                <div className="flex-1">
                  <p className="font-display text-base text-cream-50">{t.label}</p>
                </div>
                <Icon name="chevron-right" size={14} className="text-cream-200/40" />
              </Link>
            </Card>
          ))}
        </ul>
      </AppShell>
    </>
  );
}
