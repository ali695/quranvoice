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
    </>
  );
}
