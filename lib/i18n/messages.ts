/**
 * Translation message loader.
 *
 * - Server: synchronous JSON imports, so no extra network in SSR.
 * - Client: messages are seeded on first render by the LocaleProvider.
 *
 * Adding a language? Drop `messages/{code}.json`, add the locale to
 * `lib/i18n/locales.ts`, and you're done.
 */

import { DEFAULT_LOCALE, type LocaleCode, isSupportedLocale } from './locales';

import en from '@/messages/en.json';
import ar from '@/messages/ar.json';
import ur from '@/messages/ur.json';

/**
 * Flat-string message map. Nested keys are encoded as `dot.path.strings`
 * to keep typing trivial and the runtime fast.
 */
export type Messages = Record<string, string>;

const TABLE: Record<LocaleCode, Messages> = {
  en: en as Messages,
  ar: ar as Messages,
  ur: ur as Messages,
};

export function getMessages(code: string): Messages {
  if (isSupportedLocale(code)) return TABLE[code];
  return TABLE[DEFAULT_LOCALE];
}

/**
 * Translate a key. Falls back to English if the locale doesn't define it,
 * and to the key itself if English doesn't either.
 *
 * Supports {placeholders} via the second argument.
 */
export function translate(
  locale: string,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const msgs = getMessages(locale);
  const enFallback = TABLE[DEFAULT_LOCALE];
  let raw = msgs[key] ?? enFallback[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      raw = raw.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return raw;
}
