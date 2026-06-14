import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { MushafReader } from '@/components/quran/MushafReader';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/16-line-quran',
    titleKey: 'meta.16line.title',
    descriptionKey: 'meta.mushaf.description',
  });
}

export default function SixteenLinePage() {
  return (
    <>
      <PageHeader
        eyebrow="Mushaf · Page by page"
        title="16-line Indo-Pak Mushaf"
        description="The classic Indo-Pak page layout, rendered with real printed-line data from Quran.Foundation — no approximated line breaks. Switch to the 15-line Madani Mushaf any time."
      />
      <AppShell>
        <MushafReader initialPage={1} defaultLayout="16-line" />
      </AppShell>
    </>
  );
}
