import { badRequest, ok, parseIntParam, serverError } from '@/lib/api/responses';
import { foundationFetch } from '@/lib/quran-foundation/client';
import { F } from '@/lib/quran-foundation/endpoints';
import { isFoundationConfigured } from '@/lib/quran-foundation/env';

export const revalidate = 3600;

export async function GET(
  _req: Request,
  context: { params: Promise<{ juz: string }> },
) {
  const { juz } = await context.params;
  const n = parseIntParam(juz, 1, 30);
  if (n === null) return badRequest('juz must be 1–30');
  if (!isFoundationConfigured()) {
    return serverError('verses-by-juz requires Quran.Foundation to be configured');
  }
  const json = await foundationFetch<{ verses?: unknown[] }>(F.versesByJuz(n, 'per_page=300'));
  if (!json?.verses) return serverError('verses unavailable');
  return ok(json.verses);
}
