/**
 * TajweedService — server-only.
 *
 * Returns real color-coded Tajweed text (`text_uthmani_tajweed`) from
 * Quran.Foundation. The markup carries `<tajweed class="…">` rule spans which
 * the UI styles with the standard colours — QuranVoice never infers Tajweed
 * itself, so this is available only from the verified source.
 */

import { foundationFetch } from '@/lib/quran-foundation/client';
import { F } from '@/lib/quran-foundation/endpoints';
import { isFoundationConfigured } from '@/lib/quran-foundation/env';

interface FVerse {
  verse_number?: number;
  verse_key?: string;
  text_uthmani_tajweed?: string;
}
interface FResponse {
  verses?: FVerse[];
}

export interface TajweedAyah {
  ayahNumber: number;
  verseKey: string;
  tajweedHtml: string;
}

export async function getTajweedSurah(surah: number): Promise<TajweedAyah[] | null> {
  if (!isFoundationConfigured()) return null;
  if (!Number.isInteger(surah) || surah < 1 || surah > 114) return null;
  const json = await foundationFetch<FResponse>(
    F.versesByChapter(surah, 'per_page=300&fields=text_uthmani_tajweed'),
    { revalidate: 86_400 },
  );
  if (!json?.verses?.length) return null;
  const out = json.verses
    .filter((v) => v.text_uthmani_tajweed)
    .map<TajweedAyah>((v, i) => ({
      ayahNumber: v.verse_number ?? i + 1,
      verseKey: v.verse_key ?? `${surah}:${v.verse_number ?? i + 1}`,
      tajweedHtml: v.text_uthmani_tajweed ?? '',
    }));
  return out.length ? out : null;
}
