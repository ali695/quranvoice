import { badRequest, notFound, ok, parseIntParam } from '@/lib/api/responses';
import { JUZS } from '@/lib/data/juz';

export const revalidate = 86400;

export async function GET(
  _req: Request,
  context: { params: Promise<{ juz: string }> },
) {
  const { juz } = await context.params;
  const n = parseIntParam(juz, 1, 30);
  if (n === null) return badRequest('juz must be 1–30');
  const data = JUZS.find((j) => j.number === n);
  if (!data) return notFound('Juz not found');
  return ok(data, { revalidate: 86400 });
}
