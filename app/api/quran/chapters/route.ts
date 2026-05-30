import { ok } from '@/lib/api/responses';
import { listAllSurahs } from '@/lib/services/quranService';

export const revalidate = 86400;

export async function GET() {
  const data = await listAllSurahs();
  return ok(data, { revalidate: 86400 });
}
