/**
 * Shan-e-Nuzool service — server-only.
 *
 * Reads ONLY approved entries from Supabase. Never auto-generates,
 * never attaches OCR text to ayahs without review. If Supabase is not
 * configured, returns an empty list and the UI shows the unavailable
 * state — never any synthesized commentary.
 *
 * The Archive.org source (AyaatQuraniKayShanENuzool) is registered as a
 * reference for the review workflow; raw text from Archive is not served
 * to readers.
 */

import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export interface ShanENuzoolEntry {
  id: string;
  surah: number;
  ayah: number;
  verseKey: string;
  language: string;
  title?: string;
  body: string;
  pageReference?: string;
  authenticityStatus?: 'sahih' | 'hasan' | 'weak' | 'unknown' | 'multiple_reports';
  sourceTitle: string;
  sourceAuthor?: string;
  sourceArchiveUrl?: string;
  reviewedAt?: string;
}

interface RowEntry {
  id: string;
  surah: number;
  ayah: number;
  verse_key: string;
  language: string;
  title: string | null;
  body: string;
  page_reference: string | null;
  authenticity_status: ShanENuzoolEntry['authenticityStatus'] | null;
  reviewed_at: string | null;
  shan_e_nuzool_sources: {
    title: string;
    author: string | null;
    archive_url: string | null;
  } | null;
}

export async function getShanENuzoolForVerse(verseKey: string): Promise<ShanENuzoolEntry[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = getSupabaseAdmin();
  if (!sb) return [];
  const [surahStr, ayahStr] = verseKey.split(':');
  const surah = Number(surahStr);
  const ayah = Number(ayahStr);
  if (!Number.isInteger(surah) || !Number.isInteger(ayah)) return [];

  // Approved entries directly attached to this ayah, OR via a range that covers it.
  const { data: direct } = await sb
    .from('shan_e_nuzool_entries')
    .select(`
      id, surah, ayah, verse_key, language, title, body, page_reference,
      authenticity_status, reviewed_at,
      shan_e_nuzool_sources ( title, author, archive_url )
    `)
    .eq('status', 'approved')
    .eq('surah', surah)
    .eq('ayah', ayah);

  const rows: RowEntry[] = (direct ?? []) as unknown as RowEntry[];

  // Range-attached entries.
  const { data: ranges } = await sb
    .from('shan_e_nuzool_entry_ranges')
    .select('entry_id, surah, start_ayah, end_ayah, shan_e_nuzool_entries!inner(id, status)')
    .eq('surah', surah)
    .lte('start_ayah', ayah)
    .gte('end_ayah', ayah);

  const rangeIds = (ranges ?? [])
    .filter((r) => {
      const entry = (r as unknown as { shan_e_nuzool_entries: { status: string } | null }).shan_e_nuzool_entries;
      return entry?.status === 'approved';
    })
    .map((r) => (r as unknown as { entry_id: string }).entry_id);

  if (rangeIds.length > 0) {
    const { data: rangeEntries } = await sb
      .from('shan_e_nuzool_entries')
      .select(`
        id, surah, ayah, verse_key, language, title, body, page_reference,
        authenticity_status, reviewed_at,
        shan_e_nuzool_sources ( title, author, archive_url )
      `)
      .eq('status', 'approved')
      .in('id', rangeIds);
    if (rangeEntries) rows.push(...((rangeEntries as unknown) as RowEntry[]));
  }

  // De-dup by id.
  const seen = new Set<string>();
  return rows
    .filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true)))
    .map<ShanENuzoolEntry>((r) => ({
      id: r.id,
      surah: r.surah,
      ayah: r.ayah,
      verseKey: r.verse_key,
      language: r.language,
      title: r.title ?? undefined,
      body: r.body,
      pageReference: r.page_reference ?? undefined,
      authenticityStatus: r.authenticity_status ?? undefined,
      sourceTitle: r.shan_e_nuzool_sources?.title ?? 'Unknown source',
      sourceAuthor: r.shan_e_nuzool_sources?.author ?? undefined,
      sourceArchiveUrl: r.shan_e_nuzool_sources?.archive_url ?? undefined,
      reviewedAt: r.reviewed_at ?? undefined,
    }));
}

export interface ShanENuzoolStats {
  configured: boolean;
  approvedCount: number;
  pendingCount: number;
  sources: Array<{ title: string; author?: string; archiveUrl?: string }>;
}

export async function getShanENuzoolStats(): Promise<ShanENuzoolStats> {
  if (!isSupabaseConfigured()) {
    return { configured: false, approvedCount: 0, pendingCount: 0, sources: [] };
  }
  const sb = getSupabaseAdmin();
  if (!sb) return { configured: false, approvedCount: 0, pendingCount: 0, sources: [] };
  const [{ count: approvedCount }, { count: pendingCount }, { data: sources }] = await Promise.all([
    sb.from('shan_e_nuzool_entries').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    sb.from('shan_e_nuzool_entries').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    sb.from('shan_e_nuzool_sources').select('title, author, archive_url'),
  ]);
  return {
    configured: true,
    approvedCount: approvedCount ?? 0,
    pendingCount: pendingCount ?? 0,
    sources: (sources ?? []).map((s) => ({
      title: s.title,
      author: s.author ?? undefined,
      archiveUrl: s.archive_url ?? undefined,
    })),
  };
}

export interface ArchiveMetadata {
  identifier: string;
  title?: string;
  creator?: string;
  language?: string;
  uploader?: string;
  publicdate?: string;
  description?: string;
}

/** Fetch metadata for the registered Archive.org source. Public metadata only. */
export async function fetchArchiveMetadataForShanENuzool(): Promise<ArchiveMetadata | null> {
  try {
    const res = await fetch('https://archive.org/metadata/AyaatQuraniKayShanENuzool', {
      next: { revalidate: 86_400 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { metadata?: ArchiveMetadata };
    if (!json.metadata) return null;
    return json.metadata;
  } catch {
    return null;
  }
}
