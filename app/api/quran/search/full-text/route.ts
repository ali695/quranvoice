/**
 * GET /api/quran/search/full-text?q=...
 *
 * Full Quran text search via Quran.Foundation — only when the search scope is
 * enabled for the client. When the scope is unavailable, returns a clean
 * scope_required envelope so the UI can keep navigation search working.
 */

import { NextResponse } from 'next/server';
import { badRequest } from '@/lib/api/responses';
import { getSearchScopeStatus, search } from '@/lib/services/searchService';

export const revalidate = 60;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q')?.trim() ?? '';
  if (!q) return badRequest('Missing query parameter `q`');
  if (q.length > 200) return badRequest('Query too long');

  const scope = await getSearchScopeStatus();
  if (!scope.available) {
    return NextResponse.json({
      success: false,
      type: 'scope_required',
      message:
        'Full Quran text search requires additional Quran.Foundation search scope. You can still jump to Surahs, Ayahs, Juz, pages, bookmarks and notes.',
    });
  }

  const results = await search(q);
  return NextResponse.json({ success: true, type: 'full_text', results });
}
