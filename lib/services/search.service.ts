/**
 * Navigation search service (server + client safe — pure metadata).
 *
 * Resolves a query to a single best navigation target and to a ranked list of
 * navigation matches (surahs/ayah/juz/page). This always works from the local
 * catalog and never depends on the Quran.Foundation search scope.
 */

import { SURAHS } from '@/lib/data/surahs';
import { normalizeName } from '@/lib/search/surah-aliases';
import { parseQuery } from '@/lib/search/query-parser';
import { routeQuery, type ResolvedQuery } from '@/lib/search/search-router';

/** Best single navigation target for a query, or null. */
export function resolveQuery(q: string, locale?: string): ResolvedQuery | null {
  return routeQuery(parseQuery(q), q, locale);
}

/**
 * Ranked navigation matches. Includes the exact/structured target first, then
 * surah-name suggestions (prefix > substring) for partial input.
 */
export function navigationMatches(q: string, locale?: string, limit = 8): ResolvedQuery[] {
  const query = (q || '').trim();
  if (!query) return [];

  const out: ResolvedQuery[] = [];
  const seen = new Set<string>();

  const push = (r: ResolvedQuery | null) => {
    if (!r) return;
    if (seen.has(r.targetUrl)) return;
    seen.add(r.targetUrl);
    out.push(r);
  };

  // 1. Primary structured/exact target.
  push(resolveQuery(query, locale));

  // 2. Surah-name suggestions (skip pure references / numbers).
  if (!/^\s*\d/.test(query) && !/[:/]/.test(query)) {
    const n = normalizeName(query);
    if (n.length >= 2) {
      const scored = SURAHS.map((s) => {
        const name = normalizeName(s.transliteration);
        const score = name === n ? 3 : name.startsWith(n) ? 2 : name.includes(n) ? 1 : 0;
        return { s, score };
      })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score || a.s.number - b.s.number);
      for (const { s } of scored) {
        push(resolveQuery(`surah ${s.number}`, locale));
        if (out.length >= limit) break;
      }
    }
  }

  return out.slice(0, limit);
}
