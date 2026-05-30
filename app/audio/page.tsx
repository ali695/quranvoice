import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { AudioQueue } from '@/components/audio/AudioQueue';

export const metadata: Metadata = {
  title: 'Audio Quran',
  description: 'Continue listening, recent recitations, and audio controls.',
};

export default function AudioPage() {
  return (
    <>
      <PageHeader
        eyebrow="Audio"
        title="Audio Quran"
        description="Recently played recitations on this device."
      />
      <AppShell>
        <AudioQueue />
      </AppShell>
    </>
  );
}
