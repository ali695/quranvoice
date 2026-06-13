import type { SourceRef } from './quran';

export type TafsirProvider = 'quran_foundation' | 'spa5k_fallback';

export interface TafsirResource {
  id: string | number;
  name: string;
  authorName: string;
  language: string;
  languageName: string;
  source: SourceRef;
  /** Which provider this resource comes from. Defaults to Quran.Foundation. */
  provider?: TafsirProvider;
  /** True for spa5k fallback editions (id is the edition slug). */
  isFallback?: boolean;
}

/**
 * Normalized tafsir entry — identical shape whether it came from
 * Quran.Foundation or the spa5k fallback, so the UI renders both the same way
 * (only the source label / fallback badge differ).
 */
export interface NormalizedTafsir {
  provider: TafsirProvider;
  editionSlug: string;
  editionName: string;
  author?: string;
  language: string;
  verseKey: string;
  surahNumber: number;
  ayahNumber: number;
  /** Plain/HTML tafsir content (already sanitized of obvious wrappers). */
  content: string;
  sourceUrl?: string;
  isFallback: boolean;
}

export interface TafsirEntry {
  resourceId: string | number;
  book: string;
  author: string;
  language: string;
  /** May contain inline HTML when delivered by the API */
  textHtml?: string;
  text?: string;
  source: SourceRef;
}
