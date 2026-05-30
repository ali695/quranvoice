import { badRequest, ok, parseIntParam } from '@/lib/api/responses';
import { getAsbabForAyah } from '@/lib/services/asbabService';

export const revalidate = 3600;

export async function GET(
  _req: Request,
  context: { params: Promise<{ surah: string; ayah: string }> },
) {
  const { surah, ayah } = await context.params;
  const s = parseIntParam(surah, 1, 114);
  if (s === null) return badRequest('surah must be 1–114');
  const a = parseIntParam(ayah, 1, 300);
  if (a === null) return badRequest('ayah must be positive');
  return ok(await getAsbabForAyah(s, a));
}
