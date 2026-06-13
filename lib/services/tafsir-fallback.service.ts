/**
 * Tafsir fallback service (spa5k/tafsir_api) — server-only.
 *
 * SECONDARY to Quran.Foundation. Lists fallback editions and returns mapped,
 * normalized tafsir for a verse. Never replaces Quran.Foundation — the
 * priority resolver decides when this is used.
 */

import {
  fetchFallbackEditions,
  fetchFallbackVerse,
  type Spa5kEdition,
} from '@/lib/tafsir/spa5k-client';
import {
  fallbackLanguages,
  isoFromSlug,
  mapEditionsToResources,
  mapVerseToNormalized,
  normalizeLanguage,
} from '@/lib/tafsir/spa5k-mappers';
import type { NormalizedTafsir, TafsirResource } from '@/lib/types/tafsir';

let editionsCache: { value: Spa5kEdition[]; expiresAt: number } | null = null;

async function getEditions(): Promise<Spa5kEdition[]> {
  if (editionsCache && editionsCache.expiresAt > Date.now()) return editionsCache.value;
  const editions = (await fetchFallbackEditions()) ?? [];
  editionsCache = { value: editions, expiresAt: Date.now() + 6 * 60 * 60_000 };
  return editions;
}

export async function listFallbackEditions(language?: string): Promise<TafsirResource[]> {
  const editions = await getEditions();
  const lang = normalizeLanguage(language);
  const filtered = lang
    ? editions.filter((e) => (isoFromSlug(e.slug) || normalizeLanguage(e.language_name)) === lang)
    : editions;
  return mapEditionsToResources(filtered);
}

export async function getFallbackEditionCount(): Promise<number> {
  return (await getEditions()).length;
}

export async function getFallbackLanguages(): Promise<string[]> {
  return fallbackLanguages(await getEditions());
}

async function getEditionBySlug(slug: string): Promise<Spa5kEdition | null> {
  const editions = await getEditions();
  return editions.find((e) => e.slug === slug) ?? null;
}

/** First edition matching a language (by ISO slug prefix) — per-language default. */
async function getDefaultEditionForLanguage(language: string): Promise<Spa5kEdition | null> {
  const editions = await getEditions();
  const lang = normalizeLanguage(language);
  return (
    editions.find((e) => (isoFromSlug(e.slug) || normalizeLanguage(e.language_name)) === lang) ??
    null
  );
}

export async function getFallbackTafsirForVerse(
  editionSlug: string,
  surah: number,
  ayah: number,
): Promise<NormalizedTafsir | null> {
  const edition = await getEditionBySlug(editionSlug);
  if (!edition) return null;
  const verse = await fetchFallbackVerse(editionSlug, surah, ayah);
  if (!verse) return null;
  return mapVerseToNormalized({ edition, verse });
}

/** Fallback tafsir for a verse using the best edition for a language. */
export async function getDefaultFallbackTafsirForVerse(
  language: string,
  surah: number,
  ayah: number,
): Promise<NormalizedTafsir | null> {
  const edition = await getDefaultEditionForLanguage(language);
  if (!edition) return null;
  const verse = await fetchFallbackVerse(edition.slug, surah, ayah);
  if (!verse) return null;
  return mapVerseToNormalized({ edition, verse });
}
