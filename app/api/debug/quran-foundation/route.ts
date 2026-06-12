/**
 * Safe diagnostics endpoint for the Quran.Foundation integration.
 *
 * - Available in development always.
 * - Available in production only when ?token=DEBUG_TOKEN matches the
 *   `QURAN_DEBUG_TOKEN` env var (so end users can't probe). If no
 *   token env var is set, the route 404s in production.
 *
 * NEVER exposes:
 *   - Client secret
 *   - Access token value
 *   - Authorization headers
 *   - Supabase service role key
 *
 * Only reports *presence* and *status*.
 */

import { NextResponse } from 'next/server';
import { foundationFetch } from '@/lib/quran-foundation/client';
import { F } from '@/lib/quran-foundation/endpoints';
import { isFoundationConfigured } from '@/lib/quran-foundation/env';
import {
  clearFoundationTokenCache,
  getFoundationToken,
  getFoundationTokenStatus,
} from '@/lib/quran-foundation/token-manager';
import { getSearchScopeStatus } from '@/lib/services/searchService';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';

interface Probe {
  label: string;
  ok: boolean;
  detail?: string;
}

interface AccessRule {
  allowed: boolean;
  reason: string;
}

function checkAccess(req: Request): AccessRule {
  if (process.env.NODE_ENV !== 'production') {
    return { allowed: true, reason: 'dev mode' };
  }
  const expected = process.env.QURAN_DEBUG_TOKEN;
  if (!expected) {
    return { allowed: false, reason: 'QURAN_DEBUG_TOKEN not set in production' };
  }
  const url = new URL(req.url);
  const supplied = url.searchParams.get('token') ?? '';
  return supplied === expected
    ? { allowed: true, reason: 'token match' }
    : { allowed: false, reason: 'invalid token' };
}

