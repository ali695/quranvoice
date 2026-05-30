import type { SourceRef } from './quran';

export interface Reciter {
  id: string;
  name: string;
  arabicName?: string;
  style?: 'Murattal' | 'Mujawwad' | 'Mufassal' | string;
  languageCode?: string;
  /** True when surah-level audio files are available */
  hasSurahAudio: boolean;
  /** True when per-ayah audio files are available */
  hasAyahAudio: boolean;
  source: SourceRef;
}

export interface AudioFile {
  reciterId: string;
  surah: number;
  /** Present for ayah-level files */
  ayah?: number;
  url: string;
  format?: 'mp3' | 'ogg';
  /** Segments: [ayahNumber, startMs, endMs] from verified timestamp data */
  segments?: Array<[number, number, number]>;
  source: SourceRef;
}

export type RepeatMode = 'off' | 'ayah' | 'range' | 'surah';

export interface AudioQueueItem {
  reciterId: string;
  surah: number;
  ayah?: number;
  label: string;
}
