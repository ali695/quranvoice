'use client';

import { useEffect } from 'react';

/**
 * Dev-only console filter for browser-extension hydration warnings.
 *
 * Extensions like Bitdefender Anti-Tracker (`bis_skin_checked`,
 * `bis_register`, `__processed_…`), Grammarly (`data-gr-*`),
 * 1Password (`data-1p-*`), DarkReader (`data-darkreader-*`),
 * and ColorZilla inject attributes into the DOM *after* the server
 * HTML is delivered but *before* React hydrates. React then logs a
 * harmless but very noisy hydration-mismatch error.
 *
 * We can't stop the extension. We *can* drop only those specific
 * warnings without hiding real hydration mismatches in your code.
 *
 * This runs only when `NODE_ENV === 'development'`. Production
 * builds are untouched — there React silently keeps the server HTML
 * on a mismatch and never logs anything.
 */
const EXTENSION_ATTR_PATTERNS = [
  /bis_skin_checked/,
  /bis_register/,
  /__processed_[\da-f-]+__/,
  /data-gr-(c-s-check-loaded|ext-installed)/,
  /data-new-gr-c-s-check-loaded/,
  /data-1p-(?:ignore|extension|root)/,
  /data-lpignore/,
  /data-darkreader/,
  /cz-shortcut-listen/,
];

function isExtensionHydrationWarning(args: unknown[]): boolean {
  // React's hydration messages come through console.error. We sniff
  // every stringy argument for known extension-injected attributes.
  for (const arg of args) {
    if (typeof arg === 'string') {
      if (EXTENSION_ATTR_PATTERNS.some((re) => re.test(arg))) return true;
      // The React "tree hydrated but some attributes" message is the
      // wrapper — only drop it when paired with an extension attribute.
      if (
        /A tree hydrated but some attributes of the server rendered HTML/.test(arg) ||
        /Hydration failed because the server rendered HTML didn't match the client/.test(arg)
      ) {
        // Defer the decision to the next args.
        continue;
      }
    }
  }
  // Look at the *whole* error string concatenated — React often passes
  // the message in one arg and the diff in another.
  const joined = args
    .map((a) => (typeof a === 'string' ? a : ''))
    .join(' ');
  return EXTENSION_ATTR_PATTERNS.some((re) => re.test(joined));
}

export function SuppressExtensionWarnings() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const original = console.error;
    console.error = (...args: unknown[]) => {
      if (isExtensionHydrationWarning(args)) return;
      original.apply(console, args as Parameters<typeof console.error>);
    };
    return () => {
      console.error = original;
    };
  }, []);
  return null;
}
