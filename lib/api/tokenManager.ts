/**
 * In-memory OAuth token cache for the Quran.com Foundation API.
 * Only used on the server (API routes). Never imported by client code.
 *
 * When QURAN_API_CLIENT_ID / QURAN_API_CLIENT_SECRET are not set,
 * the proxy falls back to AlQuran Cloud (open, no token required).
 */

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

let cached: CachedToken | null = null;

export async function getQuranFoundationToken(): Promise<string | null> {
  const clientId = process.env.QURAN_API_CLIENT_ID;
  const clientSecret = process.env.QURAN_API_CLIENT_SECRET;
  const tokenUrl =
    process.env.QURAN_OAUTH_TOKEN_URL ||
    'https://oauth2.quran.foundation/oauth2/token';

  if (!clientId || !clientSecret) return null;

  if (cached && cached.expiresAt > Date.now() + 30_000) {
    return cached.accessToken;
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials&scope=content',
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      access_token: string;
      expires_in: number;
    };
    cached = {
      accessToken: json.access_token,
      expiresAt: Date.now() + json.expires_in * 1000,
    };
    return cached.accessToken;
  } catch {
    return null;
  }
}

export function clearTokenCache(): void {
  cached = null;
}
