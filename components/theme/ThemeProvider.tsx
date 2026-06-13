'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { updateSettings } from '@/lib/services/settingsService';
import {
  applyResolvedTheme,
  getStoredThemePref,
  resolveTheme,
  storeThemePref,
  systemTheme,
  type ResolvedTheme,
  type ThemePref,
} from '@/lib/theme/theme';

interface ThemeContextValue {
  pref: ThemePref;
  resolved: ResolvedTheme;
  setTheme: (pref: ThemePref) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [pref, setPref] = useState<ThemePref>('dark');
  const [resolved, setResolved] = useState<ResolvedTheme>('dark');

  // Hydrate from the stored preference and apply.
  useEffect(() => {
    const p = getStoredThemePref();
    const r = resolveTheme(p);
    setPref(p);
    setResolved(r);
    applyResolvedTheme(r);
  }, []);

  // Follow the OS when preference is 'system'.
  useEffect(() => {
    if (pref !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      const r = systemTheme();
      setResolved(r);
      applyResolvedTheme(r);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [pref]);

  const setTheme = useCallback((next: ThemePref) => {
    setPref(next);
    storeThemePref(next);
    updateSettings('appearance', { theme: next });
    const r = resolveTheme(next);
    setResolved(r);
    applyResolvedTheme(r);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ pref, resolved, setTheme }),
    [pref, resolved, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { pref: 'dark', resolved: 'dark', setTheme: () => {} };
  }
  return ctx;
}
