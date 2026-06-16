import { badRequest, notFound, ok, parseIntParam } from '@/lib/api/responses';
import { getSurahScript, type ScriptType } from '@/lib/services/scriptService';

export const revalidate = 86400;

const VALID: ScriptType[] = ['uthmani', 'imlaei', 'uthmani_simple'];

export async function GET(
  _req: Request,
  context: { params: Promise<{ surah: string; type: string }> },
) {
  const { surah, type } = await context.params;
  const n = parseIntParam(surah, 1, 114);
  if (n === null) return badRequest('surah must be 1–114');
  if (!VALID.includes(type as ScriptType)) return badRequest('invalid script type');
  const data = await getSurahScript(n, type as ScriptType);
  if (!data) return notFound('Script not available from the active source');
  return ok(data, { revalidate: 86_400 });
}
