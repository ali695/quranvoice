import { badRequest, ok, parseIntParam } from '@/lib/api/responses';
import { getTafsirForAyah } from '@/lib/services/tafsirService';

export const revalidate = 3600;

export async function GET(
  req: Request,
  context: { params: Promise<{ surah: string; ayah: string }> },
) {
  const { surah, ayah } = await context.params;
  const s = parseIntParam(surah, 1, 114);
  if (s === null) return badRequest('surah must be 1–114');
  const a = parseIntParam(ayah, 1, 300);
  if (a === null) return badRequest('ayah must be positive');
  const id = new URL(req.url).searchParams.get('id') ?? undefined;
  const data = await getTafsirForAyah(s, a, id);
  return ok(data ?? []);
}
