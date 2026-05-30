/**
 * Server-side Supabase client (App Router).
 *
 * Reads/writes auth cookies through Next.js `cookies()`. Use this
 * inside server components, server actions, and route handlers.
 *
 * Returns null when Supabase env is not configured.
 */

import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { readSupabasePublicEnv } from './env';

export async function getSupabaseServer() {
  const env = readSupabasePublicEnv();
  if (!env) return null;
  const cookieStore = await cookies();
  return createServerClient(env.url, env.anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          /* called from a read-only context — ignore */
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        } catch {
          /* ignore */
        }
      },
    },
  });
}
