import type { Metadata } from 'next';
import { LineLayoutLanding } from '@/components/quran/LineLayoutLanding';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/8-line-quran',
    titleKey: 'meta.8line.title',
    descriptionKey: 'meta.mushaf.description',
  });
}

export default function EightLinePage() {
  return (
    <LineLayoutLanding
      lines={8}
      title="8-line Mushaf layout"
      intro="The 8-line Mushaf is a spacious print layout with just eight lines per page, favoured by beginners and for large-print reading. Below you can read a verified, page-accurate Mushaf from Quran.Foundation with real printed line breaks."
      facts={[
        {
          icon: 'book',
          title: 'What it is',
          body: 'A page layout with eight lines of Quran text per page — larger script and more whitespace than the dense 15 and 16-line prints.',
        },
        {
          icon: 'feather',
          title: 'Who uses it',
          body: 'Common in large-print and beginner mushafs where clarity matters more than fitting the whole Quran into 604 pages.',
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
