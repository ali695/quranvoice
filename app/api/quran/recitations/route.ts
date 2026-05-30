import { ok } from '@/lib/api/responses';
import { listReciters } from '@/lib/services/audioService';

export const revalidate = 86400;

export async function GET() {
  const data = await listReciters();
  return ok(data, { revalidate: 86400 });
}
