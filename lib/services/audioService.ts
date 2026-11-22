/**
 * AudioService — server-only.
 *
 * Provider chain:
 *   1. Quran.Foundation recitations catalog + audio_files endpoints
 *      (returns real verified URLs and ayah-level segments when available)
 *   2. AlQuran Cloud audio editions + Islamic.Network CDN (fallback)
 *
 * We never synthesize audio URLs from naming conventions when the Foundation
 * provides them — that's the path that lets per-ayah timestamps work safely.
 */

import { alquranCloudFetch } from '@/lib/api/quranApiProxy';
import { foundationFetch } from '@/lib/quran-foundation/client';
import { F } from '@/lib/quran-foundation/endpoints';
import { isFoundationConfigured } from '@/lib/quran-foundation/env';
import { SURAHS } from '@/lib/data/surahs';
import type { AudioFile, Reciter } from '@/lib/types/audio';

/**
 * Cumulative ayah offsets so verse_key "s:a" maps to the global ayah number
 * (1..6236) used by the Islamic.Network per-ayah CDN. Built from the static
 * surah catalog — structural counts, not religious text.
 */
const AYAH_OFFSETS: number[] = (() => {
  const offsets: number[] = [0];
  let running = 0;
  for (let i = 1; i <= 114; i++) {
    const s = SURAHS.find((x) => x.number === i);
    running += s?.ayahCount ?? 0;
    offsets[i] = running;
  }
  return offsets;
})();

/** Global ayah number (1-based) for a verse key, or null if out of range. */
export function globalAyahNumber(surah: number, ayah: number): number | null {
  if (!Number.isInteger(surah) || surah < 1 || surah > 114) return null;
  const s = SURAHS.find((x) => x.number === surah);
  if (!s || ayah < 1 || ayah > s.ayahCount) return null;
  return AYAH_OFFSETS[surah - 1] + ayah;
}

/** Islamic.Network per-ayah CDN URL (fallback per-ayah audio). */
export function getCloudAyahAudioUrl(
  reciterId: string,
  surah: number,
  ayah: number,
  bitrate = 128,
): string | null {
  const num = globalAyahNumber(surah, ayah);
  if (num === null) return null;
  if (!/^[a-z0-9._-]+$/i.test(reciterId)) return null;
  return `https://cdn.islamic.network/quran/audio/${bitrate}/${encodeURIComponent(reciterId)}/${num}.mp3`;
}

interface FoundationRecitation {
  id: number;
  reciter_name: string;
  style?: string;
  translated_name?: { name?: string };
}

interface FoundationRecitationsResponse {
  recitations?: FoundationRecitation[];
}

interface FoundationChapterAudio {
  audio_file?: {
    id?: number;
    chapter_id?: number;
    file_size?: number;
    format?: string;
    audio_url?: string;
  };
}

interface FoundationAyahAudio {
  audio_files?: Array<{
    verse_key: string;
    url: string;
    segments?: Array<[number, number, number, number]>;
  }>;
}

interface AlquranCloudAudioEdition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: 'audio' | string;
  type: 'versebyverse' | 'translation' | string;
  bitrate?: number;
}

const FEATURED_RECITERS: Reciter[] = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', arabicName: 'مشاري راشد العفاسي', style: 'Murattal', hasSurahAudio: true, hasAyahAudio: true, source: { name: 'AlQuran Cloud audio catalog', verified: false } },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', arabicName: 'محمود خليل الحصري', style: 'Murattal', hasSurahAudio: true, hasAyahAudio: true, source: { name: 'AlQuran Cloud audio catalog', verified: false } },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq Al-Minshawi', arabicName: 'محمد صديق المنشاوي', style: 'Mujawwad', hasSurahAudio: true, hasAyahAudio: true, source: { name: 'AlQuran Cloud audio catalog', verified: false } },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit Abdus Samad', arabicName: 'عبد الباسط عبد الصمد', style: 'Murattal', hasSurahAudio: true, hasAyahAudio: true, source: { name: 'AlQuran Cloud audio catalog', verified: false } },
  { id: 'ar.sudais', name: 'Abdul Rahman As-Sudais', arabicName: 'عبدالرحمن السديس', style: 'Murattal', hasSurahAudio: true, hasAyahAudio: true, source: { name: 'AlQuran Cloud audio catalog', verified: false } },
  { id: 'ar.shaatree', name: 'Abu Bakr Al-Shatri', arabicName: 'أبو بكر الشاطري', style: 'Murattal', hasSurahAudio: true, hasAyahAudio: true, source: { name: 'AlQuran Cloud audio catalog', verified: false } },
];

