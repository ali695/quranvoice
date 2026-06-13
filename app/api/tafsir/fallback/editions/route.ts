import { ok } from '@/lib/api/responses';
import { listFallbackEditions } from '@/lib/services/tafsir-fallback.service';

export const revalidate = 86400;

export async function GET(req: Request) {
  const language = new URL(req.url).searchParams.get('lang') ?? undefined;
  const data = await listFallbackEditions(language || undefined);
  return ok(data, { revalidate: 86_400 });
}