export async function GET(req: Request) {
  const access = checkAccess(req);
  if (!access.allowed) {
    return NextResponse.json({ error: { message: 'Not found' } }, { status: 404 });
  }

  const probes: Probe[] = [];

  // ── 1. Env presence ────────────────────────────────────────────────
  probes.push({ label: 'QURAN_FOUNDATION_CLIENT_ID present',     ok: Boolean(process.env.QURAN_FOUNDATION_CLIENT_ID) });
  probes.push({ label: 'QURAN_FOUNDATION_CLIENT_SECRET present', ok: Boolean(process.env.QURAN_FOUNDATION_CLIENT_SECRET) });
  probes.push({ label: 'QURAN_FOUNDATION_OAUTH_URL present',     ok: Boolean(process.env.QURAN_FOUNDATION_OAUTH_URL) });
  probes.push({ label: 'QURAN_FOUNDATION_API_BASE_URL present',  ok: Boolean(process.env.QURAN_FOUNDATION_API_BASE_URL) });
  probes.push({ label: 'NEXT_PUBLIC_SUPABASE_URL present',       ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) });
  probes.push({ label: 'NEXT_PUBLIC_SUPABASE_ANON_KEY present',  ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) });
  probes.push({ label: 'SUPABASE_SERVICE_ROLE_KEY present',      ok: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) });

  // ── 2. Active mode ─────────────────────────────────────────────────
  const oauthUrl = process.env.QURAN_FOUNDATION_OAUTH_URL ?? 'https://oauth2.quran.foundation';
  const mode = /prelive/i.test(oauthUrl) ? 'prelive' : 'production';

  // ── 3. OAuth token ─────────────────────────────────────────────────
  clearFoundationTokenCache();
  const token = isFoundationConfigured() ? await getFoundationToken() : null;
  const tokenStatus = getFoundationTokenStatus();
  probes.push({
    label: 'OAuth client_credentials token',
    ok: Boolean(token),
    detail: token
      ? `cached (~${Math.round((tokenStatus.expiresInMs ?? 0) / 60_000)} min remaining)`
      : 'token acquisition failed',
  });

  // ── 4. Endpoint probes ─────────────────────────────────────────────
  if (token) {
    const [chapters, verse, translations, tafsirs, recitations, languages] = await Promise.all([
      foundationFetch<{ chapters?: unknown[] }>(F.chapters()),
      foundationFetch<{ verse?: unknown }>(F.verseByKey('2:255', 'fields=text_uthmani')),
      foundationFetch<{ translations?: unknown[] }>(F.translationResources('en')),
      foundationFetch<{ tafsirs?: unknown[] }>(F.tafsirResources('en')),
      foundationFetch<{ recitations?: unknown[] }>(F.recitationResources()),
      foundationFetch<{ languages?: unknown[] }>(F.languages()),
    ]);
    probes.push({ label: 'chapters fetch',     ok: Boolean(chapters?.chapters?.length),         detail: `${chapters?.chapters?.length ?? 0} chapters` });
    probes.push({ label: 'verse 2:255 fetch',  ok: Boolean(verse?.verse),                       detail: verse?.verse ? 'Uthmani text returned' : 'no data' });
    probes.push({ label: 'translations fetch', ok: Boolean(translations?.translations?.length), detail: `${translations?.translations?.length ?? 0} resources` });
    probes.push({ label: 'tafsirs fetch',      ok: Boolean(tafsirs?.tafsirs?.length),           detail: `${tafsirs?.tafsirs?.length ?? 0} resources` });
    probes.push({ label: 'recitations fetch',  ok: Boolean(recitations?.recitations?.length),   detail: `${recitations?.recitations?.length ?? 0} reciters` });
    probes.push({ label: 'languages fetch',    ok: Boolean(languages?.languages?.length),       detail: `${languages?.languages?.length ?? 0} languages` });

    // Audio probe: try chapter audio for reciter 7 (Mishary on Foundation) surah 1.
    const audioOk = await foundationFetch<{ audio_file?: { audio_url?: string } }>(
      F.audioForChapter(7, 1),
    );
    probes.push({
      label: 'audio fetch (recitation 7, surah 1)',
      ok: Boolean(audioOk?.audio_file?.audio_url),
      detail: audioOk?.audio_file?.audio_url ? 'audio_url returned' : 'no audio data',
    });

    // Per-ayah audio probe (recitation 7, verse 2:255).
    const ayahAudio = await foundationFetch<{ audio_files?: Array<{ url?: string }> }>(
      F.ayahAudioForVerse(7, '2:255'),
    );
    probes.push({
      label: 'per-ayah audio (recitation 7, 2:255)',
      ok: Boolean(ayahAudio?.audio_files?.[0]?.url),
      detail: ayahAudio?.audio_files?.[0]?.url ? 'exact-ayah url returned' : 'no per-ayah data',
    });

    // ── Word-by-word + script-field probe for 2:255 ──────────────────
    const probe = await foundationFetch<{
      verse?: {
        text_uthmani?: string;
        text_uthmani_simple?: string;
        text_imlaei?: string;
        text_uthmani_tajweed?: string;
        page_number?: number;
        words?: Array<{
          char_type_name?: string;
          text_uthmani?: string;
          translation?: { text?: string } | null;
          transliteration?: { text?: string } | null;
        }>;
      };
    }>(F.verseCapabilityProbe('2:255'));
    const v = probe?.verse;
    const words = (v?.words ?? []).filter((w) => (w.char_type_name ?? 'word') === 'word');
    probes.push({
      label: 'word-by-word (2:255)',
      ok: words.length > 0,
      detail: words.length
        ? `${words.length} words` +
          `${words.some((w) => w.translation?.text) ? ' +translation' : ''}` +
          `${words.some((w) => w.transliteration?.text) ? ' +transliteration' : ''}`
        : 'no word data',
    });
    probes.push({
      label: 'tajweed field (text_uthmani_tajweed, 2:255)',
      ok: Boolean(v?.text_uthmani_tajweed),
      detail: v?.text_uthmani_tajweed ? 'tajweed markup returned' : 'absent',
    });
    probes.push({
      label: 'imlaei field (text_imlaei, 2:255)',
      ok: Boolean(v?.text_imlaei),
      detail: v?.text_imlaei ? 'present' : 'absent',
    });
    probes.push({
      label: 'simplified uthmani (text_uthmani_simple, 2:255)',
      ok: Boolean(v?.text_uthmani_simple),
      detail: v?.text_uthmani_simple ? 'present' : 'absent',
    });
    probes.push({
      label: 'mushaf page metadata (page_number, 2:255)',
      ok: typeof v?.page_number === 'number',
      detail: typeof v?.page_number === 'number' ? `page ${v.page_number}` : 'absent',
    });
  }

  // ── 5. Search scope ────────────────────────────────────────────────
  const scope = await getSearchScopeStatus();
  probes.push({
    label: 'search scope',
    ok: scope.available,
    detail: scope.available ? 'enabled' : scope.reason ?? 'not granted',
  });

  // ── 6. Supabase ────────────────────────────────────────────────────
  probes.push({
    label: 'Supabase configured',
    ok: isSupabaseConfigured(),
    detail: isSupabaseConfigured() ? 'URL + anon key present' : 'env not set',
  });

  return NextResponse.json({
    access: access.reason,
    mode,
    foundationConfigured: isFoundationConfigured(),
    probes,
    notes: [
      'Token values and headers are never returned.',
      'Production access requires ?token=$QURAN_DEBUG_TOKEN.',
      'Use this route to verify connectivity — do not embed in the UI.',
    ],
  });
}
