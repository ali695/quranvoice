/**
 * Pure derivation of {@link Capabilities} from raw probe data.
 *
 * No network here — `capability.service.ts` gathers the inputs and calls
 * `deriveCapabilities`. Keeping this pure makes the rules easy to reason
 * about and test, and guarantees a flag is `true` only because a real field
 * or resource was actually present in a provider response.
 */

import type {
  Capabilities,
  CapabilityFlag,
  CapabilityReasonCode,
} from '@/lib/types/capability';

/** Shape of a probed Quran.Foundation word (subset we read). */
export interface ProbeWord {
  char_type_name?: string;
  text_uthmani?: string;
  text?: string;
  page_number?: number;
  line_number?: number;
  translation?: { text?: string } | null;
  transliteration?: { text?: string } | null;
}

/** Shape of a probed verse (subset we read). */
export interface ProbeVerse {
  verse_key?: string;
  text_uthmani?: string;
  text_uthmani_simple?: string;
  text_imlaei?: string;
  text_uthmani_tajweed?: string;
  page_number?: number;
  words?: ProbeWord[];
}

export interface CapabilityProbeInput {
  provider: Capabilities['provider'];
  /** Verse 2:255 probed with a rich field set + words; null if it failed. */
  verse: ProbeVerse | null;
  translationCount: number;
  translationLanguages: string[];
  tafsirCount: number;
  tafsirLanguages: string[];
  recitationCount: number;
  /** True when a per-ayah audio file was actually returned for the probe. */
  ayahAudioAvailable: boolean;
  /** Review-gated / mapping features resolved by their own services. */
  asbabAvailable: boolean;
  shanENuzoolAvailable: boolean;
  relatedAyahsAvailable: boolean;
}

function flag(
  available: boolean,
  reason: CapabilityReasonCode,
  detail?: string,
): CapabilityFlag {
  return detail ? { available, reason, detail } : { available, reason };
}

function nonEmpty(s?: string | null): boolean {
  return typeof s === 'string' && s.trim().length > 0;
}

