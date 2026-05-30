import type { Metadata } from 'next';
import { LearningTopicShell } from '@/components/learn/LearningTopicShell';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/learn/tawheed-and-iman',
    title: 'Tawḥīd & Īmān — QuranVoice',
    description:
      'Reading the Quran on the foundation of faith. Pointers to the surahs and verses where Tawḥīd is most concentrated.',
  });
}

export default function TawheedIimanPage() {
  return (
    <LearningTopicShell
      eyebrow="Learning Library"
      title="Reading the Quran with the foundation of īmān"
      highlight="īmān"
      description="The opening surah, Ayat al-Kursī, the closing surahs — the Quran returns to the Oneness of Allah at every breath. This page lists the Quranic references most concentrated on Tawḥīd and īmān."
      sourceStatus="verified"
      sourceNote="Editorial reading guide. Detailed aqīdah formulations belong with a qualified teacher and a verified scholarly source — we do not generate them via AI."
      icon="sparkle"
      pattern="star"
      readingSuggestions={[
        { verseKey: '112:1', label: 'Surah Al-Ikhlāṣ — He is Allah, the One — 112:1' },
        { verseKey: '2:255', label: 'Āyat al-Kursī — 2:255' },
        { verseKey: '59:22', label: 'He is Allah; there is no god but He — 59:22' },
        { verseKey: '59:23', label: 'The Sovereign, the Holy — 59:23' },
        { verseKey: '59:24', label: 'The Creator, the Maker, the Fashioner — 59:24' },
        { verseKey: '24:35', label: "Light upon Light — 24:35" },
      ]}
      related={[
        { href: '/learn/names-of-allah', label: 'Names of Allah' },
        { href: '/learn/daily-reflection', label: 'Daily Reflection' },
        { href: '/learn/quranic-duas', label: 'Quranic duas' },
      ]}
    />
  );
}
