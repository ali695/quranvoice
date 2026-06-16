import type { Metadata } from 'next';
import { LineLayoutLanding } from '@/components/quran/LineLayoutLanding';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/12-line-quran',
    titleKey: 'meta.12line.title',
    descriptionKey: 'meta.mushaf.description',
  });
}

export default function TwelveLinePage() {
  return (
    <LineLayoutLanding
      lines={12}
      title="12-line Mushaf layout"
      intro="The 12-line Mushaf is a balanced print layout — denser than large-print editions but more open than the standard 15 and 16-line mushafs. Below you can read a verified, page-accurate Mushaf from Quran.Foundation with real printed line breaks."
      facts={[
        {
          icon: 'book',
          title: 'What it is',
          body: 'A page layout with twelve lines of Quran text per page — a middle ground between large-print and the dense 15 and 16-line standards.',
        },
        {
          icon: 'feather',
          title: 'Who uses it',
          body: 'Chosen by readers who want a comfortable line rhythm with fewer page turns than an 8-line print.',
        },
        {
          icon: 'check',
          title: 'No faked breaks',
          body: 'Exact line positions only ever come from a verified dataset. We never approximate where a printed line ends.',
        },
      ]}
    />
  );
}
