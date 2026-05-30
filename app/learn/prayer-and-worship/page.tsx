import type { Metadata } from 'next';
import { LearningTopicShell } from '@/components/learn/LearningTopicShell';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/learn/prayer-and-worship',
    title: 'Prayer & Worship — QuranVoice',
    description:
      'Quran-source orientation to the practices of worship. Fiqh details require a qualified teacher.',
  });
}

export default function PrayerWorshipPage() {
  return (
    <LearningTopicShell
      eyebrow="Learning Library"
      title="Prayer and worship in the Quran"
      highlight="Quran"
      description="The Quran commands prayer, fasting, charity, and remembrance — and frames each one with meaning. This page points you at the Quranic references; the procedural fiqh belongs with a qualified teacher and a verified manual."
      sourceStatus="verified"
      sourceNote="Editorial reading guide. We do not generate fiqh of worship via AI. For procedural rulings (how to perform wudu, prayer postures, etc.), follow a qualified teacher in your tradition."
      icon="target"
      pattern="star"
      readingSuggestions={[
        { verseKey: '1:5', label: "You alone we worship — 1:5" },
        { verseKey: '2:43', label: 'Establish the prayer and give zakat — 2:43' },
        { verseKey: '29:45', label: 'Prayer restrains from indecency and wrongdoing — 29:45' },
        { verseKey: '20:14', label: 'Establish the prayer to remember Me — 20:14' },
        { verseKey: '2:152', label: 'Remember Me — I will remember you — 2:152' },
      ]}
      related={[
        { href: '/tools/prayer-times', label: 'Prayer Times tool' },
        { href: '/tools/qibla', label: 'Qibla Direction' },
        { href: '/learn/quranic-duas', label: 'Quranic duas' },
      ]}
    />
  );
}
