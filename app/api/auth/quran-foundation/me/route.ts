/**
 * GET /api/auth/quran-foundation/me
 *
 * Returns the signed-in Quran.Foundation user's safe profile fields (from the
 * OpenID userinfo endpoint), refreshing the token if needed. Never returns the
 * access/refresh tokens themselves.
 */

import { NextResponse } from 'next/server';
import { fetchUserInfo, readUserAuthEnv } from '@/lib/quran-foundation/user-oauth';
import { getValidAccessToken } from '@/lib/quran-foundation/user-session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const env = readUserAuthEnv();
  if (!env) {
    return NextResponse.json({ configured: false, signedIn: false });
  }
  const token = await getValidAccessToken();
  if (!token) {
    return NextResponse.json({ configured: true, signedIn: false });
  }
  const info = await fetchUserInfo(env, token);
  if (!info) {
    // Token present but userinfo failed — treat as not usable.
    return NextResponse.json({ configured: true, signedIn: false });
  }
  return NextResponse.json({
    configured: true,
    signedIn: true,
    user: {
      sub: info.sub ?? null,
      name: info.name ?? info.preferred_username ?? null,
      email: info.email ?? null,
    },
  });
}
