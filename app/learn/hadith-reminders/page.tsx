import type { Metadata } from 'next';
import { LearningTopicShell } from '@/components/learn/LearningTopicShell';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/learn/hadith-reminders',
    title: 'Hadith Reminders — QuranVoice',
    description:
      'Hadith content shown only from verified collections, with full source labels.',
  });
}

export default function HadithRemindersPage() {
  return (
    <LearningTopicShell
      eyebrow="Learning Library"
      title="Hadith reminders, from verified collections"
      highlight="verified"
      description="QuranVoice will show hadith only from registered, verified hadith collections (e.g. the Sahihayn and the Sunan), with chain references and grading where available. We do not publish hadith content while no verified source is connected."
      sourceStatus="needs_source"
      sourceNote='Until a verified hadith source is registered, no hadith text is shown on QuranVoice. When a source is connected, every reminder will carry the collection name, book, hadith number, and authentication grading.'
      icon="feather"
      pattern="lines"
      related={[
        { href: '/learn/seerah', label: 'Seerah' },
        { href: '/learn/names-of-prophet-muhammad', label: 'Names of Prophet ﷺ' },
        { href: '/sources', label: 'Sources & attribution' },
      ]}
    />
  );
}
