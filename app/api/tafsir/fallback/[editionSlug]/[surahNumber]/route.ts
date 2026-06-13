import { badRequest, notFound, ok, parseIntParam } from '@/lib/api/responses';
import { fetchFallbackSurah } from '@/lib/tafsir/spa5k-client';

export const revalidate = 86400;

export async function GET(
  _req: Request,
  context: { params: Promise<{ editionSlug: string; surahNumber: string }> },
) {
  const { editionSlug, surahNumber } = await context.params;
  if (!/^[a-z0-9-]+$/i.test(editionSlug)) return badRequest('invalid edition slug');
  const surah = parseIntParam(surahNumber, 1, 114);
  if (surah === null) return badRequest('surahNumber must be 1–114');

  const data = await fetchFallbackSurah(editionSlug, surah);
  if (!data) return notFound('No fallback tafsir for this edition/surah');
  return ok(data, { revalidate: 86_400 });
}
