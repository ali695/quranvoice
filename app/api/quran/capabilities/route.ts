/**
 * GET /api/quran/capabilities
 *
 * Returns the live capability snapshot for the active content provider.
 * The frontend uses this to decide what to unlock — settings, tafsir,
 * translations, audio, word-by-word — instead of hardcoding locked states.
 *
 * Safe to expose: it only reports *which features are available*, derived
 * from real provider responses. No secrets, tokens, or credentials.
 */

import { ok, serverError } from '@/lib/api/responses';
import { getCapabilities } from '@/lib/services/capability.service';

export const revalidate = 300;

export async function GET() {
  try {
    const capabilities = await getCapabilities();
    return ok(capabilities, { revalidate: 300 });
  } catch {
    return serverError('Failed to resolve capabilities');
  }
}
