import { headers } from 'next/headers';
import { generateHreflangArray } from '@/lib/i18n/hreflang';

/**
 * Server component that renders <link rel="alternate" hreflang="…" />
 * for every supported locale, based on the current request path.
 *
 * Mounted from the root layout so every page gets hreflang automatically.
 */
export async function HreflangLinks() {
  // Next 15+ App Router exposes the URL via `headers()` (x-invoke-path / x-pathname).
  // Fall back to '/' if the runtime doesn't include it.
  const h = await headers();
  const path =
    h.get('x-invoke-path') ||
    h.get('x-pathname') ||
    h.get('next-url') ||
    '/';
  const entries = generateHreflangArray(path);
  return (
    <>
      {entries.map((e) => (
        <link key={e.hreflang} rel="alternate" hrefLang={e.hreflang} href={e.href} />
      ))}
    </>
  );
}
