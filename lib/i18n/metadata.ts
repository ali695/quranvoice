/**
 * Per-page metadata generator with hreflang alternates.
 *
 * Usage in a page:
 *
 *   export async function generateMetadata({ params }: { params: ... }) {
 *     const locale = await getCurrentLocale();
 *     return generateLocalizedMetadata({
 *       locale, path: '/quran', titleKey: 'meta.quran.title', ...
 *     });
 *   }
 */

import type { Metadata } from 'next';
import { generateHreflangAlternates, APP_BASE_URL } from './hreflang';
import { getLocale } from './locales';
import { translate } from './messages';

interface Args {
  locale: string;
  path: string;
  titleKey?: string;
  descriptionKey?: string;
  title?: string;
  description?: string;
  /** When true, marks robots noindex (e.g. dev diagnostics) */
  noIndex?: boolean;
}

export function generateLocalizedMetadata({
  locale,
  path,
  titleKey,
  descriptionKey,
  title,
  description,
  noIndex,
}: Args): Metadata {
  const t = (k?: string) => (k ? translate(locale, k) : undefined);
  const resolvedTitle = title ?? t(titleKey);
  const resolvedDesc = description ?? t(descriptionKey);
  const alts = generateHreflangAlternates(path);
  const loc = getLocale(locale);

  return {
    title: resolvedTitle,
    description: resolvedDesc,
    metadataBase: new URL(APP_BASE_URL),
    alternates: alts,
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: resolvedTitle,
      description: resolvedDesc,
      url: alts.canonical,
      locale: loc.ogLocale,
      alternateLocale: Object.entries(alts.languages)
        .filter(([k]) => k !== 'x-default' && k !== loc.hreflang)
        .map(([k]) => k),
      type: 'website',
      siteName: 'QuranVoice',
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDesc,
    },
  };
}
