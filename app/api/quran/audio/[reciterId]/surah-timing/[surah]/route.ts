import { badRequest, notFound, ok } from '@/lib/api/responses';
import { getSurahTiming } from '@/lib/services/audioService';

export const revalidate = 604800;

/**
 * Full-surah audio URL + per-ayah and per-word timestamps (ms) for a
 * Quran.Foundation chapter reciter. 404 when complete timing is unavailable,
 * so the player falls back to its non-synced paths.
 */
export async function GET(
  _req: Request,
  context: { params: Promise<{ reciterId: string; surah: string }> },
) {
  const { reciterId, surah } = await context.params;
  if (!/^[a-z0-9._-]{1,40}$/i.test(reciterId)) return badRequest('invalid reciter id');
  const n = Number(surah);
  if (!Number.isInteger(n) || n < 1 || n > 114) return badRequest('invalid surah');
  const data = await getSurahTiming(reciterId, n);
  if (!data) return notFound('Synced surah audio is not available for this reciter');
  return ok(data, { revalidate: 604_800 });
}
