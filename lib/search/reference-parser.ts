/**
 * Reference parser (client-safe, pure).
 *
 * Detects ayah / juz / page references from free text in many forms:
 *   2:255 · 2/255 · 2-255 · 2 255 · Surah 2 Ayah 255 · Sura 2 Aya 255
 *   Al-Baqarah 255 · البقرة 255 · Juz 3 · Para 30 · Page 42 · صفحة 42
 */

import { resolveSurahName } from './surah-aliases';

export type RefKind = 'ayah' | 'surah' | 'juz' | 'page';

export interface ParsedRef {
  kind: RefKind;
  surahNumber?: number;
  ayahNumber?: number;
  juzNumber?: number;
  pageNumber?: number;
}

/** Numeric ayah/surah reference: "2:255", "2 255", "2/255", "2-255", "2.255". */
function parseNumericRef(q: string): ParsedRef | null {
  const m = q.match(/^\s*(\d{1,3})\s*[\s:.\-/]\s*(\d{1,3})\s*$/);
  if (m) {
    return { kind: 'ayah', surahNumber: Number(m[1]), ayahNumber: Number(m[2]) };
  }
  // Surah-only number.
  const only = q.match(/^\s*(?:surah?|sura|chapter)?\s*(\d{1,3})\s*$/i);
  if (only) return { kind: 'surah', surahNumber: Number(only[1]) };
  return null;
}

/** "Surah 2 Ayah 255" / "Sura 2 Aya 255" / "chapter 2 verse 255". */
function parseWordyRef(q: string): ParsedRef | null {
  const m = q.match(
    /(?:surah?|sura|chapter)\s*(\d{1,3})\s*(?:،|,)?\s*(?:ayah?|aya|ayat|verse|آیت|آية)\s*(\d{1,3})/i,
  );
  if (m) return { kind: 'ayah', surahNumber: Number(m[1]), ayahNumber: Number(m[2]) };
  return null;
}

/** "Al-Baqarah 255" / "Baqarah 255" / "البقرة 255" — surah name + ayah number. */
function parseNameWithAyah(q: string): ParsedRef | null {
  const m = q.match(/^(.*?)[\s،,]+(\d{1,3})\s*$/);
  if (!m) return null;
  const name = m[1].trim();
  if (!name || /^\d+$/.test(name)) return null;
  const surah = resolveSurahName(name);
  if (!surah) return null;
  return { kind: 'ayah', surahNumber: surah, ayahNumber: Number(m[2]) };
}

/** "Juz 3" / "Para 30" / "Sipara 1" / "جزء 1" / "سپارہ 1". */
function parseJuz(q: string): ParsedRef | null {
  const m = q.match(/(?:juz['z]?|para|sipara|سپارہ|سيپارہ|جزء|پارہ)\s*(\d{1,2})/i);
  if (m) return { kind: 'juz', juzNumber: Number(m[1]) };
  return null;
}

/** "Page 42" / "Mushaf page 42" / "صفحة 42" / "صفحہ 42". */
function parsePage(q: string): ParsedRef | null {
  const m = q.match(/(?:mushaf\s*)?(?:page|pg|صفحة|صفحہ|safha)\s*(\d{1,3})/i);
  if (m) return { kind: 'page', pageNumber: Number(m[1]) };
  return null;
}

/**
 * Parse a query into a structured reference. Order matters: wordy and
 * name+ayah forms are tried before bare numbers so "Surah 2 Ayah 255" and
 * "Al-Baqarah 255" win over a stray number.
 */
export function parseReference(raw: string): ParsedRef | null {
  const q = (raw || '').trim();
  if (!q) return null;
  return (
    parseJuz(q) ??
    parsePage(q) ??
    parseWordyRef(q) ??
    parseNumericRef(q) ??
    parseNameWithAyah(q) ??
    null
  );
}
