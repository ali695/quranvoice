import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { AyahOfTheDay } from '@/components/home/AyahOfTheDay';

export const metadata: Metadata = {
  title: 'Ayah of the Day',
  description: 'A daily verse from the Noble Quran to read, reflect on, and share.',
};

export default function AyahOfTheDayPage() {
  return (
    <>
      <PageHeader
        eyebrow="Daily Verse"
        title="Ayah of the Day"
        description="A daily verse from the Noble Quran. Verified source content is shown when connected."
      />
      <AppShell>
        <AyahOfTheDay />
      </AppShell>
    </>
  );
}
