/**
 * GET /api/auth/quran-foundation/login
 *
 * Starts the "Sign in with Quran.Foundation" flow: generates PKCE + state,
 * stores them in short-lived HttpOnly cookies, and redirects the browser to
 * the Foundation authorization endpoint.
 */

import { NextResponse } from 'next/server';
import {
  buildAuthorizationUrl,
  codeChallengeS256,
  generateCodeVerifier,
  generateState,
  readUserAuthEnv,
} from '@/lib/quran-foundation/user-oauth';

export const dynamic = 'force-dynamic';

const secure = process.env.NODE_ENV === 'production';

export async function GET(req: Request) {
  const env = readUserAuthEnv();
  if (!env) {
    return NextResponse.redirect(
      new URL('/auth/callback/status?error=not_configured', req.url),
    );
  }

  const verifier = generateCodeVerifier();
  const challenge = codeChallengeS256(verifier);
  const state = generateState();

  // Optional post-login destination (defaults to /profile).
  const next = new URL(req.url).searchParams.get('next') || '/profile';

  const authUrl = buildAuthorizationUrl({ env, state, codeChallenge: challenge });
  const res = NextResponse.redirect(authUrl);

  const cookieOpts = {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 600, // 10 minutes to complete the round trip
  };
  res.cookies.set('qf_oauth_state', state, cookieOpts);
  res.cookies.set('qf_oauth_verifier', verifier, cookieOpts);
  res.cookies.set('qf_oauth_next', next.startsWith('/') ? next : '/profile', cookieOpts);
  return res;
}
