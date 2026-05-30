/**
 * Server-side locale helpers.
 *
 * Reads the locale that `middleware.ts` set via the request header
 * `x-quranvoice-locale`. Falls back to the cookie, then to the default.
 */

import { cookies, headers } from 'next/headers';
import { I18N } from './config';
import { DEFAULT_LOCALE, isSupportedLocale, type LocaleCode } from './locales';

export async function getCurrentLocale(): Promise<LocaleCode> {
  // 1. Header set by middleware
  try {
    const h = await headers();
    const hv = h.get(I18N.headerName);
    if (hv && isSupportedLocale(hv)) return hv;
  } catch {
    // headers() throws outside a request scope — ignore.
  }
  // 2. Cookie
  try {
    const c = await cookies();
    const cv = c.get(I18N.cookieName)?.value;
    if (cv && isSupportedLocale(cv)) return cv;
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE;
}
