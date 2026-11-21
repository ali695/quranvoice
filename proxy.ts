/**
 * QuranVoice locale proxy.
 *
 * One URL = one language:
 *   - Unprefixed URLs (/quran/2/255) are always English.
 *   - Prefixed URLs (/ur/quran/2/255) are that locale; we REWRITE (not
 *     redirect) to the unprefixed route so pages keep their locations, and
 *     pass the locale to server components via a request header.
 *   - A reader who chose another language (qv-locale cookie) and lands on an
 *     unprefixed URL is sent to the prefixed version with a temporary
 *     redirect. Crawlers carry no cookie, so they always get English.
 *   - Accept-Language is NOT used: auto-switching content at the same URL
 *     confuses caches and search engines.
 *
 * Indexing: prefixed locales that are not in INDEXABLE_LOCALES, and any host
 * other than the canonical NEXT_PUBLIC_APP_URL host (e.g. *.vercel.app
 * previews), get `X-Robots-Tag: noindex, follow`.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { I18N, getLocalizedPath, splitLocalePath } from './lib/i18n/config';
import { DEFAULT_LOCALE, INDEXABLE_LOCALES, isSupportedLocale } from './lib/i18n/locales';

const CANONICAL_HOST = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://quranvoice.app').host;
  } catch {
    return 'quranvoice.app';
  }
})();

function isLocalHost(host: string): boolean {
  return /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Skip Next.js internals + static assets fast.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') // file requests like /robots.txt, /sitemap.xml, /images/*
  ) {
    return NextResponse.next();
  }

  const { locale: urlLocale, rest } = splitLocalePath(pathname);

  // Remembered non-English choice on an unprefixed URL → its localized URL.
  if (!urlLocale) {
    const cookieLocale = request.cookies.get(I18N.cookieName)?.value;
    if (cookieLocale && cookieLocale !== DEFAULT_LOCALE && isSupportedLocale(cookieLocale)) {
      const target = new URL(getLocalizedPath(cookieLocale, pathname) + url.search, url);
      return NextResponse.redirect(target, 307);
    }
  }

  const resolved = urlLocale ?? DEFAULT_LOCALE;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(I18N.headerName, resolved);

  const response = urlLocale
    ? NextResponse.rewrite(new URL(rest + url.search, url), { request: { headers: requestHeaders } })
    : NextResponse.next({ request: { headers: requestHeaders } });

  const host = request.headers.get('host') ?? '';
  const offCanonicalHost = host !== CANONICAL_HOST && !isLocalHost(host);
  const unindexedLocale = !INDEXABLE_LOCALES.includes(resolved);
  if (offCanonicalHost || unindexedLocale) {
    response.headers.set('X-Robots-Tag', 'noindex, follow');
  }

  // Remember an explicit locale visit so unprefixed links keep the reader in it.
  if (urlLocale) {
    response.cookies.set(I18N.cookieName, urlLocale, {
      path: '/',
      maxAge: I18N.cookieMaxAge,
      sameSite: 'lax',
    });
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|api|favicon.ico|images|robots.txt|sitemap.xml).*)'],
};
