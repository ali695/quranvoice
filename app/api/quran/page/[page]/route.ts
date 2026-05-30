import { alquranCloudFetch } from '@/lib/api/quranApiProxy';
import { badRequest, notFound, ok, parseIntParam } from '@/lib/api/responses';

export const revalidate = 3600;

export async function GET(
  _req: Request,
  context: { params: Promise<{ page: string }> },
) {
  const { page } = await context.params;
  const n = parseIntParam(page, 1, 604);
  if (n === null) return badRequest('page must be 1–604');
  const json = await alquranCloudFetch<{ data?: unknown }>(`/page/${n}/quran-uthmani`);
  if (!json?.data) return notFound('Page not available');
  return ok(json.data);
}
