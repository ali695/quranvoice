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
import { isoFromSlug } from '@/lib/tafsir/spa5k-mappers';
import { isoFromLanguageName, languageName } from '@/lib/utils/languageNames';
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

interface FoundationTafsirItem {
  resource_id?: number;
  resource_name?: string;
  text?: string;
  language_id?: number;
  language_name?: string;
}

interface FoundationTafsirVerseResponse {
  /** Current QF v4 shape: an array under `tafsirs`. */
  tafsirs?: FoundationTafsirItem[];
  /** Legacy/singular shape, kept for resilience. */
  tafsir?: FoundationTafsirItem;
}

export async function listTafsirs(language = 'en'): Promise<TafsirResource[]> {
  if (isFoundationConfigured()) {
    const json = await foundationFetch<FoundationTafsirsResponse>(
      F.tafsirResources(language),
      { revalidate: 86_400 },
    );
    if (json?.tafsirs?.length) {
      return json.tafsirs.map<TafsirResource>((t) => {
        // QF's `?language=` param controls NAME translation, not which tafsirs
        // are returned — so derive each tafsir's REAL content language from its
        // slug prefix ("ur-tafsir-…", "ar-…"), else iso, else language_name.
        const iso =
          isoFromSlug(t.slug ?? '') ||
          (t.iso ?? t.language_iso ?? '').toLowerCase() ||
          isoFromLanguageName(t.language_name) ||
          'ar';
        return {
          id: t.id,
          name: t.name,
          authorName: t.author_name ?? t.name,
          language: iso,
          languageName: t.language_name ?? languageName(iso),
          source: {
            name: 'Quran.Foundation tafsir catalog',
            url: 'https://api-docs.quran.foundation/',
            verified: true,
          },
        };
      });
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
  // QF v4 returns the content under `tafsirs[0].text`; tolerate the singular
  // legacy shape too. The item carries no resource name, so resolve it from
  // the catalog by id.
  const item = json?.tafsirs?.[0] ?? json?.tafsir;
  const text = item?.text?.trim();
  if (!text) return null;

  const catalog = await listTafsirs('en');
  const meta = catalog.find((r) => String(r.id) === String(numericId));
  const book = meta?.name ?? item?.resource_name ?? `Tafsir ${numericId}`;

  return [
    {
      resourceId: numericId,
      book,
      author: meta?.authorName ?? item?.resource_name ?? book,
      language: meta?.language ?? item?.language_name ?? 'ar',
      textHtml: text,
      source: {
        name: `${book} via Quran.Foundation`,
        url: 'https://api-docs.quran.foundation/',
        verified: true,
      },
    },
  ];
}
