import { badRequest, notFound, ok, parseIntParam } from '@/lib/api/responses';
import { getSurahWithAyahs } from '@/lib/services/quranService';

export const revalidate = 3600;

export async function GET(
  _req: Request,
  context: { params: Promise<{ surah: string }> },
) {
  const { surah } = await context.params;
  const n = parseIntParam(surah, 1, 114);
  if (n === null) return badRequest('surah must be 1–114');
  const data = await getSurahWithAyahs(n);
  if (!data) return notFound('Surah not available');
  return ok(data, { revalidate: 3600 });
}
