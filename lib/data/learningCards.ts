import type { LearningArticle } from '@/lib/types/quran';

/**
 * Learning library entries.
 *
 * These articles are produced by QuranVoice as *editorial guides* to
 * studying the Quran. They contain general orientation and study
 * strategies — they do not contain Quran translations, tafsir, or
 * other content that requires a verified religious source.
 */
export const LEARNING_ARTICLES: LearningArticle[] = [
  {
    slug: 'beginner-quran-guide',
    category: 'Guide',
    title: 'Beginner Quran Guide',
    description: 'A gentle starting point: mushaf structure, surah order, and how to begin reading.',
  },
  {
    slug: 'tajweed-basics',
    category: 'Recitation',
    title: 'Tajweed Basics',
    description: 'An overview of the core rules of melodic and accurate Quran recitation.',
  },
  {
    slug: 'names-of-allah',
    category: 'Aqeedah',
    title: 'The Names of Allah',
    description: 'A study companion for the beautiful names mentioned in the Quran.',
  },
  {
    slug: 'stories-of-the-prophets',
    category: 'History',
    title: 'Stories of the Prophets',
    description: 'A reading guide to the narratives of the Messengers as preserved in the Quran.',
  },
  {
    slug: 'duas',
    category: 'Worship',
    title: 'Quranic Duas',
    description: 'How to study selected supplications mentioned in the Book of Allah.',
  },
  {
    slug: 'daily-reflection',
    category: 'Reflection',
    title: 'Daily Reflection',
    description: 'A short daily reading habit to keep your heart close to the Quran.',
  },
  {
    slug: 'articles',
    category: 'Library',
    title: 'Islamic Articles',
    description: 'Editorial pieces on Quranic themes, reading practices, and study tools.',
  },
];

export const LEARNING_ARTICLES_BY_SLUG = Object.fromEntries(
  LEARNING_ARTICLES.map((a) => [a.slug, a]),
);
