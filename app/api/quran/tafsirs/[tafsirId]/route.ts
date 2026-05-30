import { badRequest, ok } from '@/lib/api/responses';
import { listTafsirs } from '@/lib/services/tafsirService';

export const revalidate = 86400;

export async function GET(
  _req: Request,
  context: { params: Promise<{ tafsirId: string }> },
) {
  const { tafsirId } = await context.params;
  if (!/^[a-z0-9._-]+$/i.test(tafsirId)) return badRequest('invalid tafsir id');
  const all = await listTafsirs();
  const match = all.find((t) => String(t.id) === tafsirId);
  return ok(match ?? null, { revalidate: 86_400 });
}
