/**
 * Supported locale catalog.
 *
 * Add new locales by appending here AND adding a matching `messages/{code}.json`
 * file. The middleware, hreflang generator, sitemap, and language selector all
 * read from this single source of truth.
 */

export type LocaleCode = 'en' | 'ar' | 'ur';

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
] as const;

export const LOCALE_CODES = LOCALES.map((l) => l.code) as readonly LocaleCode[];

export const DEFAULT_LOCALE: LocaleCode = 'en';

/**
 * Locales search engines may index. A locale belongs here only once its
 * pages are genuinely translated (UI, page copy and a licensed translation
 * of the meanings) — otherwise its URLs are duplicates of English and get
 * `noindex` plus no hreflang. Urdu and Arabic are selectable for readers
 * but not yet indexable.
 */
export const INDEXABLE_LOCALES: readonly LocaleCode[] = ['en'];

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
