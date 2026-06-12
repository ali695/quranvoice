/**
 * WordByWordService — server-only.
 *
 * Returns per-word tokens (Arabic + transliteration + translation, plus
 * root/grammar when the source provides them) for a verse. Only the
 * Quran.Foundation provider exposes word-level data; the open AlQuran Cloud
 * fallback does not, so callers get `null` and the UI shows a source-aware
 * "not in this source" state — never a hardcoded "not connected".
 */

import { foundationFetch } from '@/lib/quran-foundation/client';
import { F } from '@/lib/quran-foundation/endpoints';
import { isFoundationConfigured } from '@/lib/quran-foundation/env';
import type { WordToken } from '@/lib/types/quran';

interface FoundationWord {
  position?: number;
  char_type_name?: string;
  text_uthmani?: string;
  text_indopak?: string;
  text?: string;
  transliteration?: { text?: string } | null;
  translation?: { text?: string } | null;
  root?: string;
  lemma?: string;
}

interface FoundationVerseWordsResponse {
  verse?: { verse_key?: string; words?: FoundationWord[] };
}

function nonEmpty(s?: string | null): boolean {
  return typeof s === 'string' && s.trim().length > 0;
}

export async function getVerseWords(
  surah: number,
  ayah: number,
  language = 'en',
): Promise<WordToken[] | null> {
  if (!Number.isInteger(surah) || !Number.isInteger(ayah)) return null;
  if (!isFoundationConfigured()) return null;

  const verseKey = `${surah}:${ayah}`;
  const json = await foundationFetch<FoundationVerseWordsResponse>(
    F.verseWords(verseKey, language),
    { revalidate: 86_400 },
  );
  const words = json?.verse?.words;
  if (!words?.length) return null;

  const tokens = words
    .filter((w) => (w.char_type_name ?? 'word') === 'word')
    .map<WordToken>((w, i) => ({
      position: w.position ?? i + 1,
      arabic: w.text_uthmani ?? w.text_indopak ?? w.text ?? '',
      transliteration: nonEmpty(w.transliteration?.text) ? w.transliteration!.text : undefined,
      translation: nonEmpty(w.translation?.text) ? w.translation!.text : undefined,
      rootArabic: nonEmpty(w.root) ? w.root : undefined,
      grammar: nonEmpty(w.lemma) ? w.lemma : undefined,
      source: {
        name: 'Quran.Foundation word-by-word',
        url: 'https://api-docs.quran.foundation/',
        verified: true,
      },
    }))
    .filter((t) => nonEmpty(t.arabic));

  return tokens.length ? tokens : null;
}
