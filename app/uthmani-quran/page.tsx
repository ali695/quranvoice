import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { ScriptReader } from '@/components/quran/ScriptReader';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/uthmani-quran',
    titleKey: 'meta.uthmani.title',
    descriptionKey: 'meta.uthmani.description',
  });
}

export default function UthmaniPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mushaf · Uthmani script"
        title="Read the Uthmani Quran"
        description="The Uthmani script (rasm ʿUthmānī) rendered exactly as published by Quran.Foundation — never edited, never AI-generated. Choose any surah below, or open the full reader for translation, tafsir, and audio."
      />
      <AppShell>
        <ScriptReader
          type="uthmani"
          initialSurah={1}
          sourceNote="Source: Quran.Foundation · text_uthmani"
        />
      </AppShell>
    </>
  );
}
