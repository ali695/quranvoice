/**
 * "Sign in with Quran.Foundation" — OAuth2 authorization_code + PKCE.
 *
 * Server-only. Distinct from the content `client_credentials` flow in
 * `token-manager.ts`: this issues a *per-user* token (with refresh) so the
 * app can read/write the signed-in user's Foundation features (bookmarks,
 * notes, collections, preferences, …).
 *
 * Public PKCE client by default — the client secret is optional and only
 * attached when configured (confidential client).
 */

import { createHash, randomBytes } from 'node:crypto';

export interface UserAuthEnv {
  clientId: string;
  clientSecret?: string;
  oauthUrl: string;
  apiBaseUrl: string;
  redirectUri: string;
  scopes: string;
}

const DEFAULT_SCOPES =
  'openid offline_access profile bookmark collection note preference reading_session activity_day goal streak tag';

/** Returns user-auth config when configured (client id + redirect uri), else null. */
export function readUserAuthEnv(): UserAuthEnv | null {
  const clientId = process.env.QURAN_FOUNDATION_USER_CLIENT_ID;
  const redirectUri = process.env.QURAN_FOUNDATION_USER_REDIRECT_URI;
  if (!clientId || !redirectUri) return null;
  return {
    clientId,
    clientSecret: process.env.QURAN_FOUNDATION_USER_CLIENT_SECRET || undefined,
    oauthUrl: process.env.QURAN_FOUNDATION_USER_OAUTH_URL ?? 'https://prelive-oauth2.quran.foundation',
    apiBaseUrl:
      process.env.QURAN_FOUNDATION_USER_API_BASE_URL ?? 'https://apis-prelive.quran.foundation',
    redirectUri,
    scopes: process.env.QURAN_FOUNDATION_USER_SCOPES ?? DEFAULT_SCOPES,
  };
}

export function isUserAuthConfigured(): boolean {
  return readUserAuthEnv() !== null;
}

function base64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function generateCodeVerifier(): string {
  return base64url(randomBytes(32));
}

export function codeChallengeS256(verifier: string): string {
  return base64url(createHash('sha256').update(verifier).digest());
}

export function generateState(): string {
  return base64url(randomBytes(16));
}

/** Build the authorization-endpoint URL the browser is redirected to. */
export function buildAuthorizationUrl(params: {
  env: UserAuthEnv;
  state: string;
  codeChallenge: string;
}): string {
  const { env, state, codeChallenge } = params;
  const qs = new URLSearchParams({
    response_type: 'code',
    client_id: env.clientId,
    redirect_uri: env.redirectUri,
    scope: env.scopes,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
  return `${env.oauthUrl.replace(/\/$/, '')}/oauth2/auth?${qs.toString()}`;
}

export interface UserTokenSet {
  accessToken: string;
  refreshToken?: string;
  /** Epoch ms */
  expiresAt: number;
  scope?: string;
  idToken?: string;
}

interface TokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  id_token?: string;
  error?: string;
  error_description?: string;
}

async function postToken(env: UserAuthEnv, body: URLSearchParams): Promise<UserTokenSet | null> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
  };
  // Confidential client: HTTP Basic. Public PKCE client: client_id in body.
  if (env.clientSecret) {
    headers.Authorization = `Basic ${Buffer.from(`${env.clientId}:${env.clientSecret}`).toString('base64')}`;
  } else {
    body.set('client_id', env.clientId);
  }
  try {
    const res = await fetch(`${env.oauthUrl.replace(/\/$/, '')}/oauth2/token`, {
      method: 'POST',
      headers,
      body,
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as TokenResponse;
    if (!json.access_token) return null;
    return {
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
      expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000,
      scope: json.scope,
      idToken: json.id_token,
    };
  } catch {
    return null;
  }
}

export async function exchangeCodeForTokens(params: {
  env: UserAuthEnv;
  code: string;
  codeVerifier: string;
}): Promise<UserTokenSet | null> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: params.code,
    redirect_uri: params.env.redirectUri,
    code_verifier: params.codeVerifier,
  });
  return postToken(params.env, body);
}

export async function refreshTokens(params: {
  env: UserAuthEnv;
  refreshToken: string;
}): Promise<UserTokenSet | null> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: params.refreshToken,
  });
  return postToken(params.env, body);
}

export interface FoundationUserInfo {
  sub?: string;
  name?: string;
  email?: string;
  preferred_username?: string;
  [k: string]: unknown;
}

/** OpenID userinfo endpoint — proves the per-user token is valid. */
export async function fetchUserInfo(
  env: UserAuthEnv,
  accessToken: string,
): Promise<FoundationUserInfo | null> {
  try {
    const res = await fetch(`${env.oauthUrl.replace(/\/$/, '')}/userinfo`, {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as FoundationUserInfo;
  } catch {
    return null;
  }
}
