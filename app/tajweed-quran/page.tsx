import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { TajweedReader } from '@/components/quran/TajweedReader';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/tajweed-quran',
    titleKey: 'meta.tajweed.title',
    descriptionKey: 'meta.tajweed.description',
  });
}

export default function TajweedPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tajweed Mushaf"
        title="Color-coded Tajweed Quran"
        description="Colour-coded Tajweed rules — madd, ghunnah, qalqalah, ikhfa, idgham and silent letters — on the verified Uthmani text. Colours come from published Tajweed data, never guessed."
      />
      <AppShell>
        <TajweedReader initialSurah={1} />
      </AppShell>
    </>
  );
}
