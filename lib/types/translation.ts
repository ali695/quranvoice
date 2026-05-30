import type { SourceRef } from './quran';

export interface TranslationResource {
  id: string | number;
  name: string;
  authorName: string;
  language: string;
  languageName: string;
  /** ISO-639 code, e.g. "en", "ur" */
  languageIso: string;
  source: SourceRef;
}

export interface TranslationVerse {
  resourceId: string | number;
  resourceName: string;
  languageName: string;
  text: string;
  source: SourceRef;
}