/** Tajweed markup must actually contain rule annotations, not plain text. */
function looksLikeTajweed(s?: string): boolean {
  return nonEmpty(s) && /<tajweed\b|class=["']?(ham_wasl|laam_shamsiyah|madda|ghunnah|qalqalah|idgham|ikhafa|tajweed)/i.test(s!);
}

export function deriveCapabilities(input: CapabilityProbeInput): Capabilities {
  const v = input.verse;
  const providerConfigured = input.provider !== 'none';

  const uthmani = nonEmpty(v?.text_uthmani);
  const uthmaniSimple = nonEmpty(v?.text_uthmani_simple);
  const imlaei = nonEmpty(v?.text_imlaei);
  const tajweed = looksLikeTajweed(v?.text_uthmani_tajweed);

  const words = (v?.words ?? []).filter((w) => (w.char_type_name ?? 'word') === 'word');
  const wordByWord = words.length > 0 && words.some((w) => nonEmpty(w.text_uthmani) || nonEmpty(w.text));
  const wordTranslation = words.some((w) => nonEmpty(w.translation?.text));
  const wordTransliteration = words.some((w) => nonEmpty(w.transliteration?.text));

  const mushafPages =
    typeof v?.page_number === 'number' && v.page_number > 0;

  const translations = input.translationCount > 0;
  const tafsirs = input.tafsirCount > 0;
  const recitations = input.recitationCount > 0;

  // Page metadata exists generically, but distinct 8/12/16-line break
  // datasets are NOT exposed by the general content API. We never invent
  // line breaks — these stay false until a verified per-line dataset is
  // wired, and the UI explains exactly that.
  const lineBreakFlag = (n: number): CapabilityFlag =>
    flag(false, 'requires_verified_data', `Verified ${n}-line per-page Mushaf data is not connected.`);

  const noProvider = (): CapabilityFlag =>
    flag(false, 'provider_unconfigured', 'No content provider is configured.');
  const fieldAbsent = (label: string): CapabilityFlag =>
    flag(false, 'provider_field_absent', `${label} is not provided by the active source.`);

  return {
    provider: input.provider,

    hasQuranText: uthmani || uthmaniSimple || imlaei,
    hasUthmaniText: uthmani,
    hasUthmaniSimple: uthmaniSimple,
    hasImlaei: imlaei,
    hasTajweed: tajweed,

    hasTranslations: translations,
    translationCount: input.translationCount,
    translationLanguages: input.translationLanguages,
    hasTafsirs: tafsirs,
    tafsirCount: input.tafsirCount,
    tafsirLanguages: input.tafsirLanguages,

    hasRecitations: recitations,
    hasAudio: recitations,
    recitationCount: input.recitationCount,
    hasAyahAudio: input.ayahAudioAvailable,

    hasWordByWord: wordByWord,
    hasWordTranslation: wordTranslation,
    hasWordTransliteration: wordTransliteration,

    hasMushafPages: mushafPages,
    hasMushafLineBreaks8: false,
    hasMushafLineBreaks12: false,
    hasMushafLineBreaks16: false,

    hasAsbab: input.asbabAvailable,
    hasShanENuzool: input.shanENuzoolAvailable,
    hasRelatedAyahs: input.relatedAyahsAvailable,

    flags: {
      quranText: uthmani || uthmaniSimple || imlaei
        ? flag(true, 'available', input.provider === 'foundation' ? 'Quran.Foundation' : 'AlQuran Cloud')
        : providerConfigured ? flag(false, 'probe_failed', 'Quran text probe returned no data.') : noProvider(),
      uthmani: uthmani ? flag(true, 'provider_field_present', 'text_uthmani') : fieldAbsent('Uthmani text'),
      uthmaniSimple: uthmaniSimple ? flag(true, 'provider_field_present', 'text_uthmani_simple') : fieldAbsent('Simplified Uthmani'),
      imlaei: imlaei ? flag(true, 'provider_field_present', 'text_imlaei') : fieldAbsent('Imlaei script'),
      tajweed: tajweed
        ? flag(true, 'provider_field_present', 'text_uthmani_tajweed')
        : flag(false, 'requires_verified_data', 'Verified Tajweed rule data is not provided by the active source.'),
      translations: translations
        ? flag(true, 'available', `${input.translationCount} translation resources, ${input.translationLanguages.length} languages`)
        : (providerConfigured ? flag(false, 'no_resources', 'No translation resources returned.') : noProvider()),
      tafsirs: tafsirs
        ? flag(true, 'available', `${input.tafsirCount} tafsir resources, ${input.tafsirLanguages.length} languages`)
        : (providerConfigured ? flag(false, 'no_resources', 'No tafsir resources returned.') : noProvider()),
      recitations: recitations
        ? flag(true, 'available', `${input.recitationCount} reciters`)
        : (providerConfigured ? flag(false, 'no_resources', 'No recitation resources returned.') : noProvider()),
      wordByWord: wordByWord
        ? flag(true, 'available', `${words.length} words${wordTranslation ? ' + translation' : ''}${wordTransliteration ? ' + transliteration' : ''}`)
        : flag(false, 'provider_field_absent', 'Word-by-word data is not provided by the active source.'),
      mushafPages: mushafPages
        ? flag(true, 'available', 'page_number metadata present')
        : fieldAbsent('Mushaf page metadata'),
      mushafLineBreaks8: lineBreakFlag(8),
      mushafLineBreaks12: lineBreakFlag(12),
      mushafLineBreaks16: lineBreakFlag(16),
      asbab: input.asbabAvailable
        ? flag(true, 'available', 'Reviewed Supabase entry')
        : flag(false, 'requires_reviewed_source', 'Awaiting a reviewed Asbab al-Nuzul entry.'),
      shanENuzool: input.shanENuzoolAvailable
        ? flag(true, 'available', 'Reviewed Supabase entry')
        : flag(false, 'requires_reviewed_source', 'Awaiting a reviewed Shan-e-Nuzool entry.'),
      relatedAyahs: input.relatedAyahsAvailable
        ? flag(true, 'available', 'Verified topic index')
        : flag(false, 'requires_verified_data', 'A verified topic index is not connected yet.'),
    },

    generatedAt: Date.now(),
  };
}

/** Capability snapshot for when no provider is configured at all. */
export function emptyCapabilities(): Capabilities {
  return deriveCapabilities({
    provider: 'none',
    verse: null,
    translationCount: 0,
    translationLanguages: [],
    tafsirCount: 0,
    tafsirLanguages: [],
    recitationCount: 0,
    ayahAudioAvailable: false,
    asbabAvailable: false,
    shanENuzoolAvailable: false,
    relatedAyahsAvailable: false,
  });
}
