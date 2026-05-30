/**
 * Core Quran type definitions.
 * Designed for integration with verified Quran APIs (AlQuran Cloud,
 * Quran.com, fawazahmed0/quran-api, etc.). Religious content fields
 * carry a SourceRef so attribution flows through to the UI.
 */

export type RevelationType = 'meccan' | 'medinan';

export interface Surah {
  number: number;
  transliteration: string;
  arabic: string;
  meaning: string;
  ayahCount: number;
  revelation: RevelationType;
  juzStart?: number;
  pageStart?: number;
}

export interface SourceRef {
  name: string;
  url?: string;
  license?: string;
  /** Set when this resource has been verified by the Resource Registry */
  verified?: boolean;
}

export interface Ayah {
  surahNumber: number;
  ayahNumber: number;
  /** Verse key like "2:255" */
  verseKey: string;
  arabic: string;
  juz?: number;
  page?: number;
  hizbQuarter?: number;
  sajdah?: boolean;
}

export interface AyahWithMeta extends Ayah {
  translations?: import('./translation').TranslationVerse[];
  tafsir?: import('./tafsir').TafsirEntry[];
  words?: WordToken[];
  audio?: import('./audio').AudioFile;
}

export interface WordToken {
  position: number;
  arabic: string;
  transliteration?: string;
  translation?: string;
  rootArabic?: string;
  grammar?: string;
  source: SourceRef;
}

export interface Juz {
  number: number;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
}

export interface MushafPage {
  number: number;
  firstSurah: number;
  firstAyah: number;
  lastSurah: number;
  lastAyah: number;
}

export interface ReadingProgress {
  surah: Surah;
  ayah: number;
  percent: number;
  lastReadAt: string;
}

export interface Topic {
  slug: string;
  label: string;
  description?: string;
}

export interface LearningArticle {
  slug: string;
  category: string;
  title: string;
  description: string;
  cover?: string;
}
