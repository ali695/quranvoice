import { badRequest, ok } from '@/lib/api/responses';
import { getAsbabForAyah } from '@/lib/services/asbabService';

export const revalidate = 600;

const VERSE_KEY = /^(\d{1,3}):(\d{1,3})$/;

export async function GET(
  _req: Request,
  context: { params: Promise<{ verseKey: string }> },
) {
  const { verseKey } = await context.params;
  const decoded = decodeURIComponent(verseKey);
  const m = decoded.match(VERSE_KEY);
  if (!m) return badRequest('invalid verseKey');
  const data = await getAsbabForAyah(Number(m[1]), Number(m[2]));
  return ok(data);
}
