import { notFound, ok } from '@/lib/api/responses';
import { fetchArchiveMetadataForShanENuzool } from '@/lib/services/shanENuzool.service';

export const revalidate = 86400;

export async function GET() {
  const data = await fetchArchiveMetadataForShanENuzool();
  if (!data) return notFound('Archive metadata unavailable');
  return ok(data, { revalidate: 86_400 });
}
