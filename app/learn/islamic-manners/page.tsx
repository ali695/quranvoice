import type { Metadata } from 'next';
import { LearningTopicShell } from '@/components/learn/LearningTopicShell';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/learn/islamic-manners',
    title: 'Islamic Manners — QuranVoice',
    description:
      'A reading-guide overview of adab in the Quran. Pair with verified scholarship for fiqh details.',
  });
}

export default function IslamicMannersPage() {
  return (
    <LearningTopicShell
      eyebrow="Learning Library"
      title="Islamic manners — adab in the Quran"
      highlight="adab"
      description="The Quran returns to manners again and again — in speech, in greeting, at meals, with parents, with neighbors, with the orphan, with the traveler. QuranVoice points you at the Quranic references; the detailed rulings belong with a verified scholar."
      sourceStatus="verified"
      sourceNote="Editorial reading guide. We do not generate fiqh rulings via AI — for rulings, please consult a qualified teacher or a registered scholarly source."
      icon="check"
      pattern="arabesque"
      readingSuggestions={[
        { verseKey: '49:11', label: "Do not mock one another — 49:11" },
        { verseKey: '49:12', label: 'Avoid suspicion and backbiting — 49:12' },
        { verseKey: '24:27', label: 'Asking permission to enter homes — 24:27' },
        { verseKey: '17:23', label: 'Excellence toward parents — 17:23' },
        { verseKey: '25:63', label: "When the ignorant address them, they say 'Peace' — 25:63" },
        { verseKey: '2:83', label: 'Speak well to people — 2:83' },
      ]}
      related={[
        { href: '/learn/family-quran-learning', label: 'Family Quran Learning' },
        { href: '/learn/prayer-and-worship', label: 'Prayer & Worship' },
        { href: '/learn/quran-themes', label: 'Quran Themes' },
      ]}
    />
  );
}
