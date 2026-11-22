/**
 * Quranic dua content: Arabic (Uthmani), word-based transliteration, English
 * (Saheeh International) and Urdu (Fateh Muhammad Jalandhari) — all from the
 * Quran.Foundation Content API, fetched by verse reference. Nothing here is
 * written or paraphrased by us.
 */

import { foundationFetch } from '@/lib/quran-foundation/client';
import { duaVerseKeys, type QuranicDua } from '@/lib/data/learning/quranicDuas';
import { htmlToText } from '@/lib/utils/sanitizeHtml';

/** Quran.Foundation translation resource IDs. */
export const DUA_TRANSLATIONS = {
  en: { id: 20, name: 'Saheeh International' },
  ur: { id: 234, name: 'Fateh Muhammad Jalandhari' },
} as const;

interface FoundationWord {
  position: number;
  char_type_name?: string;
  text_uthmani?: string;
  text_imlaei_simple?: string;
  transliteration?: { text?: string | null };
}

interface FoundationVerse {
  verse?: {
    verse_key: string;
    words?: FoundationWord[];
    translations?: Array<{ resource_id: number; text: string }>;
  };
}

export interface DuaAyah {
  verseKey: string;
  ayah: number;
  /** Words before the dua begins (shown dimmed), if any. */
  leadArabic: string;
  /** The dua itself (or the whole ayah). */
  duaArabic: string;
  /** Transliteration of the dua part, built from per-word transliteration. */
  transliteration: string;
  /** Full-ayah translations. */
  en: string;
  ur: string;
}

export interface DuaContent {
  ayahs: DuaAyah[];
}

const DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;
function normalizeArabic(s: string): string {
  return s
    .replace(DIACRITICS, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .trim();
}

/** Strip footnote markers (<sup …>1</sup>) and tags from a translation. */
function cleanTranslation(html: string): string {
  return htmlToText(html.replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, ''));
}

/**
 * Word transliteration is given as pronounced mid-sentence, so a dua that
 * starts on a connecting hamza ("l-lahuma") gets its initial vowel back.
 */
function startOfSpeech(s: string): string {
  const fixed = s.replace(/^l-lahuma/i, 'Allāhumma').replace(/^l-/i, 'Al-');
  return fixed ? fixed.charAt(0).toUpperCase() + fixed.slice(1) : fixed;
}

async function fetchVerse(verseKey: string): Promise<FoundationVerse['verse'] | null> {
  const qs =
    'words=true&word_fields=text_uthmani,text_imlaei_simple' +
    `&translations=${DUA_TRANSLATIONS.en.id},${DUA_TRANSLATIONS.ur.id}&fields=text_uthmani`;
  const json = await foundationFetch<FoundationVerse>(
    `/content/api/v4/verses/by_key/${encodeURIComponent(verseKey)}?${qs}`,
    { revalidate: 60 * 60 * 24 * 30 },
  );
  return json?.verse ?? null;
}

export async function getDuaContent(dua: QuranicDua): Promise<DuaContent | null> {
  const keys = duaVerseKeys(dua);
  const verses = await Promise.all(keys.map(fetchVerse));
  if (verses.some((v) => !v?.words?.length)) return null;

  const ayahs: DuaAyah[] = verses.map((v, i) => {
    const words = (v!.words ?? []).filter((w) => (w.char_type_name ?? 'word') === 'word');
    let start = 0;
    if (i === 0 && dua.startAt) {
      const [word, which] = dua.startAt.split('@');
      const target = normalizeArabic(word);
      const matches = words
        .map((w, j) => (normalizeArabic(w.text_imlaei_simple ?? '') === target ? j : -1))
        .filter((j) => j >= 0);
      const idx = matches.length ? (which === 'last' ? matches[matches.length - 1] : matches[0]) : -1;
      if (idx > 0) start = idx;
    }
    const tr = v!.translations ?? [];
    const pick = (id: number) => cleanTranslation(tr.find((t) => t.resource_id === id)?.text ?? '');
    const translit = words
      .slice(start)
      .map((w) => w.transliteration?.text ?? '')
      .filter(Boolean)
      .join(' ');
    return {
      verseKey: v!.verse_key,
      ayah: Number(v!.verse_key.split(':')[1]),
      leadArabic: words.slice(0, start).map((w) => w.text_uthmani ?? '').join(' '),
      duaArabic: words.slice(start).map((w) => w.text_uthmani ?? '').join(' '),
      transliteration: start > 0 || i === 0 ? startOfSpeech(translit) : translit,
      en: pick(DUA_TRANSLATIONS.en.id),
      ur: pick(DUA_TRANSLATIONS.ur.id),
    };
  });
  return { ayahs };
}

/** Opening words of the dua in transliteration, for titles ("Rabbana atina…"). */
export function duaOpening(content: DuaContent, maxWords = 5): string {
  const words = content.ayahs[0]?.transliteration.split(/\s+/) ?? [];
  const head = words.slice(0, maxWords).join(' ');
  return words.length > maxWords ? `${head}…` : head;
}
