export interface AsbabEntry {
  id: string;
  surah: number;
  ayahs: number[];
  ayahRangeLabel: string;
  language: string;
  title?: string;
  text: string;
  sourceBook: string;
  author: string;
  editorOrVerifier?: string;
  authenticityStatus?: 'sahih' | 'hasan' | 'weak' | 'unknown' | 'multiple_reports';
  sourceType: 'hadith_verified' | 'classical_asbab' | 'tafsir_reference';
  referenceUrl?: string;
  licenseStatus: 'verified_allowed' | 'needs_permission' | 'open_source_claim' | 'unknown';
}
