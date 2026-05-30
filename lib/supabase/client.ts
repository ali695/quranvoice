'use client';

/**
 * Browser-side Supabase client.
 * Uses the public anon key; row-level security in the database
 * is the gate on user data.
 *
 * Returns null when Supabase isn't configured — callers must
 * fall back to the local-storage user-feature provider in that case.
 */

import { createBrowserClient, type CookieMethodsBrowser } from '@supabase/ssr';
import { readSupabasePublicEnv } from './env';

type AnyClient = ReturnType<typeof createBrowserClient> | null;

let cached: AnyClient = null;

export function getSupabaseBrowser(): AnyClient {
  if (cached) return cached;
  const env = readSupabasePublicEnv();
  if (!env) return null;
  cached = createBrowserClient(env.url, env.anonKey, {
    cookieOptions: { name: 'qv-auth', sameSite: 'lax' },
    // Use default cookie methods from the browser document.
    cookies: undefined as unknown as CookieMethodsBrowser,
  });
  return cached;
}
