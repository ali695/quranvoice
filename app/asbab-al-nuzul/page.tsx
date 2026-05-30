import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { UnavailableState } from '@/components/ui/ErrorState';
import { listAsbabEntries } from '@/lib/services/asbabService';

export const metadata: Metadata = {
  title: 'Asbab al-Nuzul',
  description: 'Context of revelation entries from verified, license-checked sources.',
};

export default async function AsbabPage() {
  const entries = await listAsbabEntries();
  return (
    <>
      <PageHeader
        eyebrow="Study"
        title="Asbab al-Nuzul"
        description="Reported context of revelation for specific ayahs."
      />
      <AppShell>
        {entries.length === 0 ? (
          <UnavailableState
            title="No verified Asbab data registered yet"
            description="Asbab al-Nuzul entries are only displayed when sourced from a registered, verified book. We do not infer or generate context of revelation."
          />
        ) : (
          <ul className="flex flex-col gap-4">{/* Real entries render here when registered */}</ul>
        )}
      </AppShell>
    </>
  );
}
