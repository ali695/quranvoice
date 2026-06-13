import { badRequest, ok, parseIntParam } from '@/lib/api/responses';
import { resolveTafsirForVerse } from '@/lib/services/tafsir.service';

export const revalidate = 3600;

/**
 * Resolved tafsir for a verse using the source priority:
 *   QF selected → QF default → spa5k selected → spa5k default → null.
 * Returns a single NormalizedTafsir (or null) so the UI renders QF and
 * fallback identically with a clear source label / fallback badge.
 *
 * Query: id (selected tafsir id/slug), lang (default en), fallback (1/0).
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ surah: string; ayah: string }> },
) {
  const { surah, ayah } = await context.params;
  const s = parseIntParam(surah, 1, 114);
  if (s === null) return badRequest('surah must be 1–114');
  const a = parseIntParam(ayah, 1, 300);
  if (a === null) return badRequest('ayah must be positive');

  const url = new URL(req.url);
  const id = url.searchParams.get('id') ?? undefined;
  const language = url.searchParams.get('lang') ?? 'en';
  const fallbackEnabled = url.searchParams.get('fallback') !== '0';

  const data = await resolveTafsirForVerse({
    surah: s,
    ayah: a,
    selectedId: id,
    language,
    fallbackEnabled,
  });
  return ok(data, { revalidate: 3600 });
}