export async function listReciters(): Promise<Reciter[]> {
  if (isFoundationConfigured()) {
    const json = await foundationFetch<FoundationRecitationsResponse>(
      F.recitationResources(),
      { revalidate: 86_400 },
    );
    if (json?.recitations?.length) {
      return json.recitations.map<Reciter>((r) => ({
        id: String(r.id),
        name: r.reciter_name,
        style: r.style,
        hasSurahAudio: true,
        hasAyahAudio: true,
        source: {
          name: 'Verified recitation',
          url: 'https://api-docs.quran.foundation/',
          verified: true,
        },
      }));
    }
  }
  // Fallback: AlQuran Cloud editions.
  const editions = await alquranCloudFetch<{ data?: AlquranCloudAudioEdition[] }>('/edition?format=audio');
  if (!editions?.data?.length) return FEATURED_RECITERS;
  const map = new Map<string, Reciter>();
  for (const e of editions.data) {
    if (e.format !== 'audio') continue;
    if (!map.has(e.identifier)) {
      map.set(e.identifier, {
        id: e.identifier,
        name: e.englishName || e.name,
        arabicName: e.name,
        hasSurahAudio: true,
        hasAyahAudio: e.type === 'versebyverse',
        source: { name: 'AlQuran Cloud audio catalog', url: 'https://alquran.cloud/cdn', verified: false },
      });
    }
  }
  const featuredIds = new Set(FEATURED_RECITERS.map((r) => r.id));
  return [...FEATURED_RECITERS, ...Array.from(map.values()).filter((r) => !featuredIds.has(r.id))];
}

export async function getReciter(id: string): Promise<Reciter | null> {
  const list = await listReciters();
  return list.find((r) => r.id === id) ?? null;
}

/** AlQuran Cloud / Islamic.Network audio CDN pattern (fallback only). */
export function getCloudSurahAudioUrl(reciterId: string, surah: number, bitrate = 128): string {
  return `https://cdn.islamic.network/quran/audio-surah/${bitrate}/${encodeURIComponent(reciterId)}/${surah}.mp3`;
}

export async function getAudioForSurah(
  reciterId: string,
  surah: number,
): Promise<AudioFile | null> {
  if (!Number.isInteger(surah) || surah < 1 || surah > 114) return null;

  if (isFoundationConfigured() && /^\d+$/.test(reciterId)) {
    const numericId = Number(reciterId);
    const json = await foundationFetch<FoundationChapterAudio>(
      F.audioForChapter(numericId, surah),
      { revalidate: 86_400 },
    );
    if (json?.audio_file?.audio_url) {
      return {
        reciterId,
        surah,
        url: json.audio_file.audio_url,
        format: 'mp3',
        source: {
          name: 'Quran.Foundation chapter audio',
          url: 'https://api-docs.quran.foundation/',
          verified: true,
        },
      };
    }
  }

  // Fallback: AlQuran Cloud / Islamic.Network CDN.
  if (!/^[a-z0-9._-]+$/i.test(reciterId)) return null;
  return {
    reciterId,
    surah,
    url: getCloudSurahAudioUrl(reciterId, surah),
    format: 'mp3',
    source: { name: 'AlQuran Cloud / Islamic.Network audio CDN', url: 'https://alquran.cloud/cdn', verified: false },
  };
}

/**
 * Returns ayah-level audio files (with verified segment timestamps when the
 * Foundation provides them). Returns null when no real ayah-level data is
 * available — callers should fall back to surah-level playback.
 */
export async function getAyahAudioFiles(
  reciterId: string,
  surah: number,
): Promise<Array<{ verseKey: string; url: string; segments?: Array<[number, number, number, number]> }> | null> {
  if (!isFoundationConfigured()) return null;
  if (!/^\d+$/.test(reciterId)) return null;
  if (!Number.isInteger(surah) || surah < 1 || surah > 114) return null;
  const numericId = Number(reciterId);
  const json = await foundationFetch<FoundationAyahAudio>(
    F.ayahAudioForChapter(numericId, surah),
    { revalidate: 86_400 },
  );
  if (!json?.audio_files?.length) return null;
  return json.audio_files.map((a) => ({
    verseKey: a.verse_key,
    url: a.url,
    segments: a.segments,
  }));
}

export interface AyahAudioResult {
  url: string;
  verseKey: string;
  segments?: Array<[number, number, number, number]>;
  /** Source provider for attribution + exact-timing reasoning. */
  provider: 'foundation' | 'alquran-cloud';
  verified: boolean;
}

