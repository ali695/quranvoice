import type { LearningArticle, Topic } from '@/lib/types/quran';
import type { Reciter } from '@/lib/types/audio';

// Re-export navigation & footer link maps from their dedicated modules
// so older imports keep working.
export { NAV_LINKS } from './navLinks';
export { FOOTER_LINKS } from './footerLinks';

export const SEARCH_EXAMPLES = [
  { label: 'Al-Fatihah', href: '/quran/1' },
  { label: 'Ayatul Kursi', href: '/quran/2/255' },
  { label: 'Surah Yaseen', href: '/quran/36' },
  { label: 'Patience', href: '/topics/patience' },
  { label: '2:255', href: '/quran/2/255' },
] as const;

export const QUICK_ACTIONS = [
  { id: 'read', label: 'Read Quran', href: '/quran', icon: 'book' as const },
  { id: 'listen', label: 'Listen', href: '/recitations', icon: 'play' as const },
  { id: 'tafsir', label: 'Tafsir', href: '/tafsir', icon: 'feather' as const },
  { id: 'translations', label: 'Translations', href: '/translations', icon: 'globe' as const },
  { id: 'wbw', label: 'Word by Word', href: '/quran?mode=wbw', icon: 'sparkle' as const },
  { id: 'memorize', label: 'Memorize', href: '/memorization', icon: 'brain' as const },
  { id: 'bookmarks', label: 'Bookmarks', href: '/bookmarks', icon: 'bookmark' as const },
  { id: 'notes', label: 'Notes', href: '/notes', icon: 'note' as const },
];

export const RECOMMENDATIONS = [
  {
    id: 'continue-last',
    title: 'Continue your last reading',
    description: 'Pick up where you left off in the mushaf.',
    cta: 'Continue',
    href: '/quran',
    icon: 'book' as const,
    status: 'No saved position yet',
  },
  {
    id: 'last-reciter',
    title: 'Listen to your last reciter',
    description: 'Resume your saved audio recitation.',
    cta: 'Resume audio',
    href: '/recitations',
    icon: 'play' as const,
    status: 'Choose a reciter to begin',
  },
  {
    id: 'saved',
    title: 'Review saved ayahs',
    description: 'Revisit verses you bookmarked for reflection.',
    cta: 'Open bookmarks',
    href: '/bookmarks',
    icon: 'bookmark' as const,
    status: '0 bookmarks',
  },
  {
    id: 'year-plan',
    title: "Today's Quran in a Year",
    description: 'Read a small portion daily to complete the Quran in one year.',
    cta: 'Open plan',
    href: '/goals',
    icon: 'calendar' as const,
    status: 'Plan not started',
  },
  {
    id: 'study-tafsir',
    title: 'Study tafsir of your last ayah',
    description: 'Open verified tafsir for your most recent verse.',
    cta: 'Study now',
    href: '/tafsir',
    icon: 'feather' as const,
    status: 'No recent ayah',
  },
  {
    id: 'memo-review',
    title: 'Memorization review',
    description: 'Practice the verses you are currently memorizing.',
    cta: 'Start review',
    href: '/memorization',
    icon: 'brain' as const,
    status: 'No active set',
  },
] as const;

/**
 * Reciter list — uses commonly known, public reciter names as a
 * structural placeholder. Avatars are CSS pattern blocks, never AI
 * portraits. Real audio URLs and licenses must come from a verified
 * source (e.g. EveryAyah, Quran.com API) before audio playback is wired.
 */
const HOME_RECITER_SOURCE = { name: 'AlQuran Cloud audio catalog', verified: false } as const;
export const RECITERS: Reciter[] = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', style: 'Murattal', hasSurahAudio: true, hasAyahAudio: true, source: HOME_RECITER_SOURCE },
  { id: 'ar.sudais', name: 'Abdul Rahman As-Sudais', style: 'Murattal', hasSurahAudio: true, hasAyahAudio: true, source: HOME_RECITER_SOURCE },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq Al-Minshawi', style: 'Mujawwad', hasSurahAudio: true, hasAyahAudio: true, source: HOME_RECITER_SOURCE },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', style: 'Murattal', hasSurahAudio: true, hasAyahAudio: true, source: HOME_RECITER_SOURCE },
  { id: 'ar.shuraim', name: 'Saud Al-Shuraim', style: 'Murattal', hasSurahAudio: true, hasAyahAudio: true, source: HOME_RECITER_SOURCE },
  { id: 'ar.ghamdi', name: 'Saad Al-Ghamdi', style: 'Murattal', hasSurahAudio: true, hasAyahAudio: true, source: HOME_RECITER_SOURCE },
];

