/**
 * Quran Themes catalog — theme cards that link into the Topics index.
 *
 * Each theme entry exists only as a navigation card. The mapping from
 * theme → ayahs is NOT hardcoded here; it requires a verified topic-to-
 * ayah index. Until that index is connected (e.g. via Quran.Foundation
 * topic resources or a reviewed local index), the theme detail page
 * shows a "verified mapping pending" state instead of approximations.
 */

import type { LearningItem } from '@/lib/types/learning';
import { SRC_EDITORIAL } from './sources';

export interface QuranTheme extends LearningItem {
  /** Topic slug used by /topics/[slug] */
  topicSlug: string;
}

export const QURAN_THEMES: QuranTheme[] = [
  { id: 'th-mercy',       slug: 'mercy',       topicSlug: 'mercy',       type: 'theme', title: 'Mercy',       language: 'en', sourceStatus: 'needs_source', reviewStatus: 'approved', sourceRefs: [SRC_EDITORIAL] },
  { id: 'th-patience',    slug: 'patience',    topicSlug: 'patience',    type: 'theme', title: 'Patience',    language: 'en', sourceStatus: 'needs_source', reviewStatus: 'approved', sourceRefs: [SRC_EDITORIAL] },
  { id: 'th-tawheed',     slug: 'tawheed',     topicSlug: 'tawheed',     type: 'theme', title: 'Tawḥīd',      language: 'en', sourceStatus: 'needs_source', reviewStatus: 'approved', sourceRefs: [SRC_EDITORIAL] },
  { id: 'th-prayer',      slug: 'prayer',      topicSlug: 'prayer',      type: 'theme', title: 'Prayer',      language: 'en', sourceStatus: 'needs_source', reviewStatus: 'approved', sourceRefs: [SRC_EDITORIAL] },
  { id: 'th-forgiveness', slug: 'forgiveness', topicSlug: 'forgiveness', type: 'theme', title: 'Forgiveness', language: 'en', sourceStatus: 'needs_source', reviewStatus: 'approved', sourceRefs: [SRC_EDITORIAL] },
  { id: 'th-jannah',      slug: 'jannah',      topicSlug: 'jannah',      type: 'theme', title: 'Jannah',      language: 'en', sourceStatus: 'needs_source', reviewStatus: 'approved', sourceRefs: [SRC_EDITORIAL] },
  { id: 'th-jahannam',    slug: 'jahannam',    topicSlug: 'jannah',      type: 'theme', title: 'Jahannam',    language: 'en', sourceStatus: 'needs_source', reviewStatus: 'approved', sourceRefs: [SRC_EDITORIAL] },
  { id: 'th-family',      slug: 'family',      topicSlug: 'family',      type: 'theme', title: 'Family',      language: 'en', sourceStatus: 'needs_source', reviewStatus: 'approved', sourceRefs: [SRC_EDITORIAL] },
  { id: 'th-charity',     slug: 'charity',     topicSlug: 'charity',     type: 'theme', title: 'Charity',     language: 'en', sourceStatus: 'needs_source', reviewStatus: 'approved', sourceRefs: [SRC_EDITORIAL] },
  { id: 'th-knowledge',   slug: 'knowledge',   topicSlug: 'mercy',       type: 'theme', title: 'Knowledge',   language: 'en', sourceStatus: 'needs_source', reviewStatus: 'approved', sourceRefs: [SRC_EDITORIAL] },
  { id: 'th-gratitude',   slug: 'gratitude',   topicSlug: 'mercy',       type: 'theme', title: 'Gratitude',   language: 'en', sourceStatus: 'needs_source', reviewStatus: 'approved', sourceRefs: [SRC_EDITORIAL] },
  { id: 'th-repentance',  slug: 'repentance',  topicSlug: 'forgiveness', type: 'theme', title: 'Repentance',  language: 'en', sourceStatus: 'needs_source', reviewStatus: 'approved', sourceRefs: [SRC_EDITORIAL] },
  { id: 'th-prophets',    slug: 'prophets',    topicSlug: 'prophets',    type: 'theme', title: 'Prophets',    language: 'en', sourceStatus: 'needs_source', reviewStatus: 'approved', sourceRefs: [SRC_EDITORIAL] },
  { id: 'th-justice',     slug: 'justice',     topicSlug: 'mercy',       type: 'theme', title: 'Justice',     language: 'en', sourceStatus: 'needs_source', reviewStatus: 'approved', sourceRefs: [SRC_EDITORIAL] },
  { id: 'th-sabr',        slug: 'sabr',        topicSlug: 'patience',    type: 'theme', title: 'Sabr',        language: 'en', sourceStatus: 'needs_source', reviewStatus: 'approved', sourceRefs: [SRC_EDITORIAL] },
  { id: 'th-taqwa',       slug: 'taqwa',       topicSlug: 'tawheed',     type: 'theme', title: 'Taqwā',       language: 'en', sourceStatus: 'needs_source', reviewStatus: 'approved', sourceRefs: [SRC_EDITORIAL] },
];
