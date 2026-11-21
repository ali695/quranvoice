/**
 * Derived juz structure (verse ranges, hizb quarters, pages, rukus, sajdahs)
 * computed from the Tanzil metadata in `quranStructure.ts`. Contains no
 * Quran text — only positions.
 */

import {
  HIZB_QUARTER_STARTS,
  JUZ_STARTS,
  MANZIL_STARTS,
  PAGE_STARTS,
  RUKU_STARTS,
  SAJDAHS,
  SURAH_AYAH_COUNTS,
  type VersePos,
} from './quranStructure';

/** Index of the first ayah of each surah in the 0..6235 sequence. */
const SURAH_OFFSETS: number[] = (() => {
  const out: number[] = [];
  let acc = 0;
  for (const n of SURAH_AYAH_COUNTS) {
    out.push(acc);
    acc += n;
  }
  return out;
})();

export const TOTAL_AYAHS = SURAH_AYAH_COUNTS.reduce((a, b) => a + b, 0);

/** Position → absolute ayah index (0-based). */
export function toIndex([surah, ayah]: VersePos): number {
  return SURAH_OFFSETS[surah - 1] + ayah - 1;
}

/** Absolute ayah index (0-based) → position. */
export function fromIndex(index: number): VersePos {
  let s = SURAH_OFFSETS.length - 1;
  while (s > 0 && SURAH_OFFSETS[s] > index) s--;
  return [s + 1, index - SURAH_OFFSETS[s] + 1];
}

/** 1-based number of the last boundary at or before `index`. */
function containing(starts: readonly VersePos[], index: number): number {
  let n = 0;
  for (let i = 0; i < starts.length; i++) {
    if (toIndex(starts[i]) <= index) n = i + 1;
    else break;
  }
  return n;
}

export interface JuzSurahSegment {
  surah: number;
  fromAyah: number;
  toAyah: number;
  /** True when the whole surah falls inside this juz. */
  complete: boolean;
}

export interface JuzQuarter {
  /** Hizb number (1–60). */
  hizb: number;
  /** 0 = start of hizb, 1 = ¼, 2 = ½, 3 = ¾. */
  quarter: 0 | 1 | 2 | 3;
  start: VersePos;
}

export interface JuzDetails {
  number: number;
  start: VersePos;
  end: VersePos;
  ayahCount: number;
  surahs: JuzSurahSegment[];
  quarters: JuzQuarter[];
  firstPage: number;
  lastPage: number;
  rukusStarting: number;
  sajdahs: VersePos[];
  manzil: number;
}

export function getJuzDetails(n: number): JuzDetails | null {
  if (!Number.isInteger(n) || n < 1 || n > 30) return null;
  const startIdx = toIndex(JUZ_STARTS[n - 1]);
  const endIdx = n < 30 ? toIndex(JUZ_STARTS[n]) - 1 : TOTAL_AYAHS - 1;
  const start = fromIndex(startIdx);
  const end = fromIndex(endIdx);

  const surahs: JuzSurahSegment[] = [];
  for (let s = start[0]; s <= end[0]; s++) {
    const fromAyah = s === start[0] ? start[1] : 1;
    const toAyah = s === end[0] ? end[1] : SURAH_AYAH_COUNTS[s - 1];
    surahs.push({ surah: s, fromAyah, toAyah, complete: fromAyah === 1 && toAyah === SURAH_AYAH_COUNTS[s - 1] });
  }

  const quarters: JuzQuarter[] = HIZB_QUARTER_STARTS.slice((n - 1) * 8, n * 8).map((pos, i) => ({
    hizb: (n - 1) * 2 + Math.floor(i / 4) + 1,
    quarter: (i % 4) as JuzQuarter['quarter'],
    start: pos,
  }));

  const inRange = (pos: VersePos) => {
    const i = toIndex(pos);
    return i >= startIdx && i <= endIdx;
  };

  return {
    number: n,
    start,
    end,
    ayahCount: endIdx - startIdx + 1,
    surahs,
    quarters,
    firstPage: containing(PAGE_STARTS, startIdx),
    lastPage: containing(PAGE_STARTS, endIdx),
    rukusStarting: RUKU_STARTS.filter(inRange).length,
    sajdahs: SAJDAHS.filter(([s, a]) => inRange([s, a])).map(([s, a]) => [s, a] as const),
    manzil: containing(MANZIL_STARTS, startIdx),
  };
}
