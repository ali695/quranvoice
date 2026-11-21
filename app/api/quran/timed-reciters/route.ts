import { ok } from '@/lib/api/responses';
import { listTimedReciters } from '@/lib/services/audioService';

export const revalidate = 86400;

/** Reciters whose full-surah audio carries real word-level timing. */
export async function GET() {
  const data = await listTimedReciters();
  return ok(data, { revalidate: 86400 });
}
