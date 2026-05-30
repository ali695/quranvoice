import type { LearningCategory } from '@/lib/types/learning';

/** Category cards shown on the /learn index. Order is intentional. */
export const LEARNING_CATEGORIES: LearningCategory[] = [
  { slug: 'beginner-quran-guide',     title: 'Quran Basics',                description: 'Mushaf structure, where to start, building the habit.', icon: 'book',     sourceStatus: 'verified',       pattern: 'star' },
  { slug: 'tajweed-basics',           title: 'Tajweed',                     description: 'Categories of Tajweed rules, taught with a teacher.', icon: 'sparkle',  sourceStatus: 'review_pending', pattern: 'circles' as 'arabesque' },
  { slug: 'names-of-allah',           title: 'Names of Allah',              description: 'Divine names with Quranic verse references.',          icon: 'sparkle',  sourceStatus: 'verified',       pattern: 'star' },
  { slug: 'names-of-prophet-muhammad',title: 'Names of Prophet Muhammad ﷺ', description: 'Quranic names and titles of the Prophet ﷺ.',         icon: 'feather',  sourceStatus: 'verified',       pattern: 'arabesque' },
  { slug: 'stories-of-the-prophets',  title: 'Stories of the Prophets',     description: 'Quran-source index of the Messengers.',                icon: 'scroll',   sourceStatus: 'verified',       pattern: 'arabesque' },
  { slug: 'quranic-duas',             title: 'Quranic Duas',                description: 'Supplications taught directly in the Quran.',          icon: 'note',     sourceStatus: 'verified',       pattern: 'star' },
  { slug: 'daily-reflection',         title: 'Daily Reflections',           description: 'A short daily Quran rhythm with private notes.',       icon: 'sparkle',  sourceStatus: 'verified',       pattern: 'lines' },
  { slug: 'quran-vocabulary',         title: 'Quran Vocabulary',            description: 'Frequent Quranic words — when verified data lands.',   icon: 'globe',    sourceStatus: 'needs_source',   pattern: 'lines' },
  { slug: 'quran-themes',             title: 'Quran Themes',                description: 'Reading the Quran by theme.',                          icon: 'flag',     sourceStatus: 'review_pending', pattern: 'star' },
  { slug: 'seerah',                   title: 'Seerah',                      description: 'The life of the Prophet ﷺ from verified sources.',    icon: 'scroll',   sourceStatus: 'needs_source',   pattern: 'arabesque' },
  { slug: 'hadith-reminders',         title: 'Hadith Reminders',            description: 'Hadith content shown only from verified collections.', icon: 'feather',  sourceStatus: 'needs_source',   pattern: 'lines' },
  { slug: 'ramadan',                  title: 'Ramadan',                     description: 'A reading rhythm and recap for the month of mercy.',   icon: 'crescent', sourceStatus: 'verified',       pattern: 'star' },
  { slug: 'hajj-and-umrah',           title: 'Hajj & Umrah',                description: 'A practical orientation to the rites.',                icon: 'mosque',   sourceStatus: 'verified',       pattern: 'arabesque' },
  { slug: 'hifz-and-revision',        title: 'Hifz & Revision',             description: 'Practical guidance for building a review habit.',      icon: 'brain',    sourceStatus: 'verified',       pattern: 'lines' },
  { slug: 'family-quran-learning',    title: 'Family & Children',           description: 'Reading the Quran together as a family.',              icon: 'heart',    sourceStatus: 'verified',       pattern: 'star' },
  { slug: 'islamic-manners',          title: 'Islamic Manners',             description: 'A reading-guide overview of adab in the Quran.',       icon: 'check',    sourceStatus: 'verified',       pattern: 'arabesque' },
  { slug: 'prayer-and-worship',       title: 'Prayer & Worship',            description: 'Quran-source orientation to the practices of worship.', icon: 'target',  sourceStatus: 'verified',       pattern: 'star' },
  { slug: 'tawheed-and-iman',         title: 'Tawḥīd & Īmān',               description: 'Reading the Quran on the foundation of faith.',        icon: 'sparkle',  sourceStatus: 'verified',       pattern: 'arabesque' },
];
