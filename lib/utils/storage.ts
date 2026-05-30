/**
 * Tiny typed wrapper around localStorage with a single namespace prefix.
 * Designed so service modules can be swapped to a real backend later
 * without touching the call sites.
 */

const PREFIX = 'qv:';

function isAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const key = `${PREFIX}__probe__`;
    window.localStorage.setItem(key, '1');
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  if (!isAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (!isAvailable()) return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* quota exceeded — swallow */
  }
}

export function remove(key: string): void {
  if (!isAvailable()) return;
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

export function clearNamespace(): void {
  if (!isAvailable()) return;
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(PREFIX)) keys.push(k);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}
