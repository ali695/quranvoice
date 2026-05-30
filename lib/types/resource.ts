/**
 * Resource Registry: every piece of religious content shown by
 * QuranVoice must originate from a registered, verified resource.
 * If a resource is not registered (or its `canDisplay` flag is false),
 * the UI must render an "unavailable" state instead.
 */

export type ResourceType =
  | 'quran_text'
  | 'translation'
  | 'tafsir'
  | 'audio'
  | 'word_by_word'
  | 'asbab_al_nuzul'
  | 'shan_e_nuzul'
  | 'shan_e_nuzool'
  | 'topics'
  | 'learning_content';

export type LicenseStatus =
  | 'verified_open'
  | 'verified_allowed_with_attribution'
  | 'needs_permission'
  | 'open_source_claim'
  | 'unknown';

export interface ResourceEntry {
  id: string;
  type: ResourceType;
  title: string;
  language?: string;
  author?: string;
  reciter?: string;
  sourceName: string;
  sourceUrl?: string;
  licenseStatus: LicenseStatus;
  canDisplay: boolean;
  canCache: boolean;
  canDownload: boolean;
  canRehost: boolean;
  attributionRequired: boolean;
  /** ISO date the registry maintainers last verified this entry */
  lastVerifiedAt?: string;
  notes?: string;
}
