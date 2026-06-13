/**
 * spa5k/tafsir_api client — server-only.
 *
 * SECONDARY tafsir source. Used only as a fallback when Quran.Foundation has
 * no tafsir content for a verse/language. Public, openly-licensed editions
 * served from jsDelivr (mirrors the GitHub repo). We may self-host the
 * `tafsir` data folder later; the base URL is overridable via env.
 *
 * Repo:    https://github.com/spa5k/tafsir_api
 * License: see repo (open data, sourced from quran.com et al. with attribution)
 */

const DEFAULT_BASE = 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir';

export function spa5kBaseUrl(): string {
  return (process.env.TAFSIR_FALLBACK_BASE_URL || DEFAULT_BASE).replace(/\/$/, '');
}

export interface Spa5kEdition {
  id: number;
  name: string;
  author_name: string;
  language_name: string;
  slug: string;
  source?: string;
}

export interface Spa5kVerse {
  surah: number;
  ayah: number;
  text: string;
}

async function getJson<T>(url: string, revalidate: number): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** All fallback editions. Cached for a day. */
export async function fetchFallbackEditions(): Promise<Spa5kEdition[] | null> {
  return getJson<Spa5kEdition[]>(`${spa5kBaseUrl()}/editions.json`, 86_400);
}

/** Tafsir for one verse from a fallback edition. */
export async function fetchFallbackVerse(
  editionSlug: string,
  surah: number,
  ayah: number,
): Promise<Spa5kVerse | null> {
  if (!/^[a-z0-9-]+$/i.test(editionSlug)) return null;
  if (!Number.isInteger(surah) || surah < 1 || surah > 114) return null;
  if (!Number.isInteger(ayah) || ayah < 1) return null;
  return getJson<Spa5kVerse>(
    `${spa5kBaseUrl()}/${editionSlug}/${surah}/${ayah}.json`,
    86_400,
  );
}

/** Whole-surah tafsir from a fallback edition. */
export async function fetchFallbackSurah(
  editionSlug: string,
  surah: number,
): Promise<{ ayahs?: Spa5kVerse[] } | Spa5kVerse[] | null> {
  if (!/^[a-z0-9-]+$/i.test(editionSlug)) return null;
  if (!Number.isInteger(surah) || surah < 1 || surah > 114) return null;
  return getJson(`${spa5kBaseUrl()}/${editionSlug}/${surah}.json`, 86_400);
}
