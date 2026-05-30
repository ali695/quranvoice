import type { Metadata } from 'next';
import { LearningTopicShell } from '@/components/learn/LearningTopicShell';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/learn/family-quran-learning',
    title: 'Family Quran Learning — QuranVoice',
    description:
      'Reading the Quran together as a family — gentle rhythm, age-aware suggestions, shared reflection.',
  });
}

export default function FamilyLearningPage() {
  return (
    <LearningTopicShell
      eyebrow="Learning Library"
      title="Reading the Quran together, as a family"
      highlight="together"
      description="A practical guide for building a shared Quran rhythm at home. Read a short surah after a meal, talk about one ayah a day at bedtime, take turns playing a reciter. The Quran becomes a shared family vocabulary."
      sourceStatus="verified"
      sourceNote="Editorial guidance from QuranVoice. Religious teaching for children should be paired with a qualified teacher in your tradition."
      icon="heart"
      pattern="star"
      readingSuggestions={[
        { verseKey: '25:74', label: 'Coolness of our eyes from our spouses and children — 25:74' },
        { verseKey: '46:15', label: 'Gratitude for parents — 46:15' },
        { verseKey: '31:13', label: "Luqmān's counsel to his son — 31:13" },
        { verseKey: '17:23', label: 'Excellence toward parents — 17:23' },
      ]}
      related={[
        { href: '/learn/quranic-duas', label: 'Quranic duas (family-friendly)' },
        { href: '/quran/55', label: 'Surah Ar-Rahmān — read together' },
        { href: '/learn/daily-reflection', label: 'Daily Reflection' },
      ]}
    />
  );
}
