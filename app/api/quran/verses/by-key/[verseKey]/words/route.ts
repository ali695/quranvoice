import { badRequest, notFound, ok } from '@/lib/api/responses';
import { getVerseWords } from '@/lib/services/wordByWordService';

export const revalidate = 86400;

const VERSE_KEY = /^(\d{1,3}):(\d{1,3})$/;

export async function GET(
  req: Request,
  context: { params: Promise<{ verseKey: string }> },
) {
  const { verseKey } = await context.params;
  const decoded = decodeURIComponent(verseKey);
  const m = decoded.match(VERSE_KEY);
  if (!m) return badRequest('verseKey must look like "2:255"');
  const surah = Number(m[1]);
  const ayah = Number(m[2]);
  if (surah < 1 || surah > 114 || ayah < 1) return badRequest('verseKey out of range');

  const language = new URL(req.url).searchParams.get('lang') ?? 'en';
  const data = await getVerseWords(surah, ayah, language);
  if (!data) {
    return notFound('Word-by-word data is not available from the active source for this verse');
  }
  return ok(data, { revalidate: 86_400 });
}
