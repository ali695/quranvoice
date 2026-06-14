import { badRequest, notFound, ok } from '@/lib/api/responses';
import { getAyahTiming } from '@/lib/services/audioService';

export const revalidate = 86400;

const VERSE_KEY = /^(\d{1,3}):(\d{1,3})$/;

/**
 * Per-ayah audio URL + word-level segment timing for a reciter (when the
 * Quran.Foundation source provides it). Returns 404 when no word timing exists
 * so the player falls back to ayah-level highlighting.
 */
export async function GET(
  _req: Request,
  context: { params: Promise<{ reciterId: string; verseKey: string }> },
) {
  const { reciterId, verseKey } = await context.params;
  if (!/^[a-z0-9._-]+$/i.test(reciterId)) return badRequest('invalid reciter id');
  const decoded = decodeURIComponent(verseKey);
  if (!VERSE_KEY.test(decoded)) return badRequest('invalid verseKey');

  const data = await getAyahTiming(reciterId, decoded);
  if (!data) return notFound('Word-level timing is not available for this recitation');
  return ok(data, { revalidate: 86_400 });
}
