import { alquranCloudFetch } from '@/lib/api/quranApiProxy';
import { badRequest, notFound, ok, parseIntParam } from '@/lib/api/responses';
import { foundationFetch } from '@/lib/quran-foundation/client';
import { F } from '@/lib/quran-foundation/endpoints';
import { isFoundationConfigured } from '@/lib/quran-foundation/env';

export const revalidate = 3600;

export async function GET(
  _req: Request,
  context: { params: Promise<{ page: string }> },
) {
  const { page } = await context.params;
  const n = parseIntParam(page, 1, 604);
  if (n === null) return badRequest('page must be 1–604');

  if (isFoundationConfigured()) {
    const json = await foundationFetch<{ verses?: unknown[] }>(F.versesByPage(n, 'per_page=300'));
    if (json?.verses?.length) return ok({ source: 'foundation', verses: json.verses });
  }
  const cloud = await alquranCloudFetch<{ data?: unknown }>(`/page/${n}/quran-uthmani`);
  if (!cloud?.data) return notFound('Page not available');
  return ok({ source: 'alquran-cloud', verses: cloud.data });
}
