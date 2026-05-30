import { ok } from '@/lib/api/responses';
import { listTranslations } from '@/lib/services/translationService';

export const revalidate = 86400;

export async function GET() {
  const data = await listTranslations();
  return ok(data, { revalidate: 86400 });
}
