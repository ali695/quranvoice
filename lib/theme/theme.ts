/**
 * Theme preference handling (client-safe).
 *
 * Three preferences — 'dark' (Dark Gold, default), 'light' (White Gold), and
 * 'system'. The *resolved* theme ('dark' | 'light') is written to
 * <html data-theme>; globals.css remaps the palette accordingly.
 *
 * Persisted to a cookie (so the server can set data-theme with no flash) and
 * to localStorage as a guest fallback.
 */

export type ThemePref = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

export const THEME_COOKIE = 'qv-theme';
const THEME_KEY = 'qv-theme';
const ONE_YEAR = 60 * 60 * 24 * 365;

export function isThemePref(v: unknown): v is ThemePref {
  return v === 'dark' || v === 'light' || v === 'system';
}

export function systemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function resolveTheme(pref: ThemePref): ResolvedTheme {
  return pref === 'system' ? systemTheme() : pref;
}

export function getStoredThemePref(): ThemePref {
  if (typeof document !== 'undefined') {
    const m = document.cookie.match(/(?:^|;\s*)qv-theme=(dark|light|system)/);
    if (m) return m[1] as ThemePref;
    try {
      const ls = localStorage.getItem(THEME_KEY);
      if (isThemePref(ls)) return ls;
    } catch {
      /* ignore */
    }
  }
  return 'dark';
}

/** Apply the resolved theme to <html> (data-theme). */
export function applyResolvedTheme(resolved: ResolvedTheme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', resolved);
  document.documentElement.style.colorScheme = resolved;
}

export function storeThemePref(pref: ThemePref): void {
  if (typeof document !== 'undefined') {
    document.cookie = `${THEME_COOKIE}=${pref}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax`;
  }
  try {
    localStorage.setItem(THEME_KEY, pref);
  } catch {
    /* ignore */
  }
}
