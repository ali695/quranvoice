const path = require('path');

/**
 * Pages that stay available to readers but should not appear in search:
 * personal/account tools, interactive utilities with no indexable copy,
 * placeholder sections, and pages that duplicate the main reader.
 * Sent as an X-Robots-Tag header (works for client-rendered pages too).
 */
const NOINDEX_PATHS = [
  // 604 mushaf page views repeat the surah text with no translation.
  '/pages',
  '/pages/:path*',
  // Topic index is a placeholder until a reviewed topic→ayah dataset exists.
  '/topics',
  '/topics/:path*',
  // Personal / account pages.
  '/profile',
  '/bookmarks',
  '/notes',
  '/goals',
  '/progress',
  '/collections',
  '/settings',
  '/memorization',
  '/memorization/:path*',
  '/audio',
  '/auth/:path*',
  // Utilities and thin pages.
  '/search',
  '/feedback',
  '/tools/reading-tracker',
  '/tools/memorization-tracker',
  '/tools/share-ayah',
  '/learn/articles',
  // Metadata-only detail pages and a duplicate of /quran/{s}/{a}.
  '/translations/:id',
  '/study/:surah/:ayah',
  '/developers/:path+',
];

const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Geolocation is used by prayer times and qibla; nothing else is needed.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), payment=(), usb=(), interest-cohort=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      { source: '/:path*', headers: SECURITY_HEADERS },
      ...NOINDEX_PATHS.map((source) => ({
        source,
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }],
      })),
    ];
  },
  async redirects() {
    return [
      // Duplicate pages merged into one canonical URL.
      { source: '/shan-e-nuzul', destination: '/shan-e-nuzool', permanent: true },
      { source: '/learn/duas', destination: '/learn/quranic-duas', permanent: true },
      { source: '/learn/stories-of-prophets', destination: '/learn/stories-of-the-prophets', permanent: true },
      // Locales removed because they were untranslated English copies.
      {
        source: '/:locale(hi|bn|id|tr|de|fr|es|ru|fa|ms|zh|ja|ko|it)',
        destination: '/',
        permanent: true,
      },
      {
        source: '/:locale(hi|bn|id|tr|de|fr|es|ru|fa|ms|zh|ja|ko|it)/:path*',
        destination: '/:path*',
        permanent: true,
      },
      // English is served unprefixed; /en/... would duplicate it.
      { source: '/en', destination: '/', permanent: true },
      { source: '/en/:path*', destination: '/:path*', permanent: true },
      // URLs from the previous quranvoice.app site (Laravel), kept for the domain move.
      { source: '/surahs/:n(\\d{1,3})', destination: '/quran/:n', permanent: true },
      { source: '/features', destination: '/about', permanent: true },
      { source: '/app', destination: '/', permanent: true },
      { source: '/support', destination: '/help', permanent: true },
      { source: '/dashboard', destination: '/profile', permanent: true },
      { source: '/library/bookmarks', destination: '/bookmarks', permanent: true },
      { source: '/library/progress', destination: '/progress', permanent: true },
      { source: '/login', destination: '/auth/sign-in', permanent: true },
      { source: '/register', destination: '/auth/sign-up', permanent: true },
    ];
  },
};

module.exports = nextConfig;
