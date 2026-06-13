import { badRequest, ok } from '@/lib/api/responses';
import { resolveTafsirForVerse } from '@/lib/services/tafsir.service';

export const revalidate = 3600;

const VERSE_KEY = /^(\d{1,3}):(\d{1,3})$/;

/**
 * Resolved tafsir for a specific selected source + verse, with fallback.
 * tafsirId may be a Quran.Foundation numeric id, a spa5k slug, or "auto".
 * Query: lang (default en), fallback (1/0). Returns NormalizedTafsir | null.
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ tafsirId: string; verseKey: string }> },
) {
  const { tafsirId, verseKey } = await context.params;
  if (!/^[a-z0-9._-]+$/i.test(tafsirId)) return badRequest('invalid tafsir id');
  const decoded = decodeURIComponent(verseKey);
  const m = decoded.match(VERSE_KEY);
  if (!m) return badRequest('invalid verseKey');
  const surah = Number(m[1]);
  const ayah = Number(m[2]);

  const url = new URL(req.url);
  const language = url.searchParams.get('lang') ?? 'en';
  const fallbackEnabled = url.searchParams.get('fallback') !== '0';
  const selectedId = tafsirId === 'auto' ? undefined : tafsirId;

  const data = await resolveTafsirForVerse({
    surah,
    ayah,
    selectedId,
    language,
    fallbackEnabled,
  });
  return ok(data, { revalidate: 3600 });
}
