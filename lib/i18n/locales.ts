/**
 * Supported locale catalog.
 *
 * Add new locales by appending here AND adding a matching `messages/{code}.json`
 * file. The middleware, hreflang generator, sitemap, and language selector all
 * read from this single source of truth.
 */

export type LocaleCode =
  | 'en'
  | 'ar'
  | 'ur'
  | 'hi'
  | 'bn'
  | 'id'
  | 'tr'
  | 'de'
  | 'fr'
  | 'es'
  | 'ru'
  | 'fa'
  | 'ms'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'it';

export interface LocaleDescriptor {
  code: LocaleCode;
  /** English name */
  englishName: string;
  /** Native name in its own script */
  nativeName: string;
  /** Reading direction */
  dir: 'ltr' | 'rtl';
  /** hreflang tag (often same as code but BCP-47 may differ later) */
  hreflang: string;
  /** Open Graph locale (BCP-47 with region) */
  ogLocale: string;
}

export const LOCALES: readonly LocaleDescriptor[] = [
  { code: 'en', englishName: 'English',     nativeName: 'English',     dir: 'ltr', hreflang: 'en', ogLocale: 'en_US' },
  { code: 'ar', englishName: 'Arabic',      nativeName: 'العربية',     dir: 'rtl', hreflang: 'ar', ogLocale: 'ar_SA' },
  { code: 'ur', englishName: 'Urdu',        nativeName: 'اردو',        dir: 'rtl', hreflang: 'ur', ogLocale: 'ur_PK' },
  { code: 'hi', englishName: 'Hindi',       nativeName: 'हिन्दी',       dir: 'ltr', hreflang: 'hi', ogLocale: 'hi_IN' },
  { code: 'bn', englishName: 'Bengali',     nativeName: 'বাংলা',       dir: 'ltr', hreflang: 'bn', ogLocale: 'bn_BD' },
  { code: 'id', englishName: 'Indonesian',  nativeName: 'Bahasa Indonesia', dir: 'ltr', hreflang: 'id', ogLocale: 'id_ID' },
  { code: 'tr', englishName: 'Turkish',     nativeName: 'Türkçe',      dir: 'ltr', hreflang: 'tr', ogLocale: 'tr_TR' },
  { code: 'de', englishName: 'German',      nativeName: 'Deutsch',     dir: 'ltr', hreflang: 'de', ogLocale: 'de_DE' },
  { code: 'fr', englishName: 'French',      nativeName: 'Français',    dir: 'ltr', hreflang: 'fr', ogLocale: 'fr_FR' },
  { code: 'es', englishName: 'Spanish',     nativeName: 'Español',     dir: 'ltr', hreflang: 'es', ogLocale: 'es_ES' },
  { code: 'ru', englishName: 'Russian',     nativeName: 'Русский',     dir: 'ltr', hreflang: 'ru', ogLocale: 'ru_RU' },
  { code: 'fa', englishName: 'Persian',     nativeName: 'فارسی',       dir: 'rtl', hreflang: 'fa', ogLocale: 'fa_IR' },
  { code: 'ms', englishName: 'Malay',       nativeName: 'Bahasa Melayu', dir: 'ltr', hreflang: 'ms', ogLocale: 'ms_MY' },
  { code: 'zh', englishName: 'Chinese',     nativeName: '中文',         dir: 'ltr', hreflang: 'zh', ogLocale: 'zh_CN' },
  { code: 'ja', englishName: 'Japanese',    nativeName: '日本語',       dir: 'ltr', hreflang: 'ja', ogLocale: 'ja_JP' },
  { code: 'ko', englishName: 'Korean',      nativeName: '한국어',       dir: 'ltr', hreflang: 'ko', ogLocale: 'ko_KR' },
  { code: 'it', englishName: 'Italian',     nativeName: 'Italiano',    dir: 'ltr', hreflang: 'it', ogLocale: 'it_IT' },
] as const;

export const LOCALE_CODES = LOCALES.map((l) => l.code) as readonly LocaleCode[];

export const DEFAULT_LOCALE: LocaleCode = 'en';

const BY_CODE: Record<string, LocaleDescriptor> = Object.fromEntries(
  LOCALES.map((l) => [l.code, l]),
);

export function isSupportedLocale(code: unknown): code is LocaleCode {
  return typeof code === 'string' && code in BY_CODE;
}

export function getLocale(code: string): LocaleDescriptor {
  return BY_CODE[code] ?? BY_CODE[DEFAULT_LOCALE];
}

export function getLocaleDirection(code: string): 'ltr' | 'rtl' {
  return getLocale(code).dir;
}
