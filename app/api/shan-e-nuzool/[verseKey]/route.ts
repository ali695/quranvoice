import { badRequest, ok } from '@/lib/api/responses';
import { getShanENuzoolForVerse } from '@/lib/services/shanENuzool.service';

export const revalidate = 600;

const VERSE_KEY = /^(\d{1,3}):(\d{1,3})$/;

export async function GET(
  _req: Request,
  context: { params: Promise<{ verseKey: string }> },
) {
  const { verseKey } = await context.params;
  const decoded = decodeURIComponent(verseKey);
  if (!VERSE_KEY.test(decoded)) return badRequest('invalid verseKey');
  const entries = await getShanENuzoolForVerse(decoded);
  return ok(entries);
}
