/**
 * Centralized Quran.Foundation content API endpoint paths.
 *
 * The base path for the content API is `/content/api/v4`. Endpoints below
 * are relative — the client prefixes them with QURAN_FOUNDATION_API_BASE_URL.
 */

export const FOUNDATION_BASE_PATH = '/content/api/v4';

export const F = {
  /** GET — list of all chapters (surahs) */
  chapters: () => `${FOUNDATION_BASE_PATH}/chapters`,
  /** GET — single chapter by id */
  chapter: (chapterId: number) => `${FOUNDATION_BASE_PATH}/chapters/${chapterId}`,
  /** GET — chapter info (description, language-specific) */
  chapterInfo: (chapterId: number, language = 'en') =>
    `${FOUNDATION_BASE_PATH}/chapters/${chapterId}/info?language=${language}`,
  /** GET — verses of a chapter, paginated server-side */
  versesByChapter: (chapterId: number, qs = '') =>
    `${FOUNDATION_BASE_PATH}/verses/by_chapter/${chapterId}${qs ? `?${qs}` : ''}`,
  /** GET — single verse by verse_key like "2:255" */
  verseByKey: (verseKey: string, qs = '') =>
    `${FOUNDATION_BASE_PATH}/verses/by_key/${encodeURIComponent(verseKey)}${qs ? `?${qs}` : ''}`,
  /**
   * GET — capability probe for a verse. Requests every script field plus
   * word-level data so the capability service can detect, from real
   * responses, which features the active source actually supports.
   */
  verseCapabilityProbe: (verseKey: string) =>
    `${FOUNDATION_BASE_PATH}/verses/by_key/${encodeURIComponent(verseKey)}?` +
    'fields=text_uthmani,text_uthmani_simple,text_imlaei,text_uthmani_tajweed,page_number&' +
    'words=true&word_fields=text_uthmani,page_number,line_number',
  /**
   * GET — a verse with full word-by-word data (Arabic, transliteration,
   * translation, root/lemma where the source provides it).
   */
  verseWords: (verseKey: string, language = 'en') =>
    `${FOUNDATION_BASE_PATH}/verses/by_key/${encodeURIComponent(verseKey)}?` +
    'words=true&' +
    `word_fields=text_uthmani,text_indopak,transliteration,translation&` +
    `word_translation_language=${language}&fields=text_uthmani`,
  /** GET — verses of a juz */
  versesByJuz: (juz: number, qs = '') =>
    `${FOUNDATION_BASE_PATH}/verses/by_juz/${juz}${qs ? `?${qs}` : ''}`,
  /** GET — verses of a mushaf page */
  versesByPage: (page: number, qs = '') =>
    `${FOUNDATION_BASE_PATH}/verses/by_page/${page}${qs ? `?${qs}` : ''}`,
  /**
   * GET — a mushaf page with per-word line layout. `mushaf` selects the
   * physical layout (1 = 15-line Madani / KFGQPC, 7 = 16-line Indo-Pak).
   * `line_number` is the real printed line for each word.
   */
  mushafPage: (page: number, mushaf: number) =>
    `${FOUNDATION_BASE_PATH}/verses/by_page/${page}?` +
    `mushaf=${mushaf}&per_page=300&words=true&` +
    `word_fields=text_uthmani,char_type_name,line_number,page_number&` +
    `fields=text_uthmani,page_number,juz_number`,
  /** GET — verses of a hizb */
  versesByHizb: (hizb: number, qs = '') =>
    `${FOUNDATION_BASE_PATH}/verses/by_hizb/${hizb}${qs ? `?${qs}` : ''}`,
  /** GET — verses of a rub */
  versesByRub: (rub: number, qs = '') =>
    `${FOUNDATION_BASE_PATH}/verses/by_rub/${rub}${qs ? `?${qs}` : ''}`,
  /** GET — translation resources catalog */
  translationResources: (language = 'en') =>
    `${FOUNDATION_BASE_PATH}/resources/translations?language=${language}`,
  /** GET — translation by id for a verse_key */
  translationByVerse: (translationId: string | number, verseKey: string) =>
    `${FOUNDATION_BASE_PATH}/quran/translations/${translationId}?verse_key=${encodeURIComponent(verseKey)}`,
  /** GET — translation by id for a chapter */
  translationByChapter: (translationId: string | number, chapterId: number) =>
    `${FOUNDATION_BASE_PATH}/quran/translations/${translationId}?chapter_number=${chapterId}`,
  /** GET — tafsir resources catalog */
  tafsirResources: (language = 'en') =>
    `${FOUNDATION_BASE_PATH}/resources/tafsirs?language=${language}`,
  /** GET — tafsir for a verse */
  tafsirByVerse: (tafsirId: string | number, verseKey: string) =>
    `${FOUNDATION_BASE_PATH}/quran/tafsirs/${tafsirId}?verse_key=${encodeURIComponent(verseKey)}`,
  /** GET — recitation resources catalog */
  recitationResources: () => `${FOUNDATION_BASE_PATH}/resources/recitations`,
  /** GET — chapter-level audio file for a recitation */
  audioForChapter: (recitationId: string | number, chapterId: number) =>
    `${FOUNDATION_BASE_PATH}/chapter_recitations/${recitationId}/${chapterId}`,
  /** GET — per-ayah audio files for a recitation across a chapter */
  ayahAudioForChapter: (recitationId: string | number, chapterId: number) =>
    `${FOUNDATION_BASE_PATH}/recitations/${recitationId}/by_chapter/${chapterId}`,
  /** GET — single verse audio */
  ayahAudioForVerse: (recitationId: string | number, verseKey: string) =>
    `${FOUNDATION_BASE_PATH}/recitations/${recitationId}/by_ayah/${encodeURIComponent(verseKey)}`,
  /**
   * GET — a verse with its recitation audio + word-level segment timing.
   * The verse's `audio.segments` are [segIdx, wordPos, startMs, endMs].
   */
  verseWithAudio: (verseKey: string, recitationId: number) =>
    `${FOUNDATION_BASE_PATH}/verses/by_key/${encodeURIComponent(verseKey)}?` +
    `audio=${recitationId}&fields=text_uthmani`,
  /** GET — supported translation/tafsir languages */
  languages: () => `${FOUNDATION_BASE_PATH}/resources/languages`,
  /** GET — keyword search across translations/text */
  search: (q: string, qs = '') =>
    `${FOUNDATION_BASE_PATH}/search?q=${encodeURIComponent(q)}${qs ? `&${qs}` : ''}`,
  /** GET — juzs list */
  juzs: () => `${FOUNDATION_BASE_PATH}/juzs`,
};
