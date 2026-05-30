import { badRequest, notFound, ok } from '@/lib/api/responses';
import { getAyahAudioFile } from '@/lib/services/audioService';

export const revalidate = 86400;

const VERSE_KEY = /^(\d{1,3}):(\d{1,3})$/;

export async function GET(
  _req: Request,
  context: { params: Promise<{ reciterId: string; verseKey: string }> },
) {
  const { reciterId, verseKey } = await context.params;
  if (!/^[a-z0-9._-]+$/i.test(reciterId)) return badRequest('invalid reciter id');
  const decoded = decodeURIComponent(verseKey);
  if (!VERSE_KEY.test(decoded)) return badRequest('invalid verseKey');
  const data = await getAyahAudioFile(reciterId, decoded);
  if (!data) return notFound('Ayah audio not available — requires verified ayah-level data');
  return ok(data, { revalidate: 86_400 });
}
