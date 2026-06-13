/**
 * Pure mappers: spa5k responses → app types (TafsirResource / NormalizedTafsir).
 * No network. Source attribution always travels with the mapped value.
 */

import type { NormalizedTafsir, TafsirResource } from '@/lib/types/tafsir';
import type { Spa5kEdition, Spa5kVerse } from './spa5k-client';

const REPO_URL = 'https://github.com/spa5k/tafsir_api';

/** spa5k language_name casing is inconsistent ("Kurdish"/"kurdish") — normalize. */
export function normalizeLanguage(name: string | undefined): string {
  return (name ?? '').toLowerCase().trim();
}

/**
 * spa5k edition slugs are prefixed with the ISO-639-1 language code
 * ("en-al-jalalayn" → "en", "ur-tafseer-ibn-e-kaseer" → "ur"). The app filters
 * by ISO code, so we key the edition's `language` off the slug prefix rather
 * than the inconsistent `language_name`.
 */
export function isoFromSlug(slug: string): string {
  const prefix = (slug.split('-')[0] ?? '').toLowerCase();
  return /^[a-z]{2,3}$/.test(prefix) ? prefix : '';
}

export function mapEditionToResource(e: Spa5kEdition): TafsirResource {
  const language = isoFromSlug(e.slug) || normalizeLanguage(e.language_name);
  return {
    id: e.slug, // fallback editions are keyed by slug, not numeric id
    name: e.name,
    authorName: e.author_name || e.name,
    language,
    languageName: e.language_name || language,
    provider: 'spa5k_fallback',
    isFallback: true,
    source: {
      name: 'Fallback Tafsir API (spa5k/tafsir_api)',
      url: e.source || REPO_URL,
      verified: false,
    },
  };
}

export function mapEditionsToResources(editions: Spa5kEdition[] | null): TafsirResource[] {
  if (!editions?.length) return [];
  return editions.map(mapEditionToResource);
}

export function mapVerseToNormalized(params: {
  edition: Spa5kEdition;
  verse: Spa5kVerse;
}): NormalizedTafsir | null {
  const { edition, verse } = params;
  const content = (verse.text ?? '').trim();
  if (!content) return null;
  return {
    provider: 'spa5k_fallback',
    editionSlug: edition.slug,
    editionName: edition.name,
    author: edition.author_name || undefined,
    language: isoFromSlug(edition.slug) || normalizeLanguage(edition.language_name),
    verseKey: `${verse.surah}:${verse.ayah}`,
    surahNumber: verse.surah,
    ayahNumber: verse.ayah,
    content,
    sourceUrl: edition.source || REPO_URL,
    isFallback: true,
  };
}

/** Distinct, sorted ISO languages present in an edition list (from slugs). */
export function fallbackLanguages(editions: Spa5kEdition[] | null): string[] {
  if (!editions?.length) return [];
  return Array.from(
    new Set(editions.map((e) => isoFromSlug(e.slug) || normalizeLanguage(e.language_name))),
  )
    .filter(Boolean)
    .sort();
}
