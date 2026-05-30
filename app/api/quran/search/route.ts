import { badRequest, ok } from '@/lib/api/responses';
import { search } from '@/lib/services/searchService';

export const revalidate = 60;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q')?.trim() ?? '';
  if (!q) return badRequest('Missing query parameter `q`');
  if (q.length > 200) return badRequest('Query too long');
  const results = await search(q);
  return ok(results);
}
