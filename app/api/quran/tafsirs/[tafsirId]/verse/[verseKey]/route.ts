import { badRequest, ok } from '@/lib/api/responses';
import { getTafsirForAyah } from '@/lib/services/tafsirService';

export const revalidate = 3600;

const VERSE_KEY = /^(\d{1,3}):(\d{1,3})$/;

export async function GET(
  _req: Request,
  context: { params: Promise<{ tafsirId: string; verseKey: string }> },
) {
  const { tafsirId, verseKey } = await context.params;
  if (!/^[a-z0-9._-]+$/i.test(tafsirId)) return badRequest('invalid tafsir id');
  const decoded = decodeURIComponent(verseKey);
  const m = decoded.match(VERSE_KEY);
  if (!m) return badRequest('invalid verseKey');
  const surah = Number(m[1]);
  const ayah = Number(m[2]);
  const data = await getTafsirForAyah(surah, ayah, tafsirId);
  return ok(data ?? []);
}
