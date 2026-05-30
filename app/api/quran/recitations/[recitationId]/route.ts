import { badRequest, ok } from '@/lib/api/responses';
import { getReciter } from '@/lib/services/audioService';

export const revalidate = 86400;

export async function GET(
  _req: Request,
  context: { params: Promise<{ recitationId: string }> },
) {
  const { recitationId } = await context.params;
  if (!/^[a-z0-9._-]+$/i.test(recitationId)) return badRequest('invalid recitation id');
  const r = await getReciter(recitationId);
  return ok(r);
}
