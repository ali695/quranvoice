import { badRequest, ok } from '@/lib/api/responses';
import { listTranslations } from '@/lib/services/translationService';

export const revalidate = 86400;

/** Returns the catalog record for a single translation resource. */
export async function GET(
  _req: Request,
  context: { params: Promise<{ translationId: string }> },
) {
  const { translationId } = await context.params;
  if (!/^[a-z0-9._-]+$/i.test(translationId)) return badRequest('invalid translation id');
  const all = await listTranslations();
  const match = all.find((t) => String(t.id) === translationId);
  return ok(match ?? null, { revalidate: 86_400 });
}
