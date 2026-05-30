/**
 * TafsirService — server-only.
 *
 * Uses Quran.Foundation when configured (live catalog + per-verse text).
 * Tafsir from the Foundation is treated as verified — source attribution
 * always travels with the entry. When the Foundation is not configured,
 * we fall back to the Resource Registry, which is empty by default, so
 * the UI shows the unavailable state.
 */

import { getResourcesByType } from '@/lib/data/resourceRegistry';
import { foundationFetch } from '@/lib/quran-foundation/client';
import { F } from '@/lib/quran-foundation/endpoints';
import { isFoundationConfigured } from '@/lib/quran-foundation/env';
import type { TafsirEntry, TafsirResource } from '@/lib/types/tafsir';

interface FoundationTafsirResource {
  id: number;
  name: string;
  author_name: string;
  language_name?: string;
  iso?: string;
  language_iso?: string;
  slug?: string;
}

interface FoundationTafsirsResponse {
  tafsirs?: FoundationTafsirResource[];
}

interface FoundationTafsirVerseResponse {
  tafsir?: {
    resource_id: number;
    resource_name: string;
    text: string;
    language_id?: number;
    language_name?: string;
    verses?: Record<string, unknown>;
  };
}

export async function listTafsirs(language = 'en'): Promise<TafsirResource[]> {
  if (isFoundationConfigured()) {
    const json = await foundationFetch<FoundationTafsirsResponse>(
      F.tafsirResources(language),
      { revalidate: 86_400 },
    );
    if (json?.tafsirs?.length) {
      return json.tafsirs.map<TafsirResource>((t) => ({
        id: t.id,
        name: t.name,
        authorName: t.author_name ?? t.name,
        language: t.iso ?? t.language_iso ?? language,
        languageName: t.language_name ?? language,
        source: {
          name: 'Quran.Foundation tafsir catalog',
          url: 'https://api-docs.quran.foundation/',
          verified: true,
        },
      }));
    }
  }

  // Registry fallback (intentionally empty unless explicitly registered).
  const registered = getResourcesByType('tafsir');
  return registered.map<TafsirResource>((r) => ({
    id: r.id,
    name: r.title,
    authorName: r.author ?? 'Unknown',
    language: r.language ?? 'ar',
    languageName: r.language ?? 'Arabic',
    source: {
      name: r.sourceName,
      url: r.sourceUrl,
      license: r.licenseStatus,
      verified: r.canDisplay,
    },
  }));
}

export async function getTafsirForAyah(
  surah: number,
  ayah: number,
  tafsirId?: string | number,
): Promise<TafsirEntry[] | null> {
  if (!Number.isInteger(surah) || !Number.isInteger(ayah)) return null;
  if (!tafsirId) return null;
  if (!isFoundationConfigured()) return null;

  const numericId = String(tafsirId).match(/^\d+$/) ? Number(tafsirId) : null;
  if (numericId === null) return null;

  const verseKey = `${surah}:${ayah}`;
  const json = await foundationFetch<FoundationTafsirVerseResponse>(
    F.tafsirByVerse(numericId, verseKey),
  );
  if (!json?.tafsir) return null;
  return [
    {
      resourceId: numericId,
      book: json.tafsir.resource_name,
      author: json.tafsir.resource_name,
      language: json.tafsir.language_name ?? 'en',
      textHtml: json.tafsir.text,
      source: {
        name: `${json.tafsir.resource_name} via Quran.Foundation`,
        url: 'https://api-docs.quran.foundation/',
        verified: true,
      },
    },
  ];
}
