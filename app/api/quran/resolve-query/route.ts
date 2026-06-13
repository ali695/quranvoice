/**
 * GET /api/quran/resolve-query?q=...&locale=...
 *
 * Resolves a free-text query to a single navigation target (surah / ayah /
 * juz / page) using local Quran metadata. Always available — does not need the
 * Quran.Foundation search scope. Validates against real bounds (never routes
 * to an invalid surah/ayah/juz/page). No secrets.
 */

import { badRequest, ok } from '@/lib/api/responses';
import { resolveQuery } from '@/lib/services/search.service';

export const revalidate = 3600;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q')?.trim() ?? '';
  if (!q) return badRequest('Missing query parameter `q`');
  if (q.length > 200) return badRequest('Query too long');

  const locale =
    url.searchParams.get('locale') ??
    req.headers.get('x-quranvoice-locale') ??
    undefined;

  const resolved = resolveQuery(q, locale ?? undefined);
  if (!resolved) {
    return ok({ type: 'none', query: q, confidence: 'low', targetUrl: null });
  }
  return ok(resolved);
}
