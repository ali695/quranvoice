/**
 * Authenticated Quran.Foundation USER API client — server-only.
 *
 * Calls the user-features API on behalf of the signed-in user, attaching the
 * per-user Bearer token (auto-refreshed via the session helper). Use this to
 * read/write the user's Foundation bookmarks, notes, collections, preferences,
 * etc. once you wire the specific endpoint paths from the Foundation docs.
 *
 * It never fabricates data: a call returns the real response, `null` when the
 * user isn't signed in, or throws `FoundationUserApiError` on a non-2xx.
 */

import { readUserAuthEnv } from './user-oauth';
import { getValidAccessToken } from './user-session';

export class FoundationUserApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export interface UserFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  searchParams?: Record<string, string | number | undefined>;
}

function buildUrl(base: string, path: string, params?: UserFetchOptions['searchParams']): string {
  const root = base.replace(/\/$/, '');
  const url = path.startsWith('http') ? path : `${root}${path.startsWith('/') ? '' : '/'}${path}`;
  if (!params) return url;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined) qs.set(k, String(v));
  const tail = qs.toString();
  return tail ? (url.includes('?') ? `${url}&${tail}` : `${url}?${tail}`) : url;
}

/**
 * Authenticated request to the Foundation user API.
 * Returns `null` when no user is signed in (so callers can fall back to the
 * app's local/Supabase store). Throws `FoundationUserApiError` on HTTP errors.
 */
export async function foundationUserFetch<T = unknown>(
  path: string,
  opts: UserFetchOptions = {},
): Promise<T | null> {
  const env = readUserAuthEnv();
  if (!env) return null;
  const token = await getValidAccessToken();
  if (!token) return null;

  const url = buildUrl(env.apiBaseUrl, path, opts.searchParams);
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'x-client-id': env.clientId,
  };
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(url, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store',
  });

  if (res.status === 204) return null;
  if (!res.ok) {
    let detail = `Foundation user API ${res.status}`;
    try {
      const t = await res.text();
      if (t) detail = `${detail}: ${t.slice(0, 200)}`;
    } catch {
      /* ignore */
    }
    throw new FoundationUserApiError(res.status, detail);
  }
  return (await res.json()) as T;
}

/**
 * Whether per-user sync is possible right now (configured + signed in).
 * Lets the app prefer Foundation sync and fall back to Supabase/local cleanly.
 */
export async function isUserSyncAvailable(): Promise<boolean> {
  if (!readUserAuthEnv()) return false;
  return Boolean(await getValidAccessToken());
}
