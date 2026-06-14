/**
 * Tafsir coordinator — server-only.
 *
 * Resolves tafsir for a verse using the source priority:
 *   QF selected → QF default → spa5k selected → spa5k default → unavailable.
 * Quran.Foundation stays the PRIMARY source; spa5k is only a fallback and is
 * skipped entirely when `fallbackEnabled` is false. Returns a `NormalizedTafsir`
 * so the UI renders both providers identically (only labels/badges differ).
 */

import { getTafsirForAyah, listTafsirs } from '@/lib/services/tafsirService';
import {
  getDefaultFallbackTafsirForVerse,
  getFallbackTafsirForVerse,
  listFallbackEditions,
} from '@/lib/services/tafsir-fallback.service';
import { isFallbackSlug, isQuranFoundationId } from '@/lib/tafsir/tafsir-source-priority';
import type { NormalizedTafsir, TafsirResource } from '@/lib/types/tafsir';

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Map a Quran.Foundation tafsir entry → NormalizedTafsir for a verse. */
async function qfTafsir(
  qfId: number,
  surah: number,
  ayah: number,
): Promise<NormalizedTafsir | null> {
  const entries = await getTafsirForAyah(surah, ayah, qfId);
  const entry = entries?.[0];
  if (!entry) return null;
  const content = (entry.textHtml ?? entry.text ?? '').trim();
  if (!content || !stripHtml(content)) return null;
  return {
    provider: 'quran_foundation',
    editionSlug: String(qfId),
    editionName: entry.book,
    author: entry.author && entry.author !== entry.book ? entry.author : undefined,
    language: entry.language,
    verseKey: `${surah}:${ayah}`,
    surahNumber: surah,
    ayahNumber: ayah,
    content,
    sourceUrl: entry.source.url,
    isFallback: false,
  };
}

/** Default Quran.Foundation tafsir id for a language (else first overall). */
async function defaultQfTafsirId(language: string): Promise<number | null> {
  const all = await listTafsirs(language);
  const lang = language.toLowerCase();
  // listTafsirs returns the full catalog (QF ignores the language filter), so
  // filter by each tafsir's REAL content language.
  const pick = all.find((t) => t.language === lang) ?? all[0];
  if (!pick) return null;
  return /^\d+$/.test(String(pick.id)) ? Number(pick.id) : null;
}

export interface ResolveTafsirOptions {
  surah: number;
  ayah: number;
  selectedId?: string | number | null;
  language: string;
  fallbackEnabled: boolean;
}

export async function resolveTafsirForVerse(
  opts: ResolveTafsirOptions,
): Promise<NormalizedTafsir | null> {
  const { surah, ayah, selectedId, language, fallbackEnabled } = opts;

  // 1. Quran.Foundation selected.
  if (isQuranFoundationId(selectedId)) {
    const r = await qfTafsir(Number(selectedId), surah, ayah);
    if (r) return r;
  }

  // 2. Quran.Foundation default for the language.
  const defaultId = await defaultQfTafsirId(language);
  if (defaultId != null && String(defaultId) !== String(selectedId ?? '')) {
    const r = await qfTafsir(defaultId, surah, ayah);
    if (r) return r;
  }

  // 3 & 4. spa5k fallback (only when enabled).
  if (fallbackEnabled) {
    if (isFallbackSlug(selectedId)) {
      const r = await getFallbackTafsirForVerse(String(selectedId), surah, ayah);
      if (r) return r;
    }
    const r = await getDefaultFallbackTafsirForVerse(language, surah, ayah);
    if (r) return r;
  }

  // 5. Unavailable.
  return null;
}

export interface GroupedTafsirResources {
  quranFoundation: TafsirResource[];
  fallback: TafsirResource[];
}

/** Both provider groups, optionally filtered by language. */
export async function listAllTafsirResources(
  language?: string,
  includeFallback = true,
): Promise<GroupedTafsirResources> {
  const [qfAll, fb] = await Promise.all([
    listTafsirs(language ?? 'en'),
    includeFallback ? listFallbackEditions(language) : Promise.resolve([]),
  ]);
  // QF returns the full catalog regardless of the language param — filter by
  // each tafsir's real content language when one is requested.
  const lang = language?.toLowerCase();
  const qf = lang ? qfAll.filter((t) => t.language === lang) : qfAll;
  const quranFoundation = qf.map((t) => ({ ...t, provider: 'quran_foundation' as const, isFallback: false }));
  return { quranFoundation, fallback: fb };
}
