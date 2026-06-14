/**
 * Mushaf page layout types — real printed-page line data from Quran.Foundation.
 */

export interface MushafWord {
  text: string;
  /** 'word' | 'end' (ayah-number marker) | 'pause' etc. */
  type: string;
  verseKey?: string;
  ayahNumber?: number;
  surahNumber?: number;
}

export interface MushafLine {
  lineNumber: number;
  words: MushafWord[];
  /** A surah header band starts on this line (first ayah of a new surah). */
  surahHeader?: { number: number; name: string; arabic: string };
  /** Centered Bismillah line (rendered above ayah 1 of most surahs). */
  isBismillah?: boolean;
}

export interface MushafPageData {
  page: number;
  mushafId: number;
  linesCount: number;
  lines: MushafLine[];
  juz?: number;
  surahs: Array<{ number: number; name: string; arabic: string }>;
}

/** A selectable Mushaf layout backed by a real Quran.Foundation `mushaf` id. */
export interface MushafLayout {
  /** Stable key used by settings / line-style. */
  key: '15-line' | '16-line';
  mushafId: number;
  lines: 15 | 16;
  label: string;
  description: string;
}

export const MUSHAF_LAYOUTS: MushafLayout[] = [
  {
    key: '15-line',
    mushafId: 1,
    lines: 15,
    label: '15-line Madani Mushaf',
    description: 'King Fahd Complex (KFGQPC) 15 lines per page.',
  },
  {
    key: '16-line',
    mushafId: 7,
    lines: 16,
    label: '16-line Indo-Pak Mushaf',
    description: 'Indo-Pak 16 lines per page.',
  },
];

export function layoutForKey(key: string): MushafLayout | undefined {
  return MUSHAF_LAYOUTS.find((l) => l.key === key);
}
