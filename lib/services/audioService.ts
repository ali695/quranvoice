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
          name: 'Quran.Foundation recitations catalog',
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