export async function getAyahAudioFile(
  reciterId: string,
  verseKey: string,
): Promise<AyahAudioResult | null> {
  // Provider 1: Quran.Foundation — verified per-ayah files (numeric ids).
  if (isFoundationConfigured() && /^\d+$/.test(reciterId)) {
    const numericId = Number(reciterId);
    const json = await foundationFetch<FoundationAyahAudio>(
      F.ayahAudioForVerse(numericId, verseKey),
    );
    const file = json?.audio_files?.[0];
    if (file) {
      return {
        url: file.url.startsWith('http')
          ? file.url
          : `https://verses.quran.foundation/${file.url}`,
        verseKey: file.verse_key,
        segments: file.segments,
        provider: 'foundation',
        verified: true,
      };
    }
  }

  // Provider 2: Islamic.Network per-ayah CDN (AlQuran Cloud edition ids like
  // "ar.alafasy"). Per-ayah files mean exact-ayah playback works without
  // synthesizing timestamps over a surah file.
  const [surahStr, ayahStr] = verseKey.split(':');
  const surah = Number(surahStr);
  const ayah = Number(ayahStr);
  if (/^[a-z][a-z0-9._-]+$/i.test(reciterId)) {
    const url = getCloudAyahAudioUrl(reciterId, surah, ayah);
    if (url) {
      return { url, verseKey, provider: 'alquran-cloud', verified: false };
    }
  }

  return null;
}

export const featuredReciters = FEATURED_RECITERS;

// ─────────────────────────────────────────────────────────────────────────
// Word-level timing (Quran.Foundation segment data)
// ─────────────────────────────────────────────────────────────────────────

/** Map common AlQuran-Cloud reciter ids → Quran.Foundation numeric ids so
 *  word-level segment timing works for the default reciters. */
const QF_RECITER_MAP: Record<string, number> = {
  // Quran.Foundation verse-recitation IDs: 1 AbdulBaset Mujawwad, 2 AbdulBaset
  // Murattal, 3 Sudais, 4 Shatri, 5 Rifai, 6 Husary, 7 Alafasy, 8 Minshawi
  // Mujawwad, 9 Minshawi Murattal, 10 Shuraym, 11 Tablawi, 12 Husary Muallim.
  'ar.alafasy': 7,
  'ar.husary': 6,
  'ar.abdulbasitmurattal': 2,
  'ar.abdulbasitmujawwad': 1,
  'ar.abdurrahmansudais': 3,
  'ar.abdurrahmaansudais': 3,
  'ar.sudais': 3,
  'ar.shaatree': 4,
  'ar.hanirifai': 5,
  'ar.minshawi': 9,
  'ar.minshawimujawwad': 8,
  'ar.saoodshuraym': 10,
  'ar.shuraim': 10,
};

const QF_AUDIO_CDN = 'https://verses.quran.foundation/';

/** Resolve a reciter id to a Quran.Foundation numeric id, or null. */
export function resolveQfReciterId(reciterId: string): number | null {
  if (/^\d+$/.test(reciterId)) return Number(reciterId);
  return QF_RECITER_MAP[reciterId] ?? null;
}

interface FoundationVerseAudio {
  verse?: {
    audio?: { url?: string; segments?: Array<[number, number, number, number]> };
  };
}

export interface AyahTimingResult {
  url: string;
  segments: Array<[number, number, number, number]>;
  reciterId: number;
}

/**
 * Per-verse audio URL + word-level segment timing for a Quran.Foundation
 * reciter. Returns null when the reciter has no QF mapping or no segments
 * (callers then use ayah-level highlighting only). Never synthesizes timing.
 */
export async function getAyahTiming(
  reciterId: string,
  verseKey: string,
): Promise<AyahTimingResult | null> {
  if (!isFoundationConfigured()) return null;
  const qfId = resolveQfReciterId(reciterId);
  if (qfId === null) return null;
  const json = await foundationFetch<FoundationVerseAudio>(
    F.verseWithAudio(verseKey, qfId),
    { revalidate: 86_400 },
  );
  const audio = json?.verse?.audio;
  if (!audio?.url) return null;
  const segments = Array.isArray(audio.segments) ? audio.segments : [];
  const url = audio.url.startsWith('http') ? audio.url : `${QF_AUDIO_CDN}${audio.url}`;
  return { url, segments, reciterId: qfId };
}

// ─────────────────────────────────────────────────────────────────────────
// Full-surah audio with per-ayah + per-word timestamps (live follow-along)
// ─────────────────────────────────────────────────────────────────────────

/**
 * Quran.Foundation chapter-reciter IDs. Legacy AlQuran-Cloud IDs (the old
 * default `ar.alafasy`) map onto them so saved settings keep working.
 */
