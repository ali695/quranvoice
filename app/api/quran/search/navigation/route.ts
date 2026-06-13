/**
 * GET /api/quran/search/navigation?q=...&locale=...
 *
 * Ranked navigation matches (surah / ayah / juz / page) from local metadata.
 * Always available; no Quran.Foundation scope required; no secrets.
 */

import { badRequest, ok } from '@/lib/api/responses';
import { navigationMatches } from '@/lib/services/search.service';

export const revalidate = 3600;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q')?.trim() ?? '';
  if (!q) return badRequest('Missing query parameter `q`');
  if (q.length > 200) return badRequest('Query too long');

  const locale =
    url.searchParams.get('locale') ?? req.headers.get('x-quranvoice-locale') ?? undefined;

  return ok(navigationMatches(q, locale ?? undefined));
}
