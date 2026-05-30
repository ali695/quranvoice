import { badRequest, notFound, ok, parseIntParam } from '@/lib/api/responses';
import { getSurahMeta } from '@/lib/services/quranService';

export const revalidate = 86400;

export async function GET(
  _req: Request,
  context: { params: Promise<{ chapterId: string }> },
) {
  const { chapterId } = await context.params;
  const n = parseIntParam(chapterId, 1, 114);
  if (n === null) return badRequest('chapterId must be 1–114');
  const meta = await getSurahMeta(n);
  if (!meta) return notFound('Chapter not found');
  return ok(meta, { revalidate: 86_400 });
}
