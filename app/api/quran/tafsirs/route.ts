import { ok } from '@/lib/api/responses';
import { listAllTafsirResources } from '@/lib/services/tafsir.service';

export const revalidate = 86400;

/**
 * Tafsir resources from Quran.Foundation (primary) plus spa5k fallback
 * editions (secondary), each tagged with its provider so the UI can group
 * and label them. Query: lang (filter), fallback (1/0, default 1).
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const language = url.searchParams.get('lang') ?? undefined;
  const includeFallback = url.searchParams.get('fallback') !== '0';

  const { quranFoundation, fallback } = await listAllTafsirResources(language, includeFallback);
  // Flat, backward-compatible array (QF first), each tagged via provider/isFallback.
  return ok([...quranFoundation, ...fallback], { revalidate: 86_400 });
}
