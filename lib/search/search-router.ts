/**
 * Search router (client-safe, pure) — validates a parsed query against real
 * Quran bounds and builds a locale-aware target URL. Never produces an invalid
 * route (out-of-range ayah/juz/page → null so the UI shows "no match").
 */

import { SURAHS } from '@/lib/data/surahs';
import { getLocalizedPath } from '@/lib/i18n/config';
import { DEFAULT_LOCALE, isSupportedLocale, type LocaleCode } from '@/lib/i18n/locales';
import type { ParsedQuery, ResultType } from './query-parser';

const MAX_PAGE = 604;
const MAX_JUZ = 30;

export interface ResolvedQuery {
  type: ResultType;
  query: string;
  verseKey?: string;
  surahNumber?: number;
  ayahNumber?: number;
  juzNumber?: number;
  pageNumber?: number;
  targetUrl: string;
  /** Localized target preserving the active locale prefix. */
  localizedUrl: string;
  confidence: ParsedQuery['confidence'];
  label: string;
  arabicName?: string;
}

function surahMeta(n: number) {
  return SURAHS.find((s) => s.number === n) ?? null;
}

function localize(path: string, locale?: string): string {
  const code: LocaleCode = locale && isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  return getLocalizedPath(code, path);
}

/** Validate + route a parsed query. Returns null when the target is invalid. */
export function routeQuery(
  parsed: ParsedQuery | null,
  rawQuery: string,
  locale?: string,
): ResolvedQuery | null {
  if (!parsed) return null;

  if (parsed.type === 'ayah' || parsed.type === 'surah') {
    const sn = parsed.surahNumber;
    if (!sn || sn < 1 || sn > 114) return null;
    const meta = surahMeta(sn);
    if (!meta) return null;

    if (parsed.type === 'ayah') {
      const an = parsed.ayahNumber;
      if (!an || an < 1 || an > meta.ayahCount) return null; // validate against real count
      const path = `/quran/${sn}/${an}`;
      return {
        type: 'ayah',
        query: rawQuery,
        verseKey: `${sn}:${an}`,
        surahNumber: sn,
        ayahNumber: an,
        targetUrl: path,
        localizedUrl: localize(path, locale),
        confidence: parsed.confidence,
        label: `${meta.transliteration} ${sn}:${an}`,
        arabicName: meta.arabic,
      };
    }

    const path = `/quran/${sn}`;
    return {
      type: 'surah',
      query: rawQuery,
      surahNumber: sn,
      targetUrl: path,
      localizedUrl: localize(path, locale),
      confidence: parsed.confidence,
      label: `Surah ${meta.transliteration}`,
      arabicName: meta.arabic,
    };
  }

  if (parsed.type === 'juz') {
    const jn = parsed.juzNumber;
    if (!jn || jn < 1 || jn > MAX_JUZ) return null;
    const path = `/juz/${jn}`;
    return {
      type: 'juz',
      query: rawQuery,
      juzNumber: jn,
      targetUrl: path,
      localizedUrl: localize(path, locale),
      confidence: 'exact',
      label: `Juz ${jn}`,
    };
  }

  if (parsed.type === 'page') {
    const pn = parsed.pageNumber;
    if (!pn || pn < 1 || pn > MAX_PAGE) return null;
    const path = `/pages/${pn}`;
    return {
      type: 'page',
      query: rawQuery,
      pageNumber: pn,
      targetUrl: path,
      localizedUrl: localize(path, locale),
      confidence: 'exact',
      label: `Mushaf Page ${pn}`,
    };
  }

  return null;
}
