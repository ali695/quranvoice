/**
 * Capability types.
 *
 * A "capability" is a feature QuranVoice can expose ONLY because a real,
 * verified data source actually provides it. Capabilities are derived from
 * live API probes (see `lib/services/capability.service.ts`) — never
 * hardcoded to `true`. Where a feature genuinely lacks a verified data set
 * (e.g. faked Tajweed coloring or invented Mushaf line breaks), the flag is
 * `false` and the UI shows a source-aware "requires verified data" state
 * instead of an opaque "locked" badge.
 */

/** Why a capability is in its current state — drives the UI helper text. */
export type CapabilityReasonCode =
  | 'available'
  | 'provider_field_present'
  | 'provider_field_absent'
  | 'no_resources'
  | 'requires_verified_data'
  | 'requires_reviewed_source'
  | 'provider_unconfigured'
  | 'probe_failed';

export interface CapabilityFlag {
  /** Whether the feature can be shown right now. */
  available: boolean;
  /** Machine-readable reason, used to pick localized helper copy. */
  reason: CapabilityReasonCode;
  /** Optional human-readable detail (provider/source name, counts). */
  detail?: string;
}

/**
 * The full capability snapshot for the active content provider.
 * Mirrors the shape requested in the spec, expanded with per-script flags.
 */
export interface Capabilities {
  /** Active content provider that produced these flags. */
  provider: 'foundation' | 'alquran-cloud' | 'none';

  // ── Quran text & scripts ─────────────────────────────────────────
  hasQuranText: boolean;
  hasUthmaniText: boolean;
  hasUthmaniSimple: boolean;
  hasImlaei: boolean;
  /** Real Tajweed markup from the provider (e.g. text_uthmani_tajweed). */
  hasTajweed: boolean;

  // ── Translations / Tafsir ────────────────────────────────────────
  hasTranslations: boolean;
  translationCount: number;
  /** ISO-639 codes for which at least one translation resource exists. */
  translationLanguages: string[];
  hasTafsirs: boolean;
  tafsirCount: number;
  tafsirLanguages: string[];
  /** Quran.Foundation tafsir resources exist (primary source). */
  hasQuranFoundationTafsirs: boolean;
  /** spa5k fallback tafsir editions exist (secondary source). */
  hasFallbackTafsirs: boolean;
  fallbackTafsirEditionCount: number;
  fallbackTafsirLanguages: string[];

  // ── Audio ────────────────────────────────────────────────────────
  hasRecitations: boolean;
  hasAudio: boolean;
  recitationCount: number;
  /** Per-ayah audio files (vs surah-only) are available. */
  hasAyahAudio: boolean;

  // ── Word by word ─────────────────────────────────────────────────
  hasWordByWord: boolean;
  hasWordTranslation: boolean;
  hasWordTransliteration: boolean;

  // ── Mushaf layout ────────────────────────────────────────────────
  /** Page metadata (page_number per verse) exists → page-by-page mushaf. */
  hasMushafPages: boolean;
  hasMushafLineBreaks8: boolean;
  hasMushafLineBreaks12: boolean;
  /** 15-line Madani (KFGQPC) printed-page line data is available. */
  hasMushafLineBreaks15: boolean;
  /** 16-line Indo-Pak printed-page line data is available. */
  hasMushafLineBreaks16: boolean;

  // ── Review-gated / mapping features ──────────────────────────────
  hasAsbab: boolean;
  hasShanENuzool: boolean;
  hasRelatedAyahs: boolean;

  /** Detailed per-feature flags (reason + detail) for richer UI copy. */
  flags: {
    quranText: CapabilityFlag;
    uthmani: CapabilityFlag;
    uthmaniSimple: CapabilityFlag;
    imlaei: CapabilityFlag;
    tajweed: CapabilityFlag;
    translations: CapabilityFlag;
    tafsirs: CapabilityFlag;
    recitations: CapabilityFlag;
    wordByWord: CapabilityFlag;
    mushafPages: CapabilityFlag;
    mushafLineBreaks8: CapabilityFlag;
    mushafLineBreaks12: CapabilityFlag;
    mushafLineBreaks15: CapabilityFlag;
    mushafLineBreaks16: CapabilityFlag;
    asbab: CapabilityFlag;
    shanENuzool: CapabilityFlag;
    relatedAyahs: CapabilityFlag;
  };

  /** Epoch ms the snapshot was produced (clients may use for cache hints). */
  generatedAt: number;
}
