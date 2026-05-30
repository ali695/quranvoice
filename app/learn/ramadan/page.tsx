import type { Metadata } from 'next';
import { LearningTopicShell } from '@/components/learn/LearningTopicShell';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/learn/ramadan',
    title: 'Ramadan — QuranVoice',
    description:
      'A reading rhythm and recap for the month the Quran was revealed.',
  });
}

export default function RamadanPage() {
  return (
    <LearningTopicShell
      eyebrow="Learning Library"
      title="Ramadan — the month of the Quran"
      highlight="Quran"
      description="The Quran itself describes Ramadan as the month in which it was revealed (Quran 2:185). QuranVoice's Ramadan companion is an editorial reading rhythm — set a daily reading goal, listen with your favorite reciter, and reflect on a verified daily ayah."
      sourceStatus="verified"
      sourceNote="Editorial reading guidance only. The Quran text shown anywhere in the app comes from the verified provider registered on /sources — never paraphrased or auto-generated."
      icon="crescent"
      pattern="star"
      readingSuggestions={[
        { verseKey: '2:183', label: "Fasting is prescribed for you — 2:183" },
        { verseKey: '2:185', label: 'The month of Ramadan in which the Quran was revealed — 2:185' },
        { verseKey: '97:1', label: 'Surah Al-Qadr — the night of decree' },
        { verseKey: '2:186', label: "I am near, answering the call of the supplicant — 2:186" },
      ]}
      related={[
        { href: '/goals', label: 'Set a daily reading goal' },
        { href: '/quran-in-a-year', label: 'Quran in a Year plan' },
        { href: '/learn/quranic-duas', label: 'Quranic duas' },
      ]}
    />
  );
}
