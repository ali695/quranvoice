import { ok } from '@/lib/api/responses';
import { getResourcesSummary } from '@/lib/services/resource-registry.service';
import { getShanENuzoolStats } from '@/lib/services/shanENuzool.service';

export const revalidate = 600;

export async function GET() {
  const [summary, shan] = await Promise.all([
    getResourcesSummary(),
    getShanENuzoolStats(),
  ]);
  return ok({ ...summary, shanENuzool: shan }, { revalidate: 600 });
}
