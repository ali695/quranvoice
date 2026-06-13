/**
 * Query parser (client-safe, pure) — classifies a raw search string into a
 * navigation intent. Combines special references (Ayat al-Kursi…), structured
 * references (ayah/juz/page), and surah-name resolution.
 */

import { parseReference, type RefKind } from './reference-parser';
import { resolveSurahName, SPECIAL_REFERENCES } from './surah-aliases';

export type ResultType = 'ayah' | 'surah' | 'juz' | 'page';
export type Confidence = 'exact' | 'high' | 'low';

export interface ParsedQuery {
  type: ResultType;
  surahNumber?: number;
  ayahNumber?: number;
  juzNumber?: number;
  pageNumber?: number;
  confidence: Confidence;
  /** Human label for the matched target, filled by the router. */
  label?: string;
}

const refKindToType: Record<RefKind, ResultType> = {
  ayah: 'ayah',
  surah: 'surah',
  juz: 'juz',
  page: 'page',
};

export function parseQuery(raw: string): ParsedQuery | null {
  const q = (raw || '').trim();
  if (!q) return null;

  // 1. Special, well-known references (highest priority, exact).
  for (const sp of SPECIAL_REFERENCES) {
    if (sp.match.test(q)) {
      return { type: 'ayah', surahNumber: sp.surah, ayahNumber: sp.ayah, confidence: 'exact' };
    }
  }

  // 2. Structured references (ayah/juz/page or numeric surah).
  const ref = parseReference(q);
  if (ref) {
    return {
      type: refKindToType[ref.kind],
      surahNumber: ref.surahNumber,
      ayahNumber: ref.ayahNumber,
      juzNumber: ref.juzNumber,
      pageNumber: ref.pageNumber,
      confidence: ref.kind === 'surah' && /^\d+$/.test(q) ? 'exact' : 'exact',
    };
  }

  // 3. Surah name / alias / Arabic name.
  const surah = resolveSurahName(q);
  if (surah) {
    return { type: 'surah', surahNumber: surah, confidence: 'high' };
  }

  return null;
}
