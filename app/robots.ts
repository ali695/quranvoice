import type { MetadataRoute } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://quranvoice.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', // server endpoints
          '/auth/callback', // OAuth callback
          '/auth/callback/', // and its status sub-route
          '/developers/quran-oauth-test', // dev-only tester
          '/profile', // private user pages
          '/bookmarks',
          '/notes',
          '/goals',
          '/progress',
          '/collections',
          '/settings',
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL,
  };
}
