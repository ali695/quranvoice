/**
 * GET /api/debug/tafsir — safe tafsir diagnostics (no secrets).
 *
 * Tests Quran.Foundation tafsir resources, the spa5k fallback editions list,
 * a few fallback verse fetches, and the resolver mapping. Dev-only in
 * production unless ?token=$QURAN_DEBUG_TOKEN matches.
 */

import { NextResponse } from 'next/server';
import { listTafsirs } from '@/lib/services/tafsirService';
import {
  getFallbackEditionCount,
  getFallbackLanguages,
  getFallbackTafsirForVerse,
} from '@/lib/services/tafsir-fallback.service';
import { resolveTafsirForVerse } from '@/lib/services/tafsir.service';

export const dynamic = 'force-dynamic';

function allowed(req: Request): boolean {
  if (process.env.NODE_ENV !== 'production') return true;
  const expected = process.env.QURAN_DEBUG_TOKEN;
  if (!expected) return false;
  return new URL(req.url).searchParams.get('token') === expected;
}

export async function GET(req: Request) {
  if (!allowed(req)) {
    return NextResponse.json({ error: { message: 'Not found' } }, { status: 404 });
  }

  const probes: Array<{ label: string; ok: boolean; detail?: string }> = [];

  // 1. Quran.Foundation tafsir resources.
  const qf = await listTafsirs('en');
  probes.push({
    label: 'Quran.Foundation tafsir resources',
    ok: qf.length > 0,
    detail: `${qf.length} resources`,
  });

  // 2. Fallback editions list.
  const [fbCount, fbLangs] = await Promise.all([
    getFallbackEditionCount(),
    getFallbackLanguages(),
  ]);
  probes.push({
    label: 'spa5k fallback editions',
    ok: fbCount > 0,
    detail: `${fbCount} editions, ${fbLangs.length} languages`,
  });

  // 3. Specific fallback fetches.
  for (const slug of ['en-al-jalalayn', 'ur-tafseer-ibn-e-kaseer', 'ar-tafsir-ibn-kathir']) {
    const v = await getFallbackTafsirForVerse(slug, 1, 1);
    probes.push({
      label: `fallback ${slug} 1:1`,
      ok: Boolean(v?.content),
      detail: v?.content ? `${v.editionName} · ${v.content.slice(0, 50)}…` : 'no content',
    });
  }

  // 4. Resolver mapping (auto selection, English).
  const resolved = await resolveTafsirForVerse({
    surah: 2,
    ayah: 255,
    selectedId: undefined,
    language: 'en',
    fallbackEnabled: true,
  });
  probes.push({
    label: 'resolver 2:255 (auto, en)',
    ok: Boolean(resolved?.content),
    detail: resolved
      ? `provider=${resolved.provider} · ${resolved.editionName} · fallback=${resolved.isFallback}`
      : 'no tafsir resolved',
  });

  return NextResponse.json({
    probes,
    notes: [
      'Quran.Foundation is the primary tafsir source; spa5k is fallback only.',
      'No secrets are returned.',
    ],
  });
}
