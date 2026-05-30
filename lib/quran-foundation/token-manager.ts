/**
 * OAuth2 token manager for the Quran.Foundation Content API.
 *
 * Server-only. Uses `client_credentials` grant. Caches a single token
 * per process and refreshes when within 30 seconds of expiry.
 *
 * The token URL is constructed from QURAN_FOUNDATION_OAUTH_URL. The
 * Foundation API publishes the token endpoint at `/oauth2/token`.
 */

import { readFoundationEnv } from './env';

interface CachedToken {
  accessToken: string;
  /** Epoch ms */
  expiresAt: number;
}

let cached: CachedToken | null = null;
/**
 * In-flight token fetch promise so concurrent requests share a single
 * upstream call instead of stampeding the OAuth endpoint.
 */
let pending: Promise<string | null> | null = null;

const REFRESH_SKEW_MS = 30_000;

interface TokenResponse {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
}

async function fetchToken(): Promise<string | null> {
  const env = readFoundationEnv();
  if (!env) return null;

  const tokenUrl = `${env.oauthUrl.replace(/\/$/, '')}/oauth2/token`;
  const credentials = Buffer.from(`${env.clientId}:${env.clientSecret}`).toString('base64');

  try {
    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: 'grant_type=client_credentials&scope=content',
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as TokenResponse;
    if (!json.access_token) return null;
    const ttlMs = (json.expires_in ?? 3600) * 1000;
    cached = {
      accessToken: json.access_token,
      expiresAt: Date.now() + ttlMs,
    };
    return cached.accessToken;
  } catch {
    return null;
  }
}

export async function getFoundationToken(): Promise<string | null> {
  if (cached && cached.expiresAt > Date.now() + REFRESH_SKEW_MS) {
    return cached.accessToken;
  }
  if (pending) return pending;
  pending = fetchToken().finally(() => {
    pending = null;
  });
  return pending;
}

export function clearFoundationTokenCache(): void {
  cached = null;
}

export function getFoundationTokenStatus(): {
  cached: boolean;
  expiresInMs: number | null;
} {
  if (!cached) return { cached: false, expiresInMs: null };
  return { cached: true, expiresInMs: cached.expiresAt - Date.now() };
}
