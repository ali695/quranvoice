import { ok } from '@/lib/api/responses';
import { listTafsirs } from '@/lib/services/tafsirService';

export const revalidate = 86400;

export async function GET() {
  const data = await listTafsirs();
  return ok(data);
}