export const TOPICS: Topic[] = [
  { slug: 'mercy', label: 'Mercy' },
  { slug: 'patience', label: 'Patience' },
  { slug: 'prayer', label: 'Prayer' },
  { slug: 'tawheed', label: 'Tawheed' },
  { slug: 'jannah', label: 'Jannah' },
  { slug: 'forgiveness', label: 'Forgiveness' },
  { slug: 'ramadan', label: 'Ramadan' },
  { slug: 'dhul-hijjah', label: 'Dhul-Hijjah' },
  { slug: 'family', label: 'Family' },
  { slug: 'charity', label: 'Charity' },
  { slug: 'prophets', label: 'Prophets' },
  { slug: 'sunnah', label: 'Sunnah' },
];

export const LEARNING_ARTICLES: LearningArticle[] = [
  {
    slug: 'beginner-quran-guide',
    category: 'Guide',
    title: 'Beginner Quran Guide',
    description: 'A gentle starting point for new readers — how the mushaf is structured and how to approach it.',
  },
  {
    slug: 'tajweed-basics',
    category: 'Recitation',
    title: 'Tajweed Basics',
    description: 'The core rules of melodic and accurate Quran recitation.',
  },
  {
    slug: 'names-of-allah',
    category: 'Aqeedah',
    title: 'The Names of Allah',
    description: 'Reflect on the meanings of Allah’s beautiful names from verified sources.',
  },
  {
    slug: 'stories-of-prophets',
    category: 'History',
    title: 'Stories of the Prophets',
    description: 'Narratives of the Messengers as preserved in the Quran.',
  },
  {
    slug: 'quranic-duas',
    category: 'Worship',
    title: 'Quranic Duas',
    description: 'Selected supplications mentioned in the Book of Allah.',
  },
  {
    slug: 'daily-reflection',
    category: 'Reflection',
    title: 'Daily Reflection',
    description: 'A short daily reading to keep your heart close to the Quran.',
  },
];

export const STUDY_FEATURES = [
  {
    title: 'Tafsir from verified books',
    description: 'Read classical and contemporary tafsir from authenticated published works.',
    icon: 'feather' as const,
  },
  {
    title: 'Word by word Quran',
    description: 'Understand each Arabic word with grammar and root analysis.',
    icon: 'sparkle' as const,
  },
  {
    title: 'Multiple translations',
    description: 'Compare translations side by side across languages and scholars.',
    icon: 'globe' as const,
  },
  {
    title: 'Shan-e-Nuzul / Asbab al-Nuzul',
    description: 'Context of revelation, displayed when a verified source is available.',
    icon: 'scroll' as const,
  },
  {
    title: 'Personal notes',
    description: 'Add private reflections to ayahs and review them anytime.',
    icon: 'note' as const,
  },
  {
    title: 'Bookmark collections',
    description: 'Organize meaningful ayahs into named collections.',
    icon: 'bookmark' as const,
  },
];

export const QURAN_TOOLS = [
  { id: 'prayer-times', label: 'Prayer Times', href: '/tools/prayer-times', icon: 'clock' as const },
  { id: 'qibla', label: 'Qibla Direction', href: '/tools/qibla', icon: 'compass' as const },
  { id: 'hijri', label: 'Hijri Calendar', href: '/tools/hijri-calendar', icon: 'calendar' as const },
  { id: 'reading-tracker', label: 'Reading Tracker', href: '/goals', icon: 'chart' as const },
  { id: 'memo-tracker', label: 'Memorization Tracker', href: '/memorization', icon: 'brain' as const },
  { id: 'collections', label: 'Saved Collections', href: '/bookmarks', icon: 'bookmark' as const },
  { id: 'share', label: 'Share Ayah', href: '/quran', icon: 'share' as const },
  { id: 'settings', label: 'Settings', href: '/settings', icon: 'settings' as const },
];

/**
 * Ayah of the Day — placeholder reference only.
 * NOTE: Arabic, translation, and tafsir MUST come from a verified
 * Quran API (e.g. quran.com, AlQuran Cloud) before being shown to
 * users. Until then, the UI displays a clearly marked unavailable state.
 */
export const AYAH_OF_THE_DAY_REF = {
  surah: 'Al-Baqarah',
  surahNumber: 2,
  ayahNumber: 255,
  reference: '2:255',
  // arabic, translation, tafsir intentionally omitted —
  // see the AyahOfTheDay component for the unavailable state.
} as const;

// NAV_LINKS and FOOTER_LINKS are re-exported above from
// './navLinks' and './footerLinks' respectively.
