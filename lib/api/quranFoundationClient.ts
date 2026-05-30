/**
 * Quran.com Foundation API client (OAuth + content endpoints).
 * Only used server-side. Returns null when credentials are not configured —
 * callers should fall through to the open AlQuran Cloud provider.
 */

import { getQuranFoundationToken } from './tokenManager';

const BASE_URL =
  process.env.QURAN_API_BASE_URL || 'https://apis.quran.foundation/content/api/v4';

interface ClientOptions {
  /** Cache TTL hint for the platform fetch cache (seconds). 0 = no-store */
  revalidate?: number;
}

export async function quranFoundationFetch<T = unknown>(
  path: string,
  opts: ClientOptions = {},
): Promise<T | null> {
  const token = await getQuranFoundationToken();
  if (!token) return null;
  const clientId = process.env.QURAN_API_CLIENT_ID || '';

  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, {
      headers: {
        'x-auth-token': token,
        'x-client-id': clientId,
        Accept: 'application/json',
      },
      next: opts.revalidate === undefined ? { revalidate: 3600 } : { revalidate: opts.revalidate },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function quranFoundationConfigured(): boolean {
  return Boolean(process.env.QURAN_API_CLIENT_ID && process.env.QURAN_API_CLIENT_SECRET);
}
