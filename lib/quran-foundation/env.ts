/**
 * Server-only env loader for Quran.Foundation credentials.
 *
 * This module MUST NOT be imported from client code. Importing it from a
 * client component would attempt to read process.env values that are not
 * exposed to the browser, but the safer guarantee is at the call-site:
 * only API routes and server components touch these files.
 */

export interface FoundationEnv {
  clientId: string;
  clientSecret: string;
  oauthUrl: string;
  apiBaseUrl: string;
}

/** Returns env values when fully configured; otherwise null. */
export function readFoundationEnv(): FoundationEnv | null {
  const clientId = process.env.QURAN_FOUNDATION_CLIENT_ID;
  const clientSecret = process.env.QURAN_FOUNDATION_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return {
    clientId,
    clientSecret,
    oauthUrl: process.env.QURAN_FOUNDATION_OAUTH_URL ?? 'https://oauth2.quran.foundation',
    apiBaseUrl: process.env.QURAN_FOUNDATION_API_BASE_URL ?? 'https://apis.quran.foundation',
  };
}

export function isFoundationConfigured(): boolean {
  return readFoundationEnv() !== null;
}
