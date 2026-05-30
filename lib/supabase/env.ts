/**
 * Supabase env helpers (server-safe).
 *
 * `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are
 * inlined into the browser bundle — that is by design; the anon key
 * is the public API key and RLS protects user data.
 *
 * `SUPABASE_SERVICE_ROLE_KEY` is **NEVER** sent to the browser. It is
 * only read inside server-only modules (`lib/supabase/admin.ts`).
 */

export interface SupabasePublicEnv {
  url: string;
  anonKey: string;
}

export function readSupabasePublicEnv(): SupabasePublicEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function readSupabaseServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

export function isSupabaseConfigured(): boolean {
  return readSupabasePublicEnv() !== null;
}
