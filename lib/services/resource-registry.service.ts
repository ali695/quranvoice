/**
 * Resource-registry service — server-only.
 *
 * Aggregates live status from upstream providers + the static
 * `lib/data/resourceRegistry.ts` (which is the gate for displayable
 * religious content). Powers `/api/quran/resources`, the homepage
 * stats strip, and `/sources` disclosure pages.
 */

import { foundationFetch } from '@/lib/quran-foundation/client';
import { F } from '@/lib/quran-foundation/endpoints';
import { isFoundationConfigured } from '@/lib/quran-foundation/env';
import { RESOURCE_REGISTRY } from '@/lib/data/resourceRegistry';
import { getSearchScopeStatus } from './searchService';

export interface ResourcesSummary {
  health: {
    foundationConfigured: boolean;
    foundationOk: boolean;
    searchScopeEnabled: boolean;
  };
  counts: {
    chapters: number;
    translations: number;
    tafsirs: number;
    recitations: number;
    languages: number;
  };
  defaults: {
    translation: string | number | null;
    tafsir: string | number | null;
    reciter: string | null;
  };
  registry: {
    quranTextSourceName: string;
    shanENuzoolSourceStatus: 'verified_review_only' | 'unverified' | 'not_registered';
  };
}

interface ChaptersResponse {
  chapters?: Array<unknown>;
}
interface TranslationsResponse {
  translations?: Array<unknown>;
}
interface TafsirsResponse {
  tafsirs?: Array<unknown>;
}
interface RecitationsResponse {
  recitations?: Array<unknown>;
}
interface LanguagesResponse {
  languages?: Array<unknown>;
}

export async function getResourcesSummary(): Promise<ResourcesSummary> {
  const configured = isFoundationConfigured();
  let foundationOk = false;
  const counts = { chapters: 114, translations: 0, tafsirs: 0, recitations: 0, languages: 0 };

  if (configured) {
    const [chapters, translations, tafsirs, recitations, languages] = await Promise.all([
      foundationFetch<ChaptersResponse>(F.chapters(), { revalidate: 86_400 }),
      foundationFetch<TranslationsResponse>(F.translationResources('en'), { revalidate: 86_400 }),
      foundationFetch<TafsirsResponse>(F.tafsirResources('en'), { revalidate: 86_400 }),
      foundationFetch<RecitationsResponse>(F.recitationResources(), { revalidate: 86_400 }),
      foundationFetch<LanguagesResponse>(F.languages(), { revalidate: 86_400 }),
    ]);
    foundationOk = Boolean(chapters?.chapters?.length);
    counts.chapters = chapters?.chapters?.length ?? 114;
    counts.translations = translations?.translations?.length ?? 0;
    counts.tafsirs = tafsirs?.tafsirs?.length ?? 0;
    counts.recitations = recitations?.recitations?.length ?? 0;
    counts.languages = languages?.languages?.length ?? 0;
  }

  let searchScopeEnabled = false;
  try {
    searchScopeEnabled = (await getSearchScopeStatus()).available;
  } catch {
    searchScopeEnabled = false;
  }

  // Shan-e-Nuzool source status — never exposes pending entries.
  // The registered Archive.org source acts as a review reference only.
  // When the Supabase tables contain >0 approved entries, callers can detect
  // it via the dedicated /api/shan-e-nuzool route.
  const shanRegistry = RESOURCE_REGISTRY.find((r) => r.type === 'shan_e_nuzool');
  const registryShanStatus: ResourcesSummary['registry']['shanENuzoolSourceStatus'] =
    !shanRegistry ? 'verified_review_only' : shanRegistry.canDisplay ? 'verified_review_only' : 'unverified';

  return {
    health: { foundationConfigured: configured, foundationOk, searchScopeEnabled },
    counts,
    defaults: {
      translation: 131, // Quran.Foundation: Saheeh International (id 131) — picked when configured
      tafsir: null,
      reciter: null,
    },
    registry: {
      quranTextSourceName: configured
        ? 'Quran.Foundation Uthmani text'
        : 'Tanzil.net via AlQuran Cloud',
      shanENuzoolSourceStatus: registryShanStatus,
    },
  };
}
