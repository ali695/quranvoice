/**
 * QuranVoice locale middleware.
 *
 * Resolves the active locale per request from three sources, in order:
 *   1. URL prefix      → /ur/quran/2/255  ⇒  ur
 *   2. Cookie          → qv-locale=hi      ⇒  hi
 *   3. Accept-Language → fr-FR, fr;q=0.9   ⇒  fr (if supported)
 *
 * For URL-prefixed paths we REWRITE (not redirect) to the unprefixed path,
 * so all existing pages continue to render at their original locations.
 * The resolved locale travels through a request header so server components
 * can read it via `lib/i18n/server.ts → getCurrentLocale()`.
 *
 * The default locale (`en`) is served at the bare URLs, keeping canonical
 * English URLs short and SEO-friendly.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { I18N, splitLocalePath } from './lib/i18n/config';
import { DEFAULT_LOCALE, LOCALE_CODES, isSupportedLocale, type LocaleCode } from './lib/i18n/locales';

const SUPPORTED = new Set<string>(LOCALE_CODES);

/** Pick the highest-priority supported locale from an Accept-Language string. */
function pickFromAcceptLanguage(header: string | null): LocaleCode | null {
  if (!header) return null;
  // Format: "fr-FR,fr;q=0.9,en;q=0.8"
  const parts = header
    .split(',')
    .map((p) => {
      const [lang, q] = p.trim().split(';q=');
      return { lang: lang.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { lang } of parts) {
    const primary = lang.split('-')[0];
    if (SUPPORTED.has(primary)) return primary as LocaleCode;
  }
  return null;
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
  let resolved: LocaleCode;
  let shouldRewrite = false;

  if (urlLocale) {
    resolved = urlLocale;
    // Rewrite away the prefix so existing pages handle the request.
    shouldRewrite = true;
  } else {
    // Cookie → Accept-Language → default
    const cookieLocale = request.cookies.get(I18N.cookieName)?.value;
    if (cookieLocale && isSupportedLocale(cookieLocale)) {
      resolved = cookieLocale;
    } else {
      resolved = pickFromAcceptLanguage(request.headers.get('accept-language')) ?? DEFAULT_LOCALE;
    }
  }

  // Build the downstream request, with the locale header attached.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(I18N.headerName, resolved);

  const response = shouldRewrite
    ? NextResponse.rewrite(new URL(rest + url.search, url), { request: { headers: requestHeaders } })
    : NextResponse.next({ request: { headers: requestHeaders } });

  // Persist the resolved locale so future requests skip detection.
  response.cookies.set(I18N.cookieName, resolved, {
    path: '/',
    maxAge: I18N.cookieMaxAge,
    sameSite: 'lax',
  });
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|api|favicon.ico|images|robots.txt|sitemap.xml).*)'],
};
