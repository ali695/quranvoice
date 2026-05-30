import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { UnavailableState } from '@/components/ui/ErrorState';

export const metadata: Metadata = {
  title: 'Shan-e-Nuzul',
  description: 'Companion to Asbab al-Nuzul — verified narrated context of revelation.',
};

export default function ShanENuzulPage() {
  return (
    <>
      <PageHeader
        eyebrow="Study"
        title="Shan-e-Nuzul"
        description="The South Asian companion tradition to Asbab al-Nuzul, shown when verified."
      />
      <AppShell>
        <UnavailableState
          title="No verified Shan-e-Nuzul entries registered"
          description="Entries will appear here when registered in the Resource Registry from a verified book."
        />
      </AppShell>
    </>
  );
}
