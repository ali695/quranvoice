import { badRequest, notFound, ok, parseIntParam } from '@/lib/api/responses';
import { getMushafPage } from '@/lib/services/mushafService';
import { MUSHAF_LAYOUTS } from '@/lib/types/mushaf';

export const revalidate = 86400;

export async function GET(
  req: Request,
  context: { params: Promise<{ page: string }> },
) {
  const { page } = await context.params;
  const n = parseIntParam(page, 1, 604);
  if (n === null) return badRequest('page must be 1–604');

  const mushafParam = new URL(req.url).searchParams.get('mushaf');
  const mushafId = mushafParam ? Number(mushafParam) : MUSHAF_LAYOUTS[0].mushafId;
  if (!MUSHAF_LAYOUTS.some((l) => l.mushafId === mushafId)) {
    return badRequest('unsupported mushaf layout');
  }

  const data = await getMushafPage(n, mushafId);
  if (!data) {
    return notFound('Mushaf page layout is not available from the active source');
  }
  return ok(data, { revalidate: 86_400 });
}
