/**
 * Frontend API response mappers.
 *
 * Every internal /api/quran/* route returns one of:
 *
 *   { "data": ... }
 *   { "error": { ... } }
 *
 * Components used to guess the shape; these helpers make it stable.
 * Use `unwrap()` at the call site, then optionally pass to a `mapX`
 * helper that narrows / re-shapes the field for the component.
 */

import type { Ayah, Surah } from '@/lib/types/quran';
import type { TranslationVerse, TranslationResource } from '@/lib/types/translation';
import type { TafsirEntry, TafsirResource } from '@/lib/types/tafsir';
import type { Reciter, AudioFile } from '@/lib/types/audio';

export interface ApiEnvelope<T> {
  data?: T;
  error?: { message: string; code?: string };
}

export async function fetchApi<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(path, init);
    if (!res.ok) return null;
    const json = (await res.json()) as ApiEnvelope<T>;
    return json.data ?? null;
  } catch {
    return null;
  }
}

/** Strict variant — throws when the API returned `error` or non-2xx. */
export async function fetchApiOrThrow<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  const json = (await res.json().catch(() => ({}))) as ApiEnvelope<T>;
  if (!res.ok || json.error) {
    throw new Error(json.error?.message ?? `HTTP ${res.status}`);
  }
  if (json.data === undefined) throw new Error('No data field in response');
  return json.data;
}

// Mapper helpers — they don't change shape today (the routes already
// return the expected shape), but having them gives us a single
// chokepoint to evolve the contract without touching call sites.
export const mapChapterApiData      = <T extends Surah>(d: T): T => d;
export const mapVerseApiData        = <T extends Ayah>(d: T): T => d;
export const mapTranslationApiData  = <T extends TranslationVerse[] | TranslationResource[]>(d: T): T => d;
export const mapTafsirApiData       = <T extends TafsirEntry[] | TafsirResource[]>(d: T): T => d;
export const mapRecitationApiData   = <T extends Reciter[] | Reciter>(d: T): T => d;
export const mapAudioApiData        = <T extends AudioFile>(d: T): T => d;
