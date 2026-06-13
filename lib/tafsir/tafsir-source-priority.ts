/**
 * Tafsir source priority + labels (client-safe — no network/server imports).
 *
 * Resolution order (highest first):
 *   1. Quran.Foundation selected tafsir
 *   2. Quran.Foundation default tafsir (for the language)
 *   3. spa5k fallback selected edition
 *   4. spa5k fallback default edition (for the language)
 *   5. clean unavailable state
 */

import type { NormalizedTafsir, TafsirProvider } from '@/lib/types/tafsir';

export const TAFSIR_PRIORITY = [
  'quran_foundation_selected',
  'quran_foundation_default',
  'spa5k_selected',
  'spa5k_default',
  'unavailable',
] as const;

export type TafsirResolutionStep = (typeof TAFSIR_PRIORITY)[number];

export function providerLabel(provider: TafsirProvider): string {
  return provider === 'quran_foundation' ? 'Quran.Foundation' : 'Fallback Tafsir API';
}

/** "Source: Quran.Foundation · Tafsir Ibn Kathir" */
export function tafsirSourceLabel(t: Pick<NormalizedTafsir, 'provider' | 'editionName'>): string {
  return `Source: ${providerLabel(t.provider)} · ${t.editionName}`;
}

/** A tafsir id is a Quran.Foundation resource when it's purely numeric. */
export function isQuranFoundationId(id: string | number | null | undefined): boolean {
  return id != null && /^\d+$/.test(String(id));
}

/** A tafsir id is a fallback edition when it looks like a slug (has letters/dashes). */
export function isFallbackSlug(id: string | number | null | undefined): boolean {
  return id != null && /^[a-z]/i.test(String(id)) && !/^\d+$/.test(String(id));
}
