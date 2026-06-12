/**
 * OAuth callback — route handler (so it can set session cookies).
 *
 * Handles three flows on the single registered redirect URI:
 *   1. Quran.Foundation user login: `code` + `state` matching our PKCE state
 *      cookie → exchange for a per-user token set → store in HttpOnly cookies.
 *   2. Supabase: `code` (no matching QF state) → exchange for a Supabase session.
 *   3. No / error params → redirect to the friendly /auth/callback/status page
 *      (so visiting the URL directly never 404s and reviewers see a real page).
 *
 * Tokens are never placed in the URL or markup — only HttpOnly cookies.
 */

import { NextResponse } from 'next/server';
import { exchangeCodeForTokens, readUserAuthEnv } from '@/lib/quran-foundation/user-oauth';
import { applyUserSessionCookies } from '@/lib/quran-foundation/user-session';
import { getSupabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function statusRedirect(req: Request, params: Record<string, string>) {
  const url = new URL('/auth/callback/status', req.url);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code') ?? undefined;
  const state = url.searchParams.get('state') ?? undefined;
  const error = url.searchParams.get('error') ?? undefined;
  const errorDescription = url.searchParams.get('error_description') ?? undefined;

  // Provider returned an error.
  if (error) {
    return statusRedirect(req, { state: 'error', message: errorDescription || error });
  }

  // ── Quran.Foundation user login (PKCE) ─────────────────────────────────
  const cookieState = req.headers.get('cookie')?.match(/(?:^|;\s*)qf_oauth_state=([^;]+)/)?.[1];
  const isFoundationCallback = Boolean(state && cookieState && decodeURIComponent(cookieState) === state);

  if (code && isFoundationCallback) {
    const env = readUserAuthEnv();
    const verifier = req.headers
      .get('cookie')
      ?.match(/(?:^|;\s*)qf_oauth_verifier=([^;]+)/)?.[1];
    const nextCookie = req.headers.get('cookie')?.match(/(?:^|;\s*)qf_oauth_next=([^;]+)/)?.[1];
    const next = nextCookie ? decodeURIComponent(nextCookie) : '/profile';

    if (!env || !verifier) {
      return statusRedirect(req, { state: 'error', message: 'Login session expired. Please try again.' });
    }
    const tokens = await exchangeCodeForTokens({
      env,
      code,
      codeVerifier: decodeURIComponent(verifier),
    });
    if (!tokens) {
      return statusRedirect(req, {
        state: 'error',
        message: 'Could not complete Quran.Foundation sign-in (token exchange failed).',
      });
    }
    const res = NextResponse.redirect(new URL(next.startsWith('/') ? next : '/profile', req.url));
    applyUserSessionCookies(res, tokens);
    // Clear one-time PKCE cookies.
    for (const c of ['qf_oauth_state', 'qf_oauth_verifier', 'qf_oauth_next']) res.cookies.delete(c);
    return res;
  }

  // ── Supabase code-for-session exchange ─────────────────────────────────
  if (code) {
    const next = url.searchParams.get('next') || '/profile';
    const sb = await getSupabaseServer();
    if (!sb) {
      return statusRedirect(req, {
        state: 'pending',
        message: 'The OAuth code reached us, but Supabase is not configured in this deployment.',
      });
    }
    const { error: exErr } = await sb.auth.exchangeCodeForSession(code);
    if (exErr) {
      return statusRedirect(req, { state: 'error', message: exErr.message });
    }
    return NextResponse.redirect(new URL(next.startsWith('/') ? next : '/profile', req.url));
  }

  // ── No params — friendly readiness page ────────────────────────────────
  return statusRedirect(req, { state: 'ready' });
}
