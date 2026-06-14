/**
 * MushafService — server-only.
 *
 * Returns a real printed-page layout (words grouped by their actual
 * `line_number`) for a Quran.Foundation `mushaf` layout. This is genuine
 * line-break data from the source — never synthesized. Only available when the
 * Foundation is configured; otherwise callers show an unavailable state.
 */

import { foundationFetch } from '@/lib/quran-foundation/client';
import { F } from '@/lib/quran-foundation/endpoints';
import { isFoundationConfigured } from '@/lib/quran-foundation/env';
import { getSurahByNumber } from '@/lib/data/surahs';
import { MUSHAF_LAYOUTS, type MushafLine, type MushafPageData, type MushafWord } from '@/lib/types/mushaf';

interface FWord {
  char_type_name?: string;
  text_uthmani?: string;
  text?: string;
  line_number?: number;
  page_number?: number;
}
interface FVerse {
  verse_key?: string;
  juz_number?: number;
  words?: FWord[];
}
interface FResponse {
  verses?: FVerse[];
}

function surahName(n: number): { name: string; arabic: string } {
  const s = getSurahByNumber(n);
  return { name: s?.transliteration ?? `Surah ${n}`, arabic: s?.arabic ?? '' };
}

export async function getMushafPage(
  page: number,
  mushafId: number,
): Promise<MushafPageData | null> {
  if (!isFoundationConfigured()) return null;
  if (!Number.isInteger(page) || page < 1 || page > 604) return null;
  const layout = MUSHAF_LAYOUTS.find((l) => l.mushafId === mushafId) ?? MUSHAF_LAYOUTS[0];

  const json = await foundationFetch<FResponse>(F.mushafPage(page, layout.mushafId), {
    revalidate: 86_400,
  });
  if (!json?.verses?.length) return null;

  // Group words by their real printed line number.
  const byLine = new Map<number, MushafWord[]>();
  const surahSet = new Map<number, { number: number; name: string; arabic: string }>();
  let juz: number | undefined;

  for (const v of json.verses) {
    const [sStr, aStr] = (v.verse_key ?? '').split(':');
    const surahNumber = Number(sStr);
    const ayahNumber = Number(aStr);
    if (juz === undefined && typeof v.juz_number === 'number') juz = v.juz_number;
    if (Number.isInteger(surahNumber) && !surahSet.has(surahNumber)) {
      surahSet.set(surahNumber, { number: surahNumber, ...surahName(surahNumber) });
    }
    for (const w of v.words ?? []) {
      const ln = w.line_number ?? 0;
      if (!ln) continue;
      const word: MushafWord = {
        text: w.text_uthmani ?? w.text ?? '',
        type: w.char_type_name ?? 'word',
        verseKey: v.verse_key,
        ayahNumber,
        surahNumber,
      };
      const arr = byLine.get(ln) ?? [];
      arr.push(word);
      byLine.set(ln, arr);
    }
  }

  const linesCount = Math.max(...byLine.keys(), layout.lines);
  const lines: MushafLine[] = [];
  for (let ln = 1; ln <= linesCount; ln++) {
    const words = byLine.get(ln) ?? [];
    const line: MushafLine = { lineNumber: ln, words };
    // Surah header: a line whose first word starts ayah 1 of a surah.
    const first = words[0];
    if (first?.ayahNumber === 1 && first.surahNumber) {
      const meta = surahName(first.surahNumber);
      line.surahHeader = { number: first.surahNumber, ...meta };
    }
    lines.push(line);
  }

  return {
    page,
    mushafId: layout.mushafId,
    linesCount,
    lines,
    juz,
    surahs: Array.from(surahSet.values()),
  };
}
