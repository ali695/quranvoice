/**
 * QuranVoice Learning content types.
 *
 * Every learning item carries a `sourceStatus` and a list of `sourceRefs`.
 * The UI must respect these — items without `sourceStatus = 'verified'`
 * AND `reviewStatus = 'approved'` render in an unavailable / pending state
 * rather than as confirmed religious content.
 */

export type LearningItemType =
  | 'guide'
  | 'name_of_allah'
  | 'prophet_name'
  | 'story'
  | 'dua'
  | 'reflection'
  | 'vocabulary'
  | 'theme'
  | 'tajweed'
  | 'seerah'
  | 'hadith';

export type SourceStatus =
  | 'verified'           // source is connected and confirmed
  | 'needs_source'       // intentionally awaiting a verified source
  | 'review_pending'     // a candidate source exists but hasn't been reviewed
  | 'not_connected';     // no source registered

export type ReviewStatus = 'approved' | 'pending' | 'rejected';

export type SourceType =
  | 'quran'
  | 'tafsir'
  | 'hadith'
  | 'seerah'
  | 'scholarly_reference'
  | 'manual_review';

export type LicenseStatus = 'verified_allowed' | 'unknown' | 'needs_permission';

export interface SourceReference {
  id: string;
  sourceType: SourceType;
  title: string;
  author?: string;
  /** External URL to the source */
  url?: string;
  /** Reference string, e.g. "Quran 59:22" or "Sahih al-Bukhari 7392" */
  reference?: string;
  licenseStatus: LicenseStatus;
}

export interface LearningItem {
  id: string;
  slug: string;
  type: LearningItemType;
  title: string;
  /** Native-script title where relevant (e.g. Arabic name of Allah) */
  titleArabic?: string;
  transliteration?: string;
  subtitle?: string;
  /** UI language this item's *metadata* is written in. The source content
   *  is whatever the source provided — never auto-translated. */
  language: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  sourceStatus: SourceStatus;
  reviewStatus: ReviewStatus;
  sourceRefs: SourceReference[];
  /** Verse keys ("2:255") this item points at */
  relatedVerseKeys?: string[];
  /** Surah numbers most directly associated with the item */
  relatedSurahs?: number[];
  /** Short tag list for filtering (mercy, family, taqwa, …) */
  tags?: string[];
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lessonCount: number;
  estimatedMinutes: number;
  sourceStatus: SourceStatus;
  /** Slugs into the category routes inside /learn */
  itemSlugs: string[];
}

export interface LearningCategory {
  slug: string;
  title: string;
  description: string;
  icon: string;
  sourceStatus: SourceStatus;
  /** Hint for visual layout */
  pattern?: 'star' | 'arabesque' | 'lines';
  /** Optional explicit href when the slug doesn't match the route */
  href?: string;
}
