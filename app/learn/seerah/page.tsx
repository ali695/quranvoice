import type { Metadata } from 'next';
import { LearningTopicShell } from '@/components/learn/LearningTopicShell';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/learn/seerah',
    title: 'Seerah — QuranVoice',
    description:
      'The life of the Prophet ﷺ. Activates when verified seerah sources are registered.',
  });
}

export default function SeerahPage() {
  return (
    <LearningTopicShell
      eyebrow="Learning Library"
      title="The life of the Prophet ﷺ, from verified sources"
      highlight="Prophet ﷺ"
      description="Seerah requires careful sourcing. QuranVoice will publish a structured seerah experience here once verified seerah sources (classical works and modern scholarly compendia) are registered in the resource registry."
      sourceStatus="needs_source"
      sourceNote='Acceptable sources for seerah include classical works (e.g. Ibn Hishām, At-Tabarī) and contemporary academically reviewed compendia, registered with full attribution and license status. QuranVoice will not paste seerah narrative into source code or generate it via AI.'
      icon="scroll"
      pattern="arabesque"
      readingSuggestions={[
        { verseKey: '33:40', label: 'The Seal of the Prophets — Quran 33:40' },
        { verseKey: '33:45', label: 'A witness, a bringer of glad tidings, a warner — 33:45' },
        { verseKey: '48:29', label: 'Muḥammad is the Messenger of Allah — 48:29' },
        { verseKey: '21:107', label: 'A mercy to all worlds — 21:107' },
      ]}
      related={[
        { href: '/learn/names-of-prophet-muhammad', label: 'Names of Prophet Muhammad ﷺ' },
        { href: '/learn/stories-of-the-prophets', label: 'Stories of the Prophets' },
        { href: '/learn/hadith-reminders', label: 'Hadith Reminders' },
      ]}
    />
  );
}
