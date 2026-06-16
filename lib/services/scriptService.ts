/**
 * ScriptService — server-only. Returns alternate Quran scripts for a surah
 * (Imlaei or simplified Uthmani) from Quran.Foundation. Tajweed text has its
 * own service (tajweedService). Never alters the text.
 */

import { foundationFetch } from '@/lib/quran-foundation/client';
import { F } from '@/lib/quran-foundation/endpoints';
import { isFoundationConfigured } from '@/lib/quran-foundation/env';

export type ScriptType = 'imlaei' | 'uthmani_simple';

const FIELD: Record<ScriptType, string> = {
  imlaei: 'text_imlaei',
  uthmani_simple: 'text_uthmani_simple',
};

interface FVerse {
  verse_number?: number;
  verse_key?: string;
  text_imlaei?: string;
  text_uthmani_simple?: string;
}

export interface ScriptAyah {
  ayahNumber: number;
  verseKey: string;
  text: string;
}

export async function getSurahScript(
  surah: number,
  type: ScriptType,
): Promise<ScriptAyah[] | null> {
  if (!isFoundationConfigured()) return null;
  if (!Number.isInteger(surah) || surah < 1 || surah > 114) return null;
  const field = FIELD[type];
  const json = await foundationFetch<{ verses?: FVerse[] }>(
    F.versesByChapter(surah, `per_page=300&fields=${field}`),
    { revalidate: 86_400 },
  );
  if (!json?.verses?.length) return null;
  const out = json.verses
    .map<ScriptAyah>((v, i) => ({
      ayahNumber: v.verse_number ?? i + 1,
      verseKey: v.verse_key ?? `${surah}:${v.verse_number ?? i + 1}`,
      text: (type === 'imlaei' ? v.text_imlaei : v.text_uthmani_simple) ?? '',
    }))
    .filter((a) => a.text);
  return out.length ? out : null;
}
