import type { ResourceEntry } from '@/lib/types/resource';

/**
 * QuranVoice Resource Registry.
 *
 * This file is the single source of truth for which religious-content
 * resources QuranVoice is allowed to display. Anything not registered
 * here, or registered with `canDisplay: false`, must render an
 * "unavailable" state.
 *
 * The entries below cover well-known open / widely-used Quran data
 * sources. The registry treats their public availability as a claim,
 * not a final legal determination — projects building on QuranVoice
 * should verify licensing for their own jurisdiction before launch.
 */

export const RESOURCE_REGISTRY: ResourceEntry[] = [
  // ─────────────────────────────────────────────────────────────
  // QURAN TEXT
  // ─────────────────────────────────────────────────────────────
  {
    id: 'quran-uthmani-tanzil',
    type: 'quran_text',
    title: 'Quran (Uthmani script)',
    language: 'ar',
    sourceName: 'Tanzil.net via AlQuran Cloud',
    sourceUrl: 'https://alquran.cloud/api',
    licenseStatus: 'verified_allowed_with_attribution',
    canDisplay: true,
    canCache: true,
    canDownload: false,
    canRehost: false,
    attributionRequired: true,
    lastVerifiedAt: '2026-05-30',
  },
  // ─────────────────────────────────────────────────────────────
  // TRANSLATIONS (catalog only — selection happens via service)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'translation-en-sahih-international',
    type: 'translation',
    title: 'Sahih International (English)',
    language: 'en',
    author: 'Sahih International',
    sourceName: 'AlQuran Cloud catalog',
    sourceUrl: 'https://alquran.cloud/editions',
    licenseStatus: 'open_source_claim',
    canDisplay: true,
    canCache: true,
    canDownload: false,
    canRehost: false,
    attributionRequired: true,
  },
  {
    id: 'translation-en-pickthall',
    type: 'translation',
    title: 'Pickthall (English)',
    language: 'en',
    author: 'Marmaduke Pickthall',
    sourceName: 'AlQuran Cloud catalog',
    licenseStatus: 'open_source_claim',
    canDisplay: true,
    canCache: true,
    canDownload: false,
    canRehost: false,
    attributionRequired: true,
  },
  // ─────────────────────────────────────────────────────────────
  // AUDIO RECITATIONS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'audio-ar-alafasy',
    type: 'audio',
    title: 'Mishary Rashid Alafasy — Murattal',
    language: 'ar',
    reciter: 'Mishary Rashid Alafasy',
    sourceName: 'EveryAyah via AlQuran Cloud',
    sourceUrl: 'https://alquran.cloud/cdn',
    licenseStatus: 'open_source_claim',
    canDisplay: true,
    canCache: false,
    canDownload: false,
    canRehost: false,
    attributionRequired: true,
  },
  {
    id: 'audio-ar-husary',
    type: 'audio',
    title: 'Mahmoud Khalil Al-Husary — Murattal',
    language: 'ar',
    reciter: 'Mahmoud Khalil Al-Husary',
    sourceName: 'EveryAyah via AlQuran Cloud',
    licenseStatus: 'open_source_claim',
    canDisplay: true,
    canCache: false,
    canDownload: false,
    canRehost: false,
    attributionRequired: true,
  },
  // ─────────────────────────────────────────────────────────────
  // TAFSIR — NOT YET REGISTERED
  // We deliberately do not register tafsir resources here yet.
  // Until a verified, license-checked tafsir source is added,
  // every tafsir block in the UI renders an unavailable state.
  // ─────────────────────────────────────────────────────────────

  // ─────────────────────────────────────────────────────────────
  // WORD BY WORD — NOT YET REGISTERED
  // ─────────────────────────────────────────────────────────────

  // ─────────────────────────────────────────────────────────────
  // SHAN-E-NUZOOL — review-only source reference
  // The actual entries live in Supabase. Public users see entries
  // only when status='approved'. Raw OCR text from this Archive
  // identifier is NEVER displayed to readers.
  // ─────────────────────────────────────────────────────────────
  {
    id: 'shan-ur-ayaat-qurani-nishapuri',
    type: 'shan_e_nuzool',
    title: 'Ayaat Qurani Kay Shan E Nuzool',
    language: 'ur',
    author: 'Allama Abul Hasan Ali Al Nishapuri',
    sourceName: 'Archive.org (AyaatQuraniKayShanENuzool)',
    sourceUrl: 'https://archive.org/details/AyaatQuraniKayShanENuzool',
    licenseStatus: 'open_source_claim',
    // Reference only — public display happens via Supabase reviewed entries.
    canDisplay: true,
    canCache: true,
    canDownload: false,
    canRehost: false,
    attributionRequired: true,
    notes:
      'Public display is restricted to reviewed entries stored in Supabase. Raw OCR text is never attached to ayahs without review.',
  },
];

export function getResource(id: string): ResourceEntry | undefined {
  return RESOURCE_REGISTRY.find((r) => r.id === id);
}

export function getResourcesByType(type: ResourceEntry['type']): ResourceEntry[] {
  return RESOURCE_REGISTRY.filter((r) => r.type === type && r.canDisplay);
}

export function isResourceDisplayable(id: string): boolean {
  const entry = getResource(id);
  return Boolean(entry?.canDisplay);
}
