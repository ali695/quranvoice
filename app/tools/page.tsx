import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { QURAN_TOOLS } from '@/lib/data/home';

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Prayer times, Qibla, Hijri calendar, and Quran study tools.',
};

export default function ToolsIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Tools"
        title="Quran & Worship Tools"
        description="Utilities to support your reading, learning, and worship."
      />
      <AppShell>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QURAN_TOOLS.map((t) => (
            <Card key={t.id} as="li" variant="elevated">
              <Link href={t.href} className="flex items-center gap-4 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-300">
                  <Icon name={t.icon} size={18} />
                </span>
                <p className="flex-1 font-display text-base text-cream-50">{t.label}</p>
                <Icon name="chevron-right" size={14} className="text-cream-200/40" />
              </Link>
            </Card>
          ))}
        </ul>
      </AppShell>
    </>
  );
}
