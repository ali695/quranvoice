/**
 * GET/POST /api/auth/quran-foundation/logout
 * Clears the local Quran.Foundation session cookies and returns home.
 * (Does not end the session at the Foundation IdP — that requires the
 * provider's RP-initiated logout endpoint with a registered post-logout URI.)
 */

import { NextResponse } from 'next/server';
import { clearUserSessionCookies } from '@/lib/quran-foundation/user-session';

export const dynamic = 'force-dynamic';

function handle(req: Request) {
  const res = NextResponse.redirect(new URL('/profile', req.url));
  clearUserSessionCookies(res);
  return res;
}

export const GET = handle;
export const POST = handle;
