export interface ParsedReference {
  surah: number;
  ayah?: number;
}

const REF_PATTERN = /^\s*(\d{1,3})\s*[:.\-/]\s*(\d{1,3})?\s*$/;

/** Parse "2:255" / "2.255" / "2/255" / "2-255" / "2" -> { surah, ayah? } */
export function parseAyahReference(raw: string): ParsedReference | null {
  if (!raw) return null;
  const match = raw.match(REF_PATTERN);
  if (!match) {
    const surahOnly = Number(raw.trim());
    if (Number.isInteger(surahOnly) && surahOnly >= 1 && surahOnly <= 114) {
      return { surah: surahOnly };
    }
    return null;
  }
  const surah = Number(match[1]);
  if (!Number.isInteger(surah) || surah < 1 || surah > 114) return null;
  if (match[2] === undefined) return { surah };
  const ayah = Number(match[2]);
  if (!Number.isInteger(ayah) || ayah < 1) return null;
  return { surah, ayah };
}
