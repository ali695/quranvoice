import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { UnavailableState } from '@/components/ui/ErrorState';

export const metadata: Metadata = {
  title: 'Word by Word',
  description: 'Word-by-word Quran with grammar and meaning, from verified datasets.',
};

export default function WordByWordPage() {
  return (
    <>
      <PageHeader
        eyebrow="Study"
        title="Word by Word"
        description="Per-word grammar and meaning will appear here when a verified dataset is registered."
      />
      <AppShell>
        <UnavailableState
          title="Word-by-word data not connected yet"
          description="QuranVoice will only display word-by-word analysis from a verified, license-checked source. Once such a dataset is registered in the Resource Registry, it will appear inside every ayah card."
        />
      </AppShell>
    </>
  );
}
