/**
 * GET /api/debug/search — verifies the navigation resolver across many query
 * forms. No secrets. Dev-only in production unless ?token=$QURAN_DEBUG_TOKEN.
 */

import { NextResponse } from 'next/server';
import { resolveQuery } from '@/lib/services/search.service';

export const dynamic = 'force-dynamic';

const SAMPLES = [
  '2:255',
  '2%3A255',
  '2 255',
  'Surah 2 Ayah 255',
  'Al-Baqarah',
  'البقرة',
  'Ayatul Kursi',
  'آیت الکرسی',
  'Juz 3',
  'Page 42',
  'Surah 36',
  'Yaseen',
  'Mulk',
  'الكهف',
  // Invalid targets — must resolve to null (no match), not a bad route.
  '2:999',
  'Juz 31',
  'Page 999',
];

function allowed(req: Request): boolean {
  if (process.env.NODE_ENV !== 'production') return true;
  const expected = process.env.QURAN_DEBUG_TOKEN;
  return Boolean(expected) && new URL(req.url).searchParams.get('token') === expected;
}

export async function GET(req: Request) {
  if (!allowed(req)) {
    return NextResponse.json({ error: { message: 'Not found' } }, { status: 404 });
  }
  const results = SAMPLES.map((q) => {
    // Decode %3A etc. the way the client would.
    const decoded = (() => {
      try {
        return decodeURIComponent(q);
      } catch {
        return q;
      }
    })();
    const r = resolveQuery(decoded);
    return {
      query: q,
      type: r?.type ?? 'none',
      target: r?.targetUrl ?? null,
      confidence: r?.confidence ?? null,
      valid: Boolean(r),
    };
  });
  return NextResponse.json({ results, notes: ['Navigation resolver only; no secrets.'] });
}
