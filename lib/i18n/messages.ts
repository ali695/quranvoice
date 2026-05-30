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
import hi from '@/messages/hi.json';
import bn from '@/messages/bn.json';
import id from '@/messages/id.json';
import tr from '@/messages/tr.json';
import de from '@/messages/de.json';
import fr from '@/messages/fr.json';
import es from '@/messages/es.json';
import ru from '@/messages/ru.json';
import fa from '@/messages/fa.json';
import ms from '@/messages/ms.json';
import zh from '@/messages/zh.json';
import ja from '@/messages/ja.json';
import ko from '@/messages/ko.json';
import it from '@/messages/it.json';

/**
 * Flat-string message map. Nested keys are encoded as `dot.path.strings`
 * to keep typing trivial and the runtime fast.
 */
export type Messages = Record<string, string>;

const TABLE: Record<LocaleCode, Messages> = {
  en: en as Messages,
  ar: ar as Messages,
  ur: ur as Messages,
  hi: hi as Messages,
  bn: bn as Messages,
  id: id as Messages,
  tr: tr as Messages,
  de: de as Messages,
  fr: fr as Messages,
  es: es as Messages,
  ru: ru as Messages,
  fa: fa as Messages,
  ms: ms as Messages,
  zh: zh as Messages,
  ja: ja as Messages,
  ko: ko as Messages,
  it: it as Messages,
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
