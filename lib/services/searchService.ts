/**
 * SearchService — server-side.
 *
 * Three passes:
 *   1) Reference / surah-name match against the local catalog (fast, deterministic).
 *   2) Quran.Foundation `/search` endpoint when the scope is enabled.
 *   3) Full-text search of an English translation via AlQuran Cloud (fallback).
 */

import { alquranCloudFetch } from '@/lib/api/quranApiProxy';
import { foundationFetch } from '@/lib/quran-foundation/client';
import { F } from '@/lib/quran-foundation/endpoints';
import { isFoundationConfigured } from '@/lib/quran-foundation/env';
import { FALLBACK_SURAHS } from '@/lib/data/fallbackSurahs';
import { parseAyahReference } from '@/lib/utils/parseAyahReference';

export interface SearchResult {
  surah: number;
  ayah?: number;
  verseKey: string;
  surahName: string;
  arabicName: string;
  matchText?: string;
  matchSource?: string;
  kind: 'reference' | 'surah' | 'ayah';
}

interface AlquranCloudSearchMatch {
  number: number;
  text: string;
  surah?: { number: number; englishName?: string; name?: string };
  numberInSurah: number;
}

interface AlquranCloudSearchResponse {
  data?: { count?: number; matches?: AlquranCloudSearchMatch[] };
}

interface FoundationSearchResponse {
  search?: {
    query?: string;
    total_results?: number;
    results?: Array<{
      verse_key: string;
      text?: string;
      translations?: Array<{ text?: string; resource_name?: string; language_name?: string }>;
    }>;
  };
}

interface SearchScopeStatus {
  available: boolean;
  reason?: string;
}

/** Probe whether the Foundation search scope is enabled for our client. */
export async function getSearchScopeStatus(): Promise<SearchScopeStatus> {
  if (!isFoundationConfigured()) {
    return { available: false, reason: 'Quran.Foundation not configured' };
  }
  const json = await foundationFetch<FoundationSearchResponse>(F.search('test', 'size=1'));
  if (json?.search) return { available: true };
  return { available: false, reason: 'Search scope not enabled for this client' };
}

export async function search(query: string): Promise<SearchResult[]> {
  const q = (query ?? '').trim();
  if (!q) return [];
  const out: SearchResult[] = [];

  // 1) Reference parse — "2:255", "36", "2.255"
  const parsed = parseAyahReference(q);
  if (parsed) {
    const meta = FALLBACK_SURAHS.find((s) => s.number === parsed.surah);
    if (meta) {
      out.push({
        surah: meta.number,
        ayah: parsed.ayah,
        verseKey: parsed.ayah ? `${meta.number}:${parsed.ayah}` : `${meta.number}`,
        surahName: meta.transliteration,
        arabicName: meta.arabic,
        kind: 'reference',
      });
    }
  }

  // 2) Surah name match (case-insensitive contains).
  const lower = q.toLowerCase();
  const nameMatches = FALLBACK_SURAHS.filter(
    (s) =>
      s.transliteration.toLowerCase().includes(lower) ||
      s.meaning.toLowerCase().includes(lower),
  )
    .slice(0, 8)
    .map<SearchResult>((s) => ({
      surah: s.number,
      verseKey: String(s.number),
      surahName: s.transliteration,
      arabicName: s.arabic,
      matchText: s.meaning,
      matchSource: 'Surah catalog',
      kind: 'surah',
    }));
  out.push(...nameMatches);

  if (q.length >= 3 && !parsed) {
    // 3a) Quran.Foundation search if scope is enabled.
    let foundationFulltextOk = false;
    if (isFoundationConfigured()) {
      const json = await foundationFetch<FoundationSearchResponse>(F.search(q, 'size=20'));
      const results = json?.search?.results;
      if (results?.length) {
        foundationFulltextOk = true;
        for (const r of results) {
          const [surahStr, ayahStr] = (r.verse_key || '').split(':');
          const surah = Number(surahStr);
          const ayah = Number(ayahStr);
          if (!Number.isInteger(surah) || !Number.isInteger(ayah)) continue;
          const meta = FALLBACK_SURAHS.find((s) => s.number === surah);
          const tr = r.translations?.[0];
          out.push({
            surah,
            ayah,
            verseKey: r.verse_key,
            surahName: meta?.transliteration ?? `Surah ${surah}`,
            arabicName: meta?.arabic ?? '',
            matchText: tr?.text ?? r.text,
            matchSource: tr?.resource_name ?? 'Quran.Foundation search',
            kind: 'ayah',
          });
        }
      }
    }

    // 3b) Fallback: AlQuran Cloud full-text on Saheeh International.
    if (!foundationFulltextOk) {
      const json = await alquranCloudFetch<AlquranCloudSearchResponse>(
        `/search/${encodeURIComponent(q)}/all/en.sahih`,
      );
      if (json?.data?.matches?.length) {
        for (const m of json.data.matches.slice(0, 20)) {
          if (!m.surah) continue;
          out.push({
            surah: m.surah.number,
            ayah: m.numberInSurah,
            verseKey: `${m.surah.number}:${m.numberInSurah}`,
            surahName: m.surah.englishName ?? `Surah ${m.surah.number}`,
            arabicName: m.surah.name ?? '',
            matchText: m.text,
            matchSource: 'Saheeh International translation',
            kind: 'ayah',
          });
        }
      }
    }
  }

  const seen = new Set<string>();
  return out.filter((r) => {
    const k = `${r.kind}:${r.verseKey}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
