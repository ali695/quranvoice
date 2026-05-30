import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

/**
 * Supabase OAuth + magic-link callback.
 * Exchanges the `code` URL parameter for a session cookie and redirects
 * to the user's destination (or /profile by default).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/profile';

  if (!code) {
    return NextResponse.redirect(new URL('/auth/sign-in?error=missing-code', url.origin));
  }
  const sb = await getSupabaseServer();
  if (!sb) {
    return NextResponse.redirect(new URL('/auth/sign-in?error=sync-not-enabled', url.origin));
  }
  const { error } = await sb.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/sign-in?error=${encodeURIComponent(error.message)}`, url.origin),
    );
  }
  return NextResponse.redirect(new URL(next, url.origin));
}
