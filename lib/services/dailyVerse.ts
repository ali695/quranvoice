/**
 * Daily verse selector — server-only.
 *
 * Picks one of a curated list of meaningful, well-known verses for
 * "Ayah of the Day" using a deterministic day-of-year index so the
 * UI doesn't change mid-day. Each entry is a verse_key only; the
 * Arabic + translation render from Quran.Foundation / AlQuran Cloud.
 */

import { getAyah } from './quranService';
import { getTranslationForVerse } from './translationService';
import type { Ayah } from '@/lib/types/quran';
import type { TranslationVerse } from '@/lib/types/translation';

/** Verses widely loved + commonly used as daily recitation. Verse keys only. */
const DAILY_POOL: string[] = [
  '1:1',   '1:2',   '1:6',
  '2:255', '2:286', '2:152', '2:201',
  '3:8',   '3:159', '3:185', '3:200',
  '7:23',
  '13:28',
  '17:80', '17:82',
  '20:114',
  '21:107',
  '23:118',
  '24:35',
  '25:74',
  '33:21', '33:56',
  '39:53',
  '40:60',
  '46:15',
  '55:13',
  '59:22', '59:23', '59:24',
  '65:2',  '65:3',
  '94:5',  '94:6',
  '112:1',
  '113:1',
  '114:1',
];

function dayOfYearUTC(d = new Date()): number {
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  const diff = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - start;
  return Math.floor(diff / 86_400_000);
}

export interface DailyAyahPayload {
  verseKey: string;
  ayah: Ayah | null;
  translation: TranslationVerse | null;
  /** Display label like "Al-Baqarah 255" */
  surahLabel: string;
}

export function getTodayVerseKey(): string {
  const idx = dayOfYearUTC() % DAILY_POOL.length;
  return DAILY_POOL[idx];
}

const SURAH_NAMES: Record<number, string> = {
  1: 'Al-Fatihah',
  2: 'Al-Baqarah',
  3: "Ali 'Imran",
  7: "Al-A'raf",
  13: "Ar-Ra'd",
  17: 'Al-Isra',
  20: 'Ta-Ha',
  21: 'Al-Anbiya',
  23: "Al-Mu'minun",
  24: 'An-Nur',
  25: 'Al-Furqan',
  33: 'Al-Ahzab',
  39: 'Az-Zumar',
  40: 'Ghafir',
  46: 'Al-Ahqaf',
  55: 'Ar-Rahman',
  59: 'Al-Hashr',
  65: 'At-Talaq',
  94: 'Ash-Sharh',
  112: 'Al-Ikhlas',
  113: 'Al-Falaq',
  114: 'An-Nas',
};

export async function getDailyAyah(
  translationId: string | number = 131, // Saheeh International (Quran.Foundation id 131)
): Promise<DailyAyahPayload> {
  const verseKey = getTodayVerseKey();
  const [surahStr, ayahStr] = verseKey.split(':');
  const surah = Number(surahStr);
  const ayah = Number(ayahStr);
  const [ayahData, translation] = await Promise.all([
    getAyah(surah, ayah),
    getTranslationForVerse(verseKey, translationId).catch(() => null),
  ]);
  return {
    verseKey,
    ayah: ayahData,
    translation,
    surahLabel: `${SURAH_NAMES[surah] ?? `Surah ${surah}`} ${ayah}`,
  };
}
