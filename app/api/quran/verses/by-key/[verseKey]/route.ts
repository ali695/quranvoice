import { badRequest, notFound, ok } from '@/lib/api/responses';
import { getAyah } from '@/lib/services/quranService';

export const revalidate = 3600;

const VERSE_KEY = /^(\d{1,3}):(\d{1,3})$/;

export async function GET(
  _req: Request,
  context: { params: Promise<{ verseKey: string }> },
) {
  const { verseKey } = await context.params;
  const decoded = decodeURIComponent(verseKey);
  const m = decoded.match(VERSE_KEY);
  if (!m) return badRequest('verseKey must look like "2:255"');
  const surah = Number(m[1]);
  const ayah = Number(m[2]);
  if (surah < 1 || surah > 114 || ayah < 1) return badRequest('verseKey out of range');
  const data = await getAyah(surah, ayah);
  if (!data) return notFound('Verse not available');
  return ok(data);
}
