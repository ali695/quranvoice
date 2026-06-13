import { badRequest, notFound, ok, parseIntParam } from '@/lib/api/responses';
import { getFallbackTafsirForVerse } from '@/lib/services/tafsir-fallback.service';

export const revalidate = 86400;

export async function GET(
  _req: Request,
  context: { params: Promise<{ editionSlug: string; surahNumber: string; ayahNumber: string }> },
) {
  const { editionSlug, surahNumber, ayahNumber } = await context.params;
  if (!/^[a-z0-9-]+$/i.test(editionSlug)) return badRequest('invalid edition slug');
  const surah = parseIntParam(surahNumber, 1, 114);
  if (surah === null) return badRequest('surahNumber must be 1–114');
  const ayah = parseIntParam(ayahNumber, 1, 300);
  if (ayah === null) return badRequest('ayahNumber must be positive');

  const data = await getFallbackTafsirForVerse(editionSlug, surah, ayah);
  if (!data) return notFound('No fallback tafsir for this edition/verse');
  return ok(data, { revalidate: 86_400 });
}
