'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { I18N } from './config';
import { DEFAULT_LOCALE, isSupportedLocale, type LocaleCode, getLocaleDirection } from './locales';
import { translate } from './messages';

interface LocaleContextValue {
  locale: LocaleCode;
  dir: 'ltr' | 'rtl';
  /** Translate a key with optional variables. */
  t: (key: string, vars?: Record<string, string | number>) => string;
  /**
   * Change the locale. Writes the cookie and reloads so server components
   * re-render with the new locale. Reload is intentional — server-rendered
   * pages are the source of truth for `<html lang dir>` and metadata.
   */
  setLocale: (next: LocaleCode) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: string;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<LocaleCode>(() =>
    isSupportedLocale(initialLocale) ? initialLocale : DEFAULT_LOCALE,
  );

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars),
    [locale],
  );

  const setLocale = useCallback((next: LocaleCode) => {
    if (!isSupportedLocale(next)) return;
    // Persist to cookie (visible to middleware on next request).
    if (typeof document !== 'undefined') {
      document.cookie = `${I18N.cookieName}=${next}; Path=/; Max-Age=${I18N.cookieMaxAge}; SameSite=Lax`;
    }
    setLocaleState(next);
    // Reload so server components and metadata pick up the new locale.
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dir: getLocaleDirection(locale), t, setLocale }),
    [locale, t, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    // Fallback so components that aren't wrapped (e.g. early in error
    // boundaries) still render English without throwing.
    return {
      locale: DEFAULT_LOCALE as LocaleCode,
      dir: 'ltr' as const,
      t: (key: string, vars?: Record<string, string | number>) => translate(DEFAULT_LOCALE, key, vars),
      setLocale: (_: LocaleCode) => {
        void _;
      },
    };
  }
  return ctx;
}
