/**
 * Server-only Supabase admin client.
 *
 * Uses the SERVICE ROLE key, which bypasses Row-Level Security.
 * NEVER import this file from a client component or any module that
 * may be bundled for the browser.
 *
 * Use cases:
 *  - Admin import/review workflows (e.g. Shan-e-Nuzool review)
 *  - Background tasks (cron, scheduled jobs)
 *  - Tasks that must read across users (analytics rollups)
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { readSupabasePublicEnv, readSupabaseServiceRoleKey } from './env';

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached) return cached;
  const pub = readSupabasePublicEnv();
  const serviceKey = readSupabaseServiceRoleKey();
  if (!pub || !serviceKey) return null;
  cached = createClient(pub.url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
