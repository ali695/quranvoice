/**
 * Pure mappers from raw Quran.Foundation resource JSON → typed shapes.
 *
 * Kept side-effect free so both the capability service and the resource
 * services can share one normalization path. No network, no env reads.
 */

import type { TranslationResource } from '@/lib/types/translation';
import type { TafsirResource } from '@/lib/types/tafsir';
import type { Reciter } from '@/lib/types/audio';

const FOUNDATION_SOURCE = {
  name: 'Quran.Foundation',
  url: 'https://api-docs.quran.foundation/',
  verified: true,
} as const;

export interface RawFoundationTranslation {
  id: number;
  name: string;
  author_name?: string;
  language_name?: string;
  iso?: string;
  language_iso?: string;
  translated_name?: { name?: string };
}

export interface RawFoundationTafsir {
  id: number;
  name: string;
  author_name?: string;
  language_name?: string;
  iso?: string;
  language_iso?: string;
  slug?: string;
}

export interface RawFoundationRecitation {
  id: number;
  reciter_name: string;
  style?: string;
  translated_name?: { name?: string };
}

export interface RawFoundationLanguage {
  id?: number;
  name?: string;
  iso_code?: string;
  native_name?: string;
  direction?: string;
  translations_count?: number;
}

/** Normalize a translation resource ISO from the several keys QF uses. */
function translationIso(t: RawFoundationTranslation, fallback: string): string {
  return (t.iso || t.language_iso || t.language_name || fallback).toLowerCase();
}

export function mapTranslationResources(
  raw: RawFoundationTranslation[] | undefined,
  fallbackLang = 'en',
): TranslationResource[] {
  if (!raw?.length) return [];
  return raw.map<TranslationResource>((t) => {
    const iso = translationIso(t, fallbackLang);
    return {
      id: t.id,
      name: t.name,
      authorName: t.author_name ?? t.name,
      language: iso,
      languageName: t.language_name ?? iso,
      languageIso: iso,
      source: { ...FOUNDATION_SOURCE, name: 'Quran.Foundation translations catalog' },
    };
  });
}

export function mapTafsirResources(
  raw: RawFoundationTafsir[] | undefined,
  fallbackLang = 'en',
): TafsirResource[] {
  if (!raw?.length) return [];
  return raw.map<TafsirResource>((t) => {
    const iso = (t.iso || t.language_iso || fallbackLang).toLowerCase();
    return {
      id: t.id,
      name: t.name,
      authorName: t.author_name ?? t.name,
      language: iso,
      languageName: t.language_name ?? iso,
      source: { ...FOUNDATION_SOURCE, name: 'Quran.Foundation tafsir catalog' },
    };
  });
}

export function mapRecitationResources(
  raw: RawFoundationRecitation[] | undefined,
): Reciter[] {
  if (!raw?.length) return [];
  return raw.map<Reciter>((r) => ({
    id: String(r.id),
    name: r.reciter_name,
    style: r.style,
    hasSurahAudio: true,
    hasAyahAudio: true,
    source: { ...FOUNDATION_SOURCE, name: 'Quran.Foundation recitations catalog' },
  }));
}

/** Distinct, sorted ISO-639 language codes present in a resource list. */
export function distinctLanguages(
  resources: Array<{ languageIso?: string; language?: string }>,
): string[] {
  const set = new Set<string>();
  for (const r of resources) {
    const iso = (r.languageIso ?? r.language ?? '').toLowerCase().trim();
    if (iso) set.add(iso);
  }
  return Array.from(set).sort();
}
