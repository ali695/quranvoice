import type { RepeatMode } from './audio';

/** Quran script families a reader may want to view. */
export type QuranScript =
  | 'uthmani' // Foundation Uthmani (default when configured)
  | 'uthmani-simple' // simplified Uthmani
  | 'imlaei' // Imlaei orthography
  | 'tajweed'; // disabled unless verified Tajweed text/font is registered

/** Layout flavor of the reader. */
export type MushafStyle =
  | 'standard' // QuranVoice reader (cards)
  | 'ayah-by-ayah' // one-ayah-per-card study mode
  | 'page' // Mushaf page-by-page layout
  | 'eight-line' // disabled unless verified 8-line line-break data is registered
  | 'twelve-line' // disabled unless verified 12-line line-break data is registered
  | 'sixteen-line'; // disabled unless verified 16-line line-break data is registered

/** Line-break density used inside `page` / `*-line` modes. */
export type MushafLineStyle = 'flowing' | '8-line' | '12-line' | '16-line';

export interface ReadingSettings {
  arabicFont: 'amiri' | 'scheherazade' | 'noto-naskh' | 'uthmani';
  arabicFontSize: number;
  translationFontSize: number;
  lineHeight: number;
  showTranslation: boolean;
  showTransliteration: boolean;
  showWordByWord: boolean;
  showTafsirInline: boolean;
  showSourceLabels: boolean;
  showAyahActions: boolean;
  autoScrollWithAudio: boolean;
  /** Reading flavor — "reading" = clean, "study" = expanded, "focus" = arabic-only */
  mode: 'reading' | 'study' | 'focus' | 'mushaf';
  /** Mushaf layout style — separate from `mode` so callers can mix-and-match. */
  mushafStyle: MushafStyle;
  /** Quran script family. */
  script: QuranScript;
  /** Line-break style for Mushaf layouts. */
  lineStyle: MushafLineStyle;
  /** True only if the user explicitly opts in AND verified data is registered. */
  tajweedMode: boolean;
}

export interface TranslationSettings {
  /** ISO-639 of preferred language */
  defaultLanguage: string;
  /** Selected translation resource IDs */
  selected: Array<string | number>;
  displayStyle: 'stacked' | 'tabbed';
}

export interface TafsirSettings {
  defaultTafsirId: string | number | null;
  language: string;
  displayMode: 'inline' | 'panel';
  /** Use the spa5k secondary tafsir source when Quran.Foundation has none. */
  fallbackTafsirEnabled: boolean;
}

export interface AudioSettings {
  defaultReciterId: string;
  playbackSpeed: number;
  repeatMode: RepeatMode;
  autoScroll: boolean;
  autoPlayNextAyah: boolean;
  autoPlayNextSurah: boolean;
  showMiniPlayer: boolean;
  audioQuality: 'low' | 'standard' | 'high';
}

export interface MemorizationSettings {
  repeatCount: number;
  delayBetweenRepeatsMs: number;
  hideTranslationDuringReview: boolean;
  /** "daily" | "every-other-day" | "weekly" */
  reviewSchedule: 'daily' | 'alt-day' | 'weekly';
}

export interface AppearanceSettings {
  theme: 'dark' | 'light';
  density: 'compact' | 'comfortable';
}

export interface AppSettings {
  reading: ReadingSettings;
  translation: TranslationSettings;
  tafsir: TafsirSettings;
  audio: AudioSettings;
  memorization: MemorizationSettings;
  appearance: AppearanceSettings;
}
