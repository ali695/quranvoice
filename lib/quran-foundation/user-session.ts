/**
 * Per-user Quran.Foundation session — stored in HttpOnly cookies.
 *
 * Server-only. Cookies can only be *written* from route handlers / server
 * actions (Next.js), so callers that need to persist a refresh should run in
 * those contexts. Server components may read the session and obtain a valid
 * access token (refresh is best-effort there).
 *
 * Tokens are never exposed to the browser JS (HttpOnly) and never rendered.
 */

import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';
import {
  readUserAuthEnv,
  refreshTokens,
  type UserTokenSet,
} from './user-oauth';

const AT = 'qf_user_at';
const RT = 'qf_user_rt';
const EXP = 'qf_user_exp';
const REFRESH_SKEW_MS = 60_000;

const secure = process.env.NODE_ENV === 'production';
const COOKIE_BASE = { httpOnly: true, secure, sameSite: 'lax' as const, path: '/' };

/**
 * Apply session cookies onto a NextResponse (reliable for redirect responses
 * from route handlers, where next/headers cookie writes can be dropped).
 */
export function applyUserSessionCookies(res: NextResponse, tokens: UserTokenSet): void {
  res.cookies.set(AT, tokens.accessToken, { ...COOKIE_BASE, maxAge: 60 * 60 });
  res.cookies.set(EXP, String(tokens.expiresAt), { ...COOKIE_BASE, maxAge: 60 * 60 * 24 * 30 });
  if (tokens.refreshToken) {
    res.cookies.set(RT, tokens.refreshToken, { ...COOKIE_BASE, maxAge: 60 * 60 * 24 * 30 });
  }
}

export function clearUserSessionCookies(res: NextResponse): void {
  for (const name of [AT, RT, EXP]) res.cookies.delete(name);
}

export interface UserSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export async function setUserSession(tokens: UserTokenSet): Promise<void> {
  const jar = await cookies();
  const common = { httpOnly: true, secure, sameSite: 'lax' as const, path: '/' };
  jar.set(AT, tokens.accessToken, { ...common, maxAge: 60 * 60 });
  jar.set(EXP, String(tokens.expiresAt), { ...common, maxAge: 60 * 60 * 24 * 30 });
  if (tokens.refreshToken) {
    jar.set(RT, tokens.refreshToken, { ...common, maxAge: 60 * 60 * 24 * 30 });
  }
}

export async function clearUserSession(): Promise<void> {
  const jar = await cookies();
  for (const name of [AT, RT, EXP]) jar.delete(name);
}

export async function getUserSession(): Promise<UserSession | null> {
  const jar = await cookies();
  const accessToken = jar.get(AT)?.value;
  const refreshToken = jar.get(RT)?.value;
  const expiresAt = Number(jar.get(EXP)?.value ?? 0);
  if (!accessToken && !refreshToken) return null;
  return { accessToken: accessToken ?? '', refreshToken, expiresAt };
}

export async function isSignedInWithFoundation(): Promise<boolean> {
  const s = await getUserSession();
  return Boolean(s && (s.accessToken || s.refreshToken));
}

/**
 * Returns a non-expired access token, refreshing (and persisting) when needed.
 * In a server-component context the persist step is swallowed — the freshly
 * refreshed token is still returned for immediate use.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const env = readUserAuthEnv();
  if (!env) return null;
  const session = await getUserSession();
  if (!session) return null;

  if (session.accessToken && session.expiresAt > Date.now() + REFRESH_SKEW_MS) {
    return session.accessToken;
  }
  if (!session.refreshToken) return session.accessToken || null;

  const refreshed = await refreshTokens({ env, refreshToken: session.refreshToken });
  if (!refreshed) return session.accessToken || null;
  try {
    await setUserSession(refreshed);
  } catch {
    // Read-only context (server component): can't persist — still usable now.
  }
  return refreshed.accessToken;
}
