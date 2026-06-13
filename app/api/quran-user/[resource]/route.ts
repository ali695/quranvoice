/**
 * GET/POST /api/quran-user/<resource>
 *
 * Proxies the signed-in user's Quran.Foundation features (profile, bookmarks,
 * collections, notes, preferences, goals, streaks, activity-days,
 * reading-sessions, tags, sync). The user access token is attached
 * server-side only and NEVER returned to the browser.
 *
 * Always returns a safe, normalized envelope:
 *   { source, signedIn, data, message? }
 * where `source` is 'quran_foundation' (live), 'local' (not signed in — the
 * client should use Supabase/localStorage), or 'unavailable' (signed in but
 * the scope/endpoint isn't granted yet). No raw upstream errors or tokens leak.
 */

import { NextResponse } from 'next/server';
import { badRequest } from '@/lib/api/responses';
import {
  fetchUserInfo,
  isUserAuthConfigured,
  readUserAuthEnv,
} from '@/lib/quran-foundation/user-oauth';
import { getValidAccessToken } from '@/lib/quran-foundation/user-session';
import {
  FoundationUserApiError,
  foundationUserFetch,
} from '@/lib/quran-foundation/user-api';
import { getUserResourceDef, isUserResource } from '@/lib/quran-foundation/user-resources';

export const dynamic = 'force-dynamic';

function envelope(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

async function handle(req: Request, resource: string, method: 'GET' | 'POST') {
  if (!isUserResource(resource)) return badRequest(`Unknown user resource: ${resource}`);
  const def = getUserResourceDef(resource)!;

  if (!isUserAuthConfigured()) {
    return envelope({
      source: 'local',
      signedIn: false,
      data: null,
      message: 'Quran.Foundation user login is not configured — using local storage.',
    });
  }

  const token = await getValidAccessToken();
  if (!token) {
    return envelope({
      source: 'local',
      signedIn: false,
      data: null,
      message: 'Not signed in with Quran.Foundation — bookmarks/notes use local/Supabase storage.',
    });
  }

  // profile → OIDC userinfo (safe fields only).
  if (resource === 'profile') {
    const env = readUserAuthEnv()!;
    const info = await fetchUserInfo(env, token);
    return envelope({
      source: info ? 'quran_foundation' : 'unavailable',
      signedIn: true,
      data: info
        ? { sub: info.sub ?? null, name: info.name ?? info.preferred_username ?? null, email: info.email ?? null }
        : null,
    });
  }

  if (method === 'POST' && !def.writable) {
    return badRequest(`${resource} is read-only`);
  }

  try {
    const body = method === 'POST' ? await req.json().catch(() => undefined) : undefined;
    const data = await foundationUserFetch(def.path, { method, body });
    return envelope({ source: 'quran_foundation', signedIn: true, data: data ?? null });
  } catch (e) {
    // Scope not yet granted / endpoint unavailable — fall back cleanly.
    const status = e instanceof FoundationUserApiError ? e.status : 0;
    return envelope({
      source: 'unavailable',
      signedIn: true,
      data: null,
      scope: def.scope,
      message:
        status === 403
          ? `The "${def.scope}" scope is not granted yet — this feature uses local/Supabase storage for now.`
          : `Quran.Foundation did not return this resource yet — using local/Supabase storage.`,
    });
  }
}

export async function GET(req: Request, ctx: { params: Promise<{ resource: string }> }) {
  const { resource } = await ctx.params;
  return handle(req, resource, 'GET');
}

export async function POST(req: Request, ctx: { params: Promise<{ resource: string }> }) {
  const { resource } = await ctx.params;
  return handle(req, resource, 'POST');
}
