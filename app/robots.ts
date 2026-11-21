import type { MetadataRoute } from 'next';
import { APP_BASE_URL } from '@/lib/i18n/hreflang';

/**
 * Only block what crawlers must never fetch. Private and thin pages are NOT
 * disallowed here on purpose: they send `X-Robots-Tag: noindex` (see
 * next.config.js), and a crawler has to be allowed to fetch a page to see it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', // server endpoints
          '/auth/callback', // OAuth callback (and its /status sub-route)
          '/developers/quran-oauth-test', // dev-only tester
          '/developers/api-test', // dev-only diagnostics
        ],
      },
    ],
    sitemap: `${APP_BASE_URL}/sitemap.xml`,
  };
}
