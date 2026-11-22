import type { MetadataRoute } from 'next';
import { APP_BASE_URL, generateHreflangAlternates } from '@/lib/i18n/hreflang';
import { QURANIC_DUAS } from '@/lib/data/learning/quranicDuas';

/**
 * Canonical, indexable pages only (English, unprefixed).
 *
 * Deliberately excluded: personal/account pages, utilities with no indexable
 * copy, placeholders, the 604 mushaf page views, and URLs that redirect or
 * canonicalize elsewhere (/surahs → /quran, /reciters → /recitations,
 * /shan-e-nuzul, /learn/duas). Those send `noindex` or 301 — see
 * next.config.js. Keep this list in sync when a page gains real content.
 */
const INDEXABLE_PATHS: string[] = [
  '/',
  '/quran',
  '/juz',
  '/translations',
  '/tafsir',
  '/recitations',
  '/ayah-of-the-day',
  '/quran-in-a-year',
  '/study',
  '/word-by-word',
  '/asbab-al-nuzul',
  '/shan-e-nuzool',
  '/tools',
  '/tools/prayer-times',
  '/tools/qibla',
  '/tools/hijri-calendar',
  '/learn',
  '/learn/beginner-quran-guide',
  '/learn/tajweed-basics',
  '/learn/names-of-allah',
  '/learn/names-of-prophet-muhammad',
  '/learn/quranic-duas',
  '/learn/stories-of-the-prophets',
  '/learn/daily-reflection',
  '/learn/quran-vocabulary',
  '/learn/quran-themes',
  '/learn/hifz-and-revision',
  '/learn/seerah',
  '/learn/hadith-reminders',
  '/learn/ramadan',
  '/learn/hajj-and-umrah',
  '/learn/family-quran-learning',
  '/learn/islamic-manners',
  '/learn/prayer-and-worship',
  '/learn/tawheed-and-iman',
  '/mushaf',
  '/tajweed-quran',
  '/uthmani-quran',
  '/16-line-quran',
  '/about',
  '/contact',
  '/help',
  '/sources',
  '/sources/shan-e-nuzool',
  '/privacy',
  '/terms',
  '/disclaimer',
  '/copyright',
  '/accessibility',
  '/sitemap',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const surahPaths = Array.from({ length: 114 }, (_, i) => `/quran/${i + 1}`);
  const juzPaths = Array.from({ length: 30 }, (_, i) => `/juz/${i + 1}`);
  const duaPaths = QURANIC_DUAS.map((d) => `/learn/quranic-duas/${d.slug}`);

  return [...INDEXABLE_PATHS, ...surahPaths, ...juzPaths, ...duaPaths].map((path) => {
    const { languages } = generateHreflangAlternates(path);
    return {
      url: `${APP_BASE_URL}${path}`,
      changeFrequency: 'weekly' as const,
      priority: path === '/' ? 1 : path.startsWith('/quran/') ? 0.8 : 0.6,
      // Alternates appear only once a second locale is genuinely indexable.
      ...(Object.keys(languages).length ? { alternates: { languages } } : {}),
    };
  });
}