const CHAPTER_RECITER_ALIASES: Record<string, number> = {
  'ar.abdulbasitmujawwad': 1,
  'ar.abdulbasitmurattal': 2,
  'ar.abdurrahmansudais': 3,
  'ar.abdurrahmaansudais': 3,
  'ar.sudais': 3,
  'ar.shaatree': 4,
  'ar.hanirifai': 5,
  'ar.husary': 6,
  'ar.alafasy': 7,
  'ar.minshawi': 9,
  'ar.saoodshuraym': 10,
  'ar.shuraim': 10,
  'ar.ghamdi': 13,
  'ar.ahmedajamy': 19,
  'ar.mahermuaiqly': 159,
};

export function resolveChapterReciterId(reciterId: string): number | null {
  if (/^\d{1,4}$/.test(reciterId)) return Number(reciterId);
  return CHAPTER_RECITER_ALIASES[reciterId] ?? null;
}

/** [wordPosition (1-based), startMs, endMs] — absolute times in the surah file. */
export type WordTiming = [number, number, number];

export interface TimedAyah {
  ayah: number;
  /** Start/end of the ayah in the surah file (ms). */
  from: number;
  to: number;
  words: WordTiming[];
}

export interface SurahTiming {
  reciterId: number;
  surah: number;
  url: string;
  durationMs: number;
  ayahs: TimedAyah[];
}

interface FoundationTimedChapterAudio {
  audio_file?: {
    audio_url?: string;
    duration?: number;
    timestamps?: Array<{
      verse_key?: string;
      timestamp_from?: number;
      timestamp_to?: number;
      segments?: unknown[];
    }>;
  };
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/**
 * Full-surah MP3 plus real per-ayah and per-word timing from Quran.Foundation.
 * Returns null unless EVERY ayah of the surah has timing — a partial set would
 * make the pointer drift, and we never estimate timing.
 */
export async function getSurahTiming(reciterId: string, surah: number): Promise<SurahTiming | null> {
  if (!isFoundationConfigured()) return null;
  if (!Number.isInteger(surah) || surah < 1 || surah > 114) return null;
  const id = resolveChapterReciterId(reciterId);
  if (id === null) return null;
  const json = await foundationFetch<FoundationTimedChapterAudio>(F.surahAudioWithTimestamps(id, surah), {
    revalidate: 60 * 60 * 24 * 7,
  });
  const file = json?.audio_file;
  if (!file?.audio_url || !Array.isArray(file.timestamps)) return null;
  const expected = SURAHS.find((x) => x.number === surah)?.ayahCount;

  const ayahs: TimedAyah[] = [];
  for (const t of file.timestamps) {
    const m = /^(\d{1,3}):(\d{1,3})$/.exec(t.verse_key ?? '');
    if (!m || Number(m[1]) !== surah || !isNum(t.timestamp_from) || !isNum(t.timestamp_to)) return null;
    const words: WordTiming[] = [];
    for (const seg of t.segments ?? []) {
      if (Array.isArray(seg) && seg.length >= 3 && isNum(seg[0]) && isNum(seg[1]) && isNum(seg[2])) {
        words.push([seg[0], seg[1], seg[2]]);
      }
    }
    ayahs.push({ ayah: Number(m[2]), from: t.timestamp_from, to: t.timestamp_to, words });
  }
  ayahs.sort((a, b) => a.from - b.from);
  if (!ayahs.length || (expected && ayahs.length !== expected)) return null;

  return {
    reciterId: id,
    surah,
    url: file.audio_url,
    durationMs: isNum(file.duration) ? file.duration : ayahs[ayahs.length - 1].to,
    ayahs,
  };
}

export interface TimedReciter {
  id: string;
  name: string;
  style?: string;
}

interface FoundationChapterReciters {
  reciters?: Array<{ id: number; name?: string; reciter_name?: string; style?: { name?: string } | string | null }>;
}

/** Reciters with full-surah audio on Quran.Foundation (all carry word timing). */
export async function listTimedReciters(): Promise<TimedReciter[]> {
  if (!isFoundationConfigured()) return [];
  const json = await foundationFetch<FoundationChapterReciters>(F.chapterReciters(), { revalidate: 86_400 });
  return (json?.reciters ?? [])
    .filter((r) => isNum(r.id))
    .map((r) => {
      const style = typeof r.style === 'string' ? r.style : r.style?.name;
      return { id: String(r.id), name: (r.name ?? r.reciter_name ?? `Reciter ${r.id}`).trim(), style: style || undefined };
    });
}
