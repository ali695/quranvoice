import type { Metadata } from 'next';
import { LearningTopicShell } from '@/components/learn/LearningTopicShell';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/learn/hajj-and-umrah',
    title: 'Hajj & Umrah — QuranVoice',
    description:
      'A reading-guide orientation to the rites of Hajj and Umrah. Detailed rulings require a qualified teacher.',
  });
}

export default function HajjUmrahPage() {
  return (
    <LearningTopicShell
      eyebrow="Learning Library"
      title="Hajj and Umrah — the pilgrimage in the Quran"
      highlight="pilgrimage"
      description="The Quran narrates the call to pilgrimage and the rites in several places. QuranVoice provides a reading-guide orientation — the procedural fiqh of the rites belongs with a qualified teacher and a verified manual."
      sourceStatus="verified"
      sourceNote='This is an editorial reading guide pointing into the verified Quranic references. Detailed rulings on the manāsik (rites) require a verified manual; we do not generate ruling content via AI.'
      icon="mosque"
      pattern="arabesque"
      readingSuggestions={[
        { verseKey: '2:125', label: "We made the House a place of return — 2:125" },
        { verseKey: '2:158', label: 'Ṣafā and Marwa are among the symbols of Allah — 2:158' },
        { verseKey: '2:196', label: 'Complete the Hajj and the ʿUmrah for Allah — 2:196' },
        { verseKey: '3:97', label: 'Pilgrimage to the House is a duty owed to Allah — 3:97' },
        { verseKey: '22:27', label: 'Proclaim the pilgrimage to people — 22:27' },
      ]}
      related={[
        { href: '/tools/qibla', label: 'Qibla Direction' },
        { href: '/tools/hijri-calendar', label: 'Hijri Calendar' },
        { href: '/learn/ramadan', label: 'Ramadan' },
      ]}
    />
  );
}
