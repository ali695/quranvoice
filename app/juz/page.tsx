import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { JuzGrid } from '@/components/quran/JuzGrid';
import { JUZS } from '@/lib/data/juz';

export const metadata: Metadata = {
  title: 'Browse by Juz',
  description: 'Read the Quran by Juz (Para). All 30 sections of the mushaf.',
};

export default function JuzIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Mushaf"
        title="Browse by Juz"
        description="All 30 parts of the Quran in mushaf order."
      />
      <AppShell withSidebar>
        <JuzGrid juzs={JUZS} />
      </AppShell>
    </>
  );
}
