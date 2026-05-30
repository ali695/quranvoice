import { badRequest, notFound, ok, parseIntParam } from '@/lib/api/responses';
import { getAudioForSurah } from '@/lib/services/audioService';

export const revalidate = 86400;

export async function GET(
  _req: Request,
  context: { params: Promise<{ reciterId: string; chapterId: string }> },
) {
  const { reciterId, chapterId } = await context.params;
  if (!/^[a-z0-9._-]+$/i.test(reciterId)) return badRequest('invalid reciter id');
  const n = parseIntParam(chapterId, 1, 114);
  if (n === null) return badRequest('chapterId must be 1–114');
  const data = await getAudioForSurah(reciterId, n);
  if (!data) return notFound('Audio not available');
  return ok(data, { revalidate: 86_400 });
}
