/**
 * CapabilityService — server-only.
 *
 * Produces a live {@link Capabilities} snapshot by *probing* the active
 * content provider and reading back which fields/resources are really
 * present. Nothing here is hardcoded to `true`: a feature is unlocked only
 * because a real provider response contained the data for it.
 *
 * Provider order mirrors the rest of the app:
 *   1. Quran.Foundation (rich: tajweed, words, tafsir, per-ayah audio)
 *   2. AlQuran Cloud (text + translations + surah audio; no tajweed/words/tafsir)
 *   3. none (everything unavailable, with a "provider unconfigured" reason)
 *
 * Results are cached in-process for a short window so the `/capabilities`
 * route and server components don't re-probe on every request.
 */

import { alquranCloudFetch } from '@/lib/api/quranApiProxy';
import { foundationFetch } from '@/lib/quran-foundation/client';
import { F } from '@/lib/quran-foundation/endpoints';
import { isFoundationConfigured } from '@/lib/quran-foundation/env';
import {
  deriveCapabilities,
  emptyCapabilities,
  type ProbeVerse,
} from '@/lib/quran-foundation/capability-mappers';
import {
  distinctLanguages,
  mapTafsirResources,
  mapTranslationResources,
  type RawFoundationTafsir,
  type RawFoundationTranslation,
} from '@/lib/quran-foundation/resource-mappers';
import { getAyahAudioFile } from '@/lib/services/audioService';
import type { Capabilities } from '@/lib/types/capability';

const PROBE_VERSE_KEY = '2:255';
const CACHE_TTL_MS = 5 * 60_000;

interface CacheEntry {
  value: Capabilities;
  expiresAt: number;
}
let cache: CacheEntry | null = null;

interface FoundationVerseEnvelope {
  verse?: ProbeVerse;
}
interface FoundationTranslationsEnvelope {
  translations?: RawFoundationTranslation[];
}
interface FoundationTafsirsEnvelope {
  tafsirs?: RawFoundationTafsir[];
}
interface FoundationRecitationsEnvelope {
  recitations?: Array<{ id: number }>;
}

async function probeFoundation(): Promise<Capabilities | null> {
  const [verseRes, translationsRes, tafsirsRes, recitationsRes] = await Promise.all([
    foundationFetch<FoundationVerseEnvelope>(F.verseCapabilityProbe(PROBE_VERSE_KEY), {
      revalidate: 3600,
    }),
    foundationFetch<FoundationTranslationsEnvelope>(F.translationResources('en'), {
      revalidate: 86_400,
    }),
    foundationFetch<FoundationTafsirsEnvelope>(F.tafsirResources('en'), { revalidate: 86_400 }),
    foundationFetch<FoundationRecitationsEnvelope>(F.recitationResources(), {
      revalidate: 86_400,
    }),
  ]);

  // If the core verse probe failed entirely, treat the Foundation as down so
  // callers can fall back to the open provider rather than show false locks.
  if (!verseRes?.verse && !translationsRes?.translations?.length) return null;

  const translations = mapTranslationResources(translationsRes?.translations, 'en');
  const tafsirResources = mapTafsirResources(tafsirsRes?.tafsirs, 'en');
  const recitationCount = recitationsRes?.recitations?.length ?? 0;

  // Per-ayah audio probe — reciter 7 (Mishary on the Foundation) for the
  // probe verse. Confirms exact-ayah audio (vs surah-only) is real.
  let ayahAudioAvailable = false;
  if (recitationCount > 0) {
    try {
      const file = await getAyahAudioFile('7', PROBE_VERSE_KEY);
      ayahAudioAvailable = Boolean(file?.url);
    } catch {
      ayahAudioAvailable = false;
    }
  }

  return deriveCapabilities({
    provider: 'foundation',
    verse: verseRes?.verse ?? null,
    translationCount: translations.length,
    translationLanguages: distinctLanguages(translations),
    tafsirCount: tafsirResources.length,
    tafsirLanguages: distinctLanguages(
      tafsirResources.map((t) => ({ language: t.language })),
    ),
    recitationCount,
    ayahAudioAvailable,
    // Review-gated / mapping features are resolved per-verse by their own
    // services and components; the global snapshot stays honest about them.
    asbabAvailable: false,
    shanENuzoolAvailable: false,
    relatedAyahsAvailable: false,
  });
}

interface CloudEdition {
  identifier: string;
  language: string;
  englishName?: string;
  name?: string;
  format?: string;
  type?: string;
}

async function probeAlquranCloud(): Promise<Capabilities | null> {
  const [text, translationsEd, audioEd] = await Promise.all([
    alquranCloudFetch<{ data?: { ayahs?: Array<{ text?: string; page?: number }> } }>(
      `/surah/2/quran-uthmani`,
    ),
    alquranCloudFetch<{ data?: CloudEdition[] }>('/edition?format=text&type=translation'),
    alquranCloudFetch<{ data?: CloudEdition[] }>('/edition?format=audio'),
  ]);

  if (!text?.data?.ayahs?.length) return null;

  const probeAyah = text.data.ayahs[0];
  const verse: ProbeVerse = {
    verse_key: PROBE_VERSE_KEY,
    text_uthmani: probeAyah?.text,
    page_number: probeAyah?.page,
    // AlQuran Cloud provides no tajweed/word/simple/imlaei fields.
  };

  const translationEditions = (translationsEd?.data ?? []).filter((e) => e.format === 'text');
  const audioEditions = (audioEd?.data ?? []).filter((e) => e.format === 'audio');

  return deriveCapabilities({
    provider: 'alquran-cloud',
    verse,
    translationCount: translationEditions.length,
    translationLanguages: distinctLanguages(
      translationEditions.map((e) => ({ language: e.language })),
    ),
    tafsirCount: 0,
    tafsirLanguages: [],
    recitationCount: audioEditions.length,
    ayahAudioAvailable: audioEditions.some((e) => e.type === 'versebyverse'),
    asbabAvailable: false,
    shanENuzoolAvailable: false,
    relatedAyahsAvailable: false,
  });
}

/** Live capability snapshot for the active provider (5-min in-process cache). */
export async function getCapabilities(force = false): Promise<Capabilities> {
  if (!force && cache && cache.expiresAt > Date.now()) return cache.value;

  let value: Capabilities | null = null;
  if (isFoundationConfigured()) {
    value = await probeFoundation();
  }
  if (!value) {
    value = await probeAlquranCloud();
  }
  if (!value) {
    value = emptyCapabilities();
  }

  cache = { value, expiresAt: Date.now() + CACHE_TTL_MS };
  return value;
}

export function clearCapabilityCache(): void {
  cache = null;
}
