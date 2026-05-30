/**
 * Server-side fetch helper for the open AlQuran Cloud provider
 * (https://alquran.cloud) — no authentication required.
 *
 * This module is the fallback used when the Quran.com Foundation API
 * client credentials are not configured.
 */

const ALQURAN_CLOUD = 'https://api.alquran.cloud/v1';

interface ProxyOptions {
  revalidate?: number;
}

export async function alquranCloudFetch<T = unknown>(
  path: string,
  opts: ProxyOptions = {},
): Promise<T | null> {
  const url = path.startsWith('http') ? path : `${ALQURAN_CLOUD}${path}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next:
        opts.revalidate === undefined
          ? { revalidate: 86_400 }
          : { revalidate: opts.revalidate },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const ALQURAN_CLOUD_BASE = ALQURAN_CLOUD;
