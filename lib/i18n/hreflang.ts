/**
 * Hreflang alternate generator for SEO.
 *
 * Emits one entry per supported locale plus `x-default` pointing at the
 * canonical English URL. Both server pages (via `generateMetadata`) and
 * the dynamic sitemap use this.
 */

import { I18N, getLocalizedPath } from './config';
import { DEFAULT_LOCALE, INDEXABLE_LOCALES, LOCALES, LOCALE_CODES } from './locales';

export interface HreflangEntry {
  hreflang: string;
  href: string;
}

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://quranvoice.app').replace(/\/+$/, '');

/** Strip a possibly-already-prefixed locale segment to get the canonical path. */
function canonicalPath(path: string): string {
  const re = new RegExp(`^/(${LOCALE_CODES.join('|')})(?=/|$)`);
  return path.replace(re, '') || '/';
}

/**
 * Build the alternates map Next.js Metadata accepts:
 *   alternates: { canonical, languages: { 'en': '...', 'ar': '...', 'x-default': '...' } }
 */
export function generateHreflangAlternates(path: string): {
  canonical: string;
  languages: Record<string, string>;
} {
  const base = canonicalPath(path);
  const languages: Record<string, string> = {};
  // hreflang is only meaningful when more than one locale is genuinely indexable.
  for (const l of INDEXABLE_LOCALES.length > 1 ? LOCALES.filter((x) => INDEXABLE_LOCALES.includes(x.code)) : []) {
    languages[l.hreflang] = `${APP_URL}${getLocalizedPath(l.code, base)}`;
  }
  if (Object.keys(languages).length) languages['x-default'] = `${APP_URL}${getLocalizedPath(DEFAULT_LOCALE, base)}`;
  return {
    canonical: `${APP_URL}${getLocalizedPath(DEFAULT_LOCALE, base)}`,
    languages,
  };
}

/** Plain array form for the dynamic sitemap. */
export function generateHreflangArray(path: string): HreflangEntry[] {
  const base = canonicalPath(path);
  const out: HreflangEntry[] = [];
  if (INDEXABLE_LOCALES.length < 2) return out;
  for (const l of LOCALES.filter((x) => INDEXABLE_LOCALES.includes(x.code))) {
    out.push({ hreflang: l.hreflang, href: `${APP_URL}${getLocalizedPath(l.code, base)}` });
  }
  out.push({ hreflang: 'x-default', href: `${APP_URL}${getLocalizedPath(DEFAULT_LOCALE, base)}` });
  return out;
}

/** App URL base, exported so the rest of the app can build absolute links. */
export const APP_BASE_URL = APP_URL;
export { I18N };
