import { badRequest, notFound, ok, parseIntParam } from '@/lib/api/responses';
import { getTajweedSurah } from '@/lib/services/tajweedService';

export const revalidate = 86400;

export async function GET(
  _req: Request,
  context: { params: Promise<{ surah: string }> },
) {
  const { surah } = await context.params;
  const n = parseIntParam(surah, 1, 114);
  if (n === null) return badRequest('surah must be 1–114');
  const data = await getTajweedSurah(n);
  if (!data) return notFound('Tajweed text is not available from the active source');
  return ok(data, { revalidate: 86_400 });
}
