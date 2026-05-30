import type { MetadataRoute } from 'next';
import { APP_BASE_URL } from '@/lib/i18n/hreflang';
import { getLocalizedPath } from '@/lib/i18n/config';
import { DEFAULT_LOCALE, LOCALES, type LocaleCode } from '@/lib/i18n/locales';

/**
 * Pages safe to index, in their canonical (un-prefixed) form.
 * Each gets one sitemap entry per locale, with `alternates.languages`
 * so search engines can serve the right language to the right user.
 */
const INDEXABLE_PATHS: string[] = [
  '/',
  '/quran',
  '/surahs',
  '/juz',
  '/pages',
  '/search',
  '/topics',
  '/translations',
  '/tafsir',
  '/recitations',
  '/reciters',
  '/audio',
  '/ayah-of-the-day',
  '/quran-in-a-year',
  '/study',
  '/word-by-word',
  '/asbab-al-nuzul',
  '/shan-e-nuzul',
  '/shan-e-nuzool',
  '/memorization',
  '/memorization/review',
  '/collections',
  '/bookmarks',
  '/notes',
  '/goals',
  '/progress',
  '/tools',
  '/tools/prayer-times',
  '/tools/qibla',
  '/tools/hijri-calendar',
  '/tools/reading-tracker',
  '/tools/memorization-tracker',
  '/tools/share-ayah',
  '/learn',
  '/learn/beginner-quran-guide',
  '/learn/tajweed-basics',
  '/learn/names-of-allah',
  '/learn/duas',
  '/learn/stories-of-the-prophets',
  '/learn/daily-reflection',
  '/learn/articles',
  '/profile',
  '/settings',
  '/auth/sign-in',
  '/auth/sign-up',
  '/about',
  '/contact',
  '/help',
  '/feedback',
  '/developers',
  '/api-docs',
  '/privacy',
  '/terms',
  '/disclaimer',
  '/copyright',
  '/accessibility',
  '/sitemap',
  '/sources',
  '/sources/shan-e-nuzool',
  '/mushaf',
  '/tajweed-quran',
  '/uthmani-quran',
  '/8-line-quran',
  '/12-line-quran',
  '/16-line-quran',
];

function buildLanguageAlternates(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of LOCALES) {
    out[l.hreflang] = `${APP_BASE_URL}${getLocalizedPath(l.code as LocaleCode, path)}`;
  }
  out['x-default'] = `${APP_BASE_URL}${getLocalizedPath(DEFAULT_LOCALE, path)}`;
  return out;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const surahPaths = Array.from({ length: 114 }, (_, i) => `/quran/${i + 1}`);
  const juzPaths = Array.from({ length: 30 }, (_, i) => `/juz/${i + 1}`);

  const allPaths = [...INDEXABLE_PATHS, ...surahPaths, ...juzPaths];
  const now = new Date();

  return allPaths.map((path) => ({
    url: `${APP_BASE_URL}${getLocalizedPath(DEFAULT_LOCALE, path)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : path.startsWith('/quran/') ? 0.8 : 0.7,
    alternates: { languages: buildLanguageAlternates(path) },
  }));
}
