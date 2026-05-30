/**
 * TranslationService — server-only.
 *
 * Provider chain:
 *   1. Quran.Foundation Content API (when configured)
 *   2. AlQuran Cloud open catalog (fallback)
 *
 * Both the catalog and per-surah verse lookups are provider-aware.
 */

import { alquranCloudFetch } from '@/lib/api/quranApiProxy';
import { foundationFetch } from '@/lib/quran-foundation/client';
import { F } from '@/lib/quran-foundation/endpoints';
import { isFoundationConfigured } from '@/lib/quran-foundation/env';
import type { TranslationResource, TranslationVerse } from '@/lib/types/translation';

interface FoundationTranslation {
  id: number;
  name: string;
  author_name: string;
  language_name?: string;
  iso?: string;
  language_iso?: string;
  translated_name?: { name?: string };
}

interface FoundationTranslationsResponse {
  translations?: FoundationTranslation[];
}

interface FoundationVerseTranslationsResponse {
  translations?: Array<{
    resource_id: number;
    resource_name?: string;
    language_name?: string;
    text: string;
    verse_key?: string;
    verse_number?: number;
  }>;
}

interface AlquranCloudEdition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  direction?: string;
}

interface AlquranCloudVerseEdition {
  number: number;
  numberInSurah: number;
  text: string;
}

const DEFAULT_FEATURED = [
  { id: 'en.sahih', iso: 'en', languageName: 'English', author: 'Saheeh International' },
  { id: 'en.pickthall', iso: 'en', languageName: 'English', author: 'Marmaduke Pickthall' },
  { id: 'en.asad', iso: 'en', languageName: 'English', author: 'Muhammad Asad' },
  { id: 'ur.jalandhry', iso: 'ur', languageName: 'Urdu', author: 'Fateh Muhammad Jalandhry' },
];

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, '').trim();
}

export async function listTranslations(language = 'en'): Promise<TranslationResource[]> {
  if (isFoundationConfigured()) {
    const json = await foundationFetch<FoundationTranslationsResponse>(
      F.translationResources(language),
      { revalidate: 86_400 },
    );
    if (json?.translations?.length) {
      return json.translations.map<TranslationResource>((t) => ({
        id: t.id,
        name: t.name,
        authorName: t.author_name ?? t.name,
        language: t.iso ?? t.language_iso ?? t.language_name ?? language,
        languageName: t.language_name ?? language,
        languageIso: t.iso ?? t.language_iso ?? language,
        source: {
          name: 'Quran.Foundation translations catalog',
          url: 'https://api-docs.quran.foundation/',
          verified: true,
        },
      }));
    }
  }
  const editions = await alquranCloudFetch<{ data?: AlquranCloudEdition[] }>(
    '/edition?format=text&type=translation',
  );
  if (editions?.data?.length) {
    return editions.data.map((e) => ({
      id: e.identifier,
      name: e.englishName || e.name,
      authorName: e.englishName || e.name,
      language: e.language,
      languageName: e.name,
      languageIso: e.language,
      source: { name: 'AlQuran Cloud edition catalog', url: 'https://alquran.cloud/editions', verified: false },
    }));
  }
  return DEFAULT_FEATURED.map((d) => ({
    id: d.id,
    name: d.author,
    authorName: d.author,
    language: d.iso,
    languageName: d.languageName,
    languageIso: d.iso,
    source: { name: 'Featured catalog', verified: false },
  }));
}

export async function getTranslationForSurah(
  surah: number,
  translationId: string | number,
): Promise<TranslationVerse[] | null> {
  if (translationId === undefined || translationId === null || translationId === '') return null;

  if (isFoundationConfigured()) {
    const numericId = String(translationId).match(/^\d+$/) ? Number(translationId) : null;
    if (numericId !== null) {
      const json = await foundationFetch<FoundationVerseTranslationsResponse>(
        F.translationByChapter(numericId, surah),
      );
      if (json?.translations?.length) {
        const resourceName = json.translations[0].resource_name ?? `Translation ${numericId}`;
        return json.translations.map<TranslationVerse>((t) => ({
          resourceId: numericId,
          resourceName,
          languageName: t.language_name ?? '',
          text: stripHtml(t.text),
          source: {
            name: 'Quran.Foundation',
            url: 'https://api-docs.quran.foundation/',
            verified: true,
          },
        }));
      }
    }
  }

  const idStr = String(translationId);
  if (!/^[a-z0-9._-]+$/i.test(idStr)) return null;
  const json = await alquranCloudFetch<{
    data?: { englishName?: string; name?: string; ayahs?: AlquranCloudVerseEdition[] };
  }>(`/surah/${surah}/${idStr}`);
  if (!json?.data?.ayahs?.length) return null;
  const resourceName = json.data.englishName || json.data.name || idStr;
  return json.data.ayahs.map((a) => ({
    resourceId: idStr,
    resourceName,
    languageName: resourceName,
    text: a.text,
    source: { name: `${resourceName} via AlQuran Cloud`, verified: false },
  }));
}

export async function getTranslationForVerse(
  verseKey: string,
  translationId: string | number,
): Promise<TranslationVerse | null> {
  const [surahStr, ayahStr] = verseKey.split(':');
  const surah = Number(surahStr);
  const ayah = Number(ayahStr);
  if (!Number.isInteger(surah) || !Number.isInteger(ayah)) return null;

  if (isFoundationConfigured()) {
    const numericId = String(translationId).match(/^\d+$/) ? Number(translationId) : null;
    if (numericId !== null) {
      const json = await foundationFetch<FoundationVerseTranslationsResponse>(
        F.translationByVerse(numericId, verseKey),
      );
      const t = json?.translations?.[0];
      if (t) {
        return {
          resourceId: numericId,
          resourceName: t.resource_name ?? `Translation ${numericId}`,
          languageName: t.language_name ?? '',
          text: stripHtml(t.text),
          source: { name: 'Quran.Foundation', verified: true },
        };
      }
    }
  }

  const all = await getTranslationForSurah(surah, translationId);
  return all?.[ayah - 1] ?? null;
}
