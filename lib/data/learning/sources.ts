/**
 * Verified-source registry for Learning Library content.
 *
 * These are *source* records — not religious content themselves. They are
 * the lookups that learning items reference via `sourceRefs`. We do not
 * include any source we have not independently checked, and we never
 * synthesize religious explanations from them.
 */

import type { SourceReference } from '@/lib/types/learning';

/** Quran.Foundation Content API — primary verified source for Quranic text. */
export const SRC_QURAN_FOUNDATION: SourceReference = {
  id: 'quran-foundation',
  sourceType: 'quran',
  title: 'Quran.Foundation Content API',
  url: 'https://api-docs.quran.foundation/',
  reference: 'Quran (Uthmani text)',
  licenseStatus: 'verified_allowed',
};

/** Tanzil-derived Quran text via the open AlQuran Cloud provider. */
export const SRC_TANZIL_VIA_ALQURAN_CLOUD: SourceReference = {
  id: 'tanzil-via-alquran-cloud',
  sourceType: 'quran',
  title: 'Tanzil Quran text via AlQuran Cloud',
  url: 'https://alquran.cloud/',
  reference: 'Quran (Uthmani text)',
  licenseStatus: 'verified_allowed',
};

/** QuranVoice editorial — for app guidance only (NOT for religious rulings). */
export const SRC_EDITORIAL: SourceReference = {
  id: 'quranvoice-editorial',
  sourceType: 'manual_review',
  title: 'QuranVoice editorial guide',
  reference: 'App orientation only — not a tafsir, not a fatwa.',
  licenseStatus: 'verified_allowed',
};

/** A direct Quranic reference, parameterized by verse key. */
export function quranRef(verseKey: string, title?: string): SourceReference {
  return {
    id: `quran-${verseKey}`,
    sourceType: 'quran',
    title: title ?? `Quran ${verseKey}`,
    reference: `Quran ${verseKey}`,
    licenseStatus: 'verified_allowed',
  };
}
