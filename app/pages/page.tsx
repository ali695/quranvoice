import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageNavigator } from '@/components/quran/PageNavigator';

export const metadata: Metadata = {
  title: 'Browse by Page',
  description: 'Browse the Quran by mushaf page. 604 pages in the standard mushaf.',
};

export default function PagesIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Mushaf"
        title="Browse by Page"
        description="Open any of the 604 pages in the standard mushaf."
      />
      <AppShell withSidebar>
        <PageNavigator />
      </AppShell>
    </>
  );
}
