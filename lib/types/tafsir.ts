import type { SourceRef } from './quran';

export interface TafsirResource {
  id: string | number;
  name: string;
  authorName: string;
  language: string;
  languageName: string;
  source: SourceRef;
}

export interface TafsirEntry {
  resourceId: string | number;
  book: string;
  author: string;
  language: string;
  /** May contain inline HTML when delivered by the API */
  textHtml?: string;
  text?: string;
  source: SourceRef;
}
