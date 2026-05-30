/**
 * Re-export of the existing surah metadata catalog so the service
 * layer has a stable import path even when the API is unreachable.
 */
export { SURAHS as FALLBACK_SURAHS, getSurahByNumber, getPopularSurahs, getDirectoryPreview } from './surahs';
