import { Hero } from '@/components/home/Hero';
import { ResourceStats } from '@/components/home/ResourceStats';
import { QuickActions } from '@/components/home/QuickActions';
import { ContinueReading } from '@/components/home/ContinueReading';
import { AyahOfTheDay } from '@/components/home/AyahOfTheDay';
import { RecommendedForYou } from '@/components/home/RecommendedForYou';
import { PopularSurahs } from '@/components/home/PopularSurahs';
import { FeaturedRecitations } from '@/components/home/FeaturedRecitations';
import { StudyQuran } from '@/components/home/StudyQuran';
import { GoalsAndMemorization } from '@/components/home/GoalsAndMemorization';
import { QuranTools } from '@/components/home/QuranTools';
import { ExploreTopics } from '@/components/home/ExploreTopics';
import { LearningLibrary } from '@/components/home/LearningLibrary';
import { SurahDirectoryPreview } from '@/components/home/SurahDirectoryPreview';
import { FaqSection } from '@/components/seo/FaqSection';

const HOME_FAQ = [
  {
    question: 'Can I read the Quran online for free on QuranVoice?',
    answer:
      'Yes. QuranVoice is a free platform to read the Noble Quran online with verified Uthmani Arabic text, translations in many languages, tafsir, word-by-word breakdowns and recitations.',
  },
  {
    question: 'Can I listen to Quran recitation with word-by-word highlighting?',
    answer:
      'Yes. You can listen to Quran audio by ayah or by surah from verified reciters, and when recitation timing is available each word is highlighted as it is recited.',
  },
  {
    question: 'Which translations and tafsir are available?',
    answer:
      'Translations are available in many languages (including Urdu, Arabic, Indonesian, Turkish, French and more) from Quran.Foundation, and tafsir can be read per verse with a clear source label. QuranVoice never generates tafsir with AI.',
  },
  {
    question: 'Does QuranVoice support Tajweed and different Mushaf layouts?',
    answer:
      'Yes. There is a color-coded Tajweed Mushaf and a page-by-page Mushaf with real printed line layouts (15-line Madani and 16-line Indo-Pak), rendered from verified source data.',
  },
  {
    question: 'Is the Arabic Quran text authentic and unaltered?',
    answer:
      'Yes. The Arabic Quran text is served exactly as published from Quran.Foundation. The app interface language is separate from the Quran translation language.',
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <ResourceStats />
      <QuickActions />
      <ContinueReading />
      <AyahOfTheDay />
      <RecommendedForYou />
      <PopularSurahs />
      <FeaturedRecitations />
      <StudyQuran />
      <GoalsAndMemorization />
      <QuranTools />
      <ExploreTopics />
      <LearningLibrary />
      <SurahDirectoryPreview />
      <FaqSection items={HOME_FAQ} />
    </>
  );
}
