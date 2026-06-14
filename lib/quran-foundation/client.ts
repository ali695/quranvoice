/**
 * Quran.Foundation Content API client.
 *
 * Server-only. Returns null when the Foundation is not configured,
 * letting callers fall back to the open AlQuran Cloud provider in
 * older service modules.
 *
 * Calling code uses `foundationFetch<T>('/content/api/v4/chapters')`.
 */

import { readFoundationEnv } from './env';
import { getFoundationToken } from './token-manager';

export interface FoundationFetchOptions {
  /** Next.js fetch revalidation window in seconds. Default: 1h. */
  revalidate?: number;
  /** Forward query string params (already-encoded URL is fine too). */
  searchParams?: Record<string, string | number | undefined>;
  /** Skip the in-process cache (force fresh). */
  noStore?: boolean;
}

export class FoundationApiError extends Error {
  readonly status: number;
  readonly endpoint: string;
  constructor(status: number, endpoint: string, message: string) {
    super(message);
    this.status = status;
    this.endpoint = endpoint;
  }
}

function buildUrl(env: { apiBaseUrl: string }, path: string, params?: FoundationFetchOptions['searchParams']): string {
  const base = env.apiBaseUrl.replace(/\/$/, '');
  let url: string;
  if (path.startsWith('http')) url = path;
  else if (path.startsWith('/')) url = `${base}${path}`;
  else url = `${base}/${path}`;
  if (!params) return url;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) qs.set(k, String(v));
  }
  const tail = qs.toString();
  if (!tail) return url;
  return url.includes('?') ? `${url}&${tail}` : `${url}?${tail}`;
}

/**
 * Server-side GET to the Foundation API.
 * Returns `null` when:
 *   - Foundation is not configured (missing env)
 *   - Token acquisition fails
 *   - Response is non-2xx (caller can fall back / show unavailable state)
 */
export async function foundationFetch<T = unknown>(
  path: string,
  opts: FoundationFetchOptions = {},
): Promise<T | null> {
  const env = readFoundationEnv();
  if (!env) return null;
  const token = await getFoundationToken();
  if (!token) return null;
  const url = buildUrl(env, path, opts.searchParams);
  // Retry once on a transient network/connect failure or timeout — serverless
  // cold starts and the first connect to the API host can be slow, and a
  // spurious null would wrongly demote callers (e.g. capability detection
  // falling back to the open provider). Per-attempt timeout keeps it bounded.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          // Foundation Content API auth headers.
          'x-auth-token': token,
          'x-client-id': env.clientId,
        },
        signal: AbortSignal.timeout(15_000),
        next: opts.noStore ? undefined : { revalidate: opts.revalidate ?? 3600 },
        cache: opts.noStore ? 'no-store' : undefined,
      });
      if (!res.ok) return null; // a real HTTP error is not retried
      return (await res.json()) as T;
    } catch {
      // Network error / timeout — retry once, then give up.
      if (attempt === 1) return null;
    }
  }
  return null;
}

/**
 * Like `foundationFetch` but throws a typed error on failure so API route
 * handlers can return proper status codes to callers.
 */
export async function foundationFetchOrThrow<T = unknown>(
  path: string,
  opts: FoundationFetchOptions = {},
): Promise<T> {
  const env = readFoundationEnv();
  if (!env) {
    throw new FoundationApiError(503, path, 'Quran.Foundation API is not configured');
  }
  const token = await getFoundationToken();
  if (!token) {
    throw new FoundationApiError(502, path, 'Could not obtain Quran.Foundation token');
  }
  const url = buildUrl(env, path, opts.searchParams);
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'x-auth-token': token,
      'x-client-id': env.clientId,
    },
    next: opts.noStore ? undefined : { revalidate: opts.revalidate ?? 3600 },
    cache: opts.noStore ? 'no-store' : undefined,
  });
  if (!res.ok) {
    let message = `Foundation API ${res.status}`;
    try {
      const body = await res.text();
      if (body) message = `${message}: ${body.slice(0, 240)}`;
    } catch {
      /* ignore */
    }
    throw new FoundationApiError(res.status, path, message);
  }
  return (await res.json()) as T;
}
