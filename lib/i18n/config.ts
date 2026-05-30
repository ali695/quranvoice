/**
 * Centralized i18n config — used by the middleware, server components,
 * and the client `LocaleProvider`.
 */

import { DEFAULT_LOCALE, LOCALE_CODES, type LocaleCode } from './locales';

export const I18N = {
  defaultLocale: DEFAULT_LOCALE,
  /** Locales that have full UI translations. Others fall back to English. */
  locales: LOCALE_CODES,
  /** Cookie name used to persist locale across visits */
  cookieName: 'qv-locale',
  /** Request header set by middleware so server code can read locale */
  headerName: 'x-quranvoice-locale',
  /** Cookie lifetime (1 year) */
  cookieMaxAge: 60 * 60 * 60 * 24 * 365,
} as const;

/**
 * Extract a locale segment from a URL path. Returns the locale and the
 * remaining path (without the locale prefix).
 *
 * @example
 *   splitLocalePath('/ur/quran/2/255')  // { locale: 'ur', rest: '/quran/2/255' }
 *   splitLocalePath('/quran/2/255')      // { locale: null, rest: '/quran/2/255' }
 */
export function splitLocalePath(pathname: string): {
  locale: LocaleCode | null;
  rest: string;
} {
  const m = pathname.match(/^\/([a-z]{2})(?=\/|$)/);
  if (!m) return { locale: null, rest: pathname };
  const candidate = m[1];
  if (!(I18N.locales as readonly string[]).includes(candidate)) {
    return { locale: null, rest: pathname };
  }
  const rest = pathname.slice(m[0].length) || '/';
  return { locale: candidate as LocaleCode, rest };
}

/**
 * Build a localized path. Default locale is rendered without a prefix
 * to keep the canonical English URLs short.
 */
export function getLocalizedPath(locale: LocaleCode, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return normalized;
  return `/${locale}${normalized === '/' ? '' : normalized}`;
}
