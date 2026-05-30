import { ok } from '@/lib/api/responses';
import { foundationFetch } from '@/lib/quran-foundation/client';
import { F } from '@/lib/quran-foundation/endpoints';
import { isFoundationConfigured } from '@/lib/quran-foundation/env';

export const revalidate = 86400;

const FALLBACK = [
  { id: 1, name: 'English', iso_code: 'en' },
  { id: 2, name: 'Arabic', iso_code: 'ar' },
  { id: 3, name: 'Urdu', iso_code: 'ur' },
  { id: 4, name: 'French', iso_code: 'fr' },
  { id: 5, name: 'Turkish', iso_code: 'tr' },
  { id: 6, name: 'Indonesian', iso_code: 'id' },
  { id: 7, name: 'Spanish', iso_code: 'es' },
];

export async function GET() {
  if (isFoundationConfigured()) {
    const json = await foundationFetch<{ languages?: unknown[] }>(F.languages(), {
      revalidate: 86_400,
    });
    if (json?.languages?.length) return ok(json.languages, { revalidate: 86_400 });
  }
  return ok(FALLBACK, { revalidate: 86_400 });
}
