import { badRequest, notFound, ok, parseIntParam } from '@/lib/api/responses';
import { getTranslationForSurah } from '@/lib/services/translationService';

export const revalidate = 3600;

export async function GET(
  req: Request,
  context: { params: Promise<{ chapterId: string }> },
) {
  const { chapterId } = await context.params;
  const n = parseIntParam(chapterId, 1, 114);
  if (n === null) return badRequest('chapterId must be 1–114');
  const id = new URL(req.url).searchParams.get('id') ?? 'en.sahih';
  if (!/^[a-z0-9._-]+$/i.test(id)) return badRequest('invalid translation id');
  const data = await getTranslationForSurah(n, id);
  if (!data) return notFound('Translation not available');
  return ok(data);
}
