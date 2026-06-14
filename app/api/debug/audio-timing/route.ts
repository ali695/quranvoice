/**
 * GET /api/debug/audio-timing — verifies audio + word-timing availability.
 * No secrets. Dev-only in production unless ?token=$QURAN_DEBUG_TOKEN.
 */

import { NextResponse } from 'next/server';
import { getAyahAudioFile, getAyahTiming, resolveQfReciterId } from '@/lib/services/audioService';

export const dynamic = 'force-dynamic';

function allowed(req: Request): boolean {
  if (process.env.NODE_ENV !== 'production') return true;
  const expected = process.env.QURAN_DEBUG_TOKEN;
  return Boolean(expected) && new URL(req.url).searchParams.get('token') === expected;
}

export async function GET(req: Request) {
  if (!allowed(req)) {
    return NextResponse.json({ error: { message: 'Not found' } }, { status: 404 });
  }

  const reciter = new URL(req.url).searchParams.get('reciter') ?? 'ar.alafasy';
  const probes: Array<{ label: string; ok: boolean; detail?: string }> = [];

  const qfId = resolveQfReciterId(reciter);
  probes.push({
    label: `reciter "${reciter}" → Quran.Foundation id`,
    ok: qfId !== null,
    detail: qfId !== null ? String(qfId) : 'no QF mapping (ayah-level only)',
  });

  // Ayah audio for 2:255.
  const ayahAudio = await getAyahAudioFile(reciter, '2:255');
  probes.push({
    label: 'ayah audio (2:255)',
    ok: Boolean(ayahAudio?.url),
    detail: ayahAudio?.url ? `provider=${ayahAudio.provider}` : 'none',
  });

  // Word timing for 2:255 + 1:1.
  for (const vk of ['1:1', '2:255']) {
    const timing = await getAyahTiming(reciter, vk);
    probes.push({
      label: `word timing (${vk})`,
      ok: Boolean(timing?.segments?.length),
      detail: timing
        ? `${timing.segments.length} segments` + (timing.segments[0] ? `, e.g. word ${timing.segments[0][1]} @ ${timing.segments[0][2]}–${timing.segments[0][3]}ms` : '')
        : 'no segment timing',
    });
  }

  const sample = await getAyahTiming(reciter, '1:1');
  return NextResponse.json({
    reciter,
    capabilities: {
      hasAyahAudio: Boolean(ayahAudio?.url),
      hasWordTiming: Boolean(sample?.segments?.length),
      hasSegmentTiming: Boolean(sample?.segments?.length),
      canHighlightAyah: Boolean(ayahAudio?.url),
      canHighlightWord: Boolean(sample?.segments?.length),
    },
    probes,
    notes: ['Word timing comes from Quran.Foundation segment data only — never synthesized.'],
  });
}
