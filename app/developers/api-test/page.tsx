import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { foundationFetch } from '@/lib/quran-foundation/client';
import { F } from '@/lib/quran-foundation/endpoints';
import { isFoundationConfigured } from '@/lib/quran-foundation/env';
import {
  clearFoundationTokenCache,
  getFoundationToken,
  getFoundationTokenStatus,
} from '@/lib/quran-foundation/token-manager';
import { getResourcesSummary } from '@/lib/services/resource-registry.service';
import { getSearchScopeStatus } from '@/lib/services/searchService';
import {
  fetchArchiveMetadataForShanENuzool,
  getShanENuzoolStats,
} from '@/lib/services/shanENuzool.service';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const metadata: Metadata = {
  title: 'API diagnostics',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

interface Probe {
  label: string;
  ok: boolean;
  detail?: string;
}

export default async function ApiTestPage() {
  // Dev-only.
  if (process.env.NODE_ENV !== 'development') notFound();

  const probes: Probe[] = [];

  // Env presence (mask values).
  probes.push({
    label: 'QURAN_FOUNDATION_CLIENT_ID present',
    ok: Boolean(process.env.QURAN_FOUNDATION_CLIENT_ID),
  });
  probes.push({
    label: 'QURAN_FOUNDATION_CLIENT_SECRET present',
    ok: Boolean(process.env.QURAN_FOUNDATION_CLIENT_SECRET),
  });
  probes.push({
    label: 'NEXT_PUBLIC_SUPABASE_URL present',
    ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
  });
  probes.push({
    label: 'NEXT_PUBLIC_SUPABASE_ANON_KEY present',
    ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  });
  probes.push({
    label: 'SUPABASE_SERVICE_ROLE_KEY present',
    ok: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  });

  // Foundation OAuth.
  clearFoundationTokenCache();
  const token = isFoundationConfigured() ? await getFoundationToken() : null;
  probes.push({
    label: 'Quran.Foundation OAuth token',
    ok: Boolean(token),
    detail: token
      ? `cached (expires in ${Math.round((getFoundationTokenStatus().expiresInMs ?? 0) / 60_000)} min)`
      : 'not configured or auth failed',
  });

  // Live Foundation calls.
  if (token) {
    const [chapters, verse, translations, tafsirs, recitations, languages] = await Promise.all([
      foundationFetch<{ chapters?: unknown[] }>(F.chapters()),
      foundationFetch<{ verse?: unknown }>(F.verseByKey('2:255', 'fields=text_uthmani')),
      foundationFetch<{ translations?: unknown[] }>(F.translationResources('en')),
      foundationFetch<{ tafsirs?: unknown[] }>(F.tafsirResources('en')),
      foundationFetch<{ recitations?: unknown[] }>(F.recitationResources()),
      foundationFetch<{ languages?: unknown[] }>(F.languages()),
    ]);
    probes.push({
      label: 'Foundation /chapters',
      ok: Boolean(chapters?.chapters?.length),
      detail: chapters?.chapters ? `${chapters.chapters.length} chapters` : 'no data',
    });
    probes.push({
      label: 'Foundation verse 2:255',
      ok: Boolean(verse?.verse),
      detail: verse?.verse ? 'Uthmani text returned' : 'no data',
    });
    probes.push({
      label: 'Foundation translations',
      ok: Boolean(translations?.translations?.length),
      detail: `${translations?.translations?.length ?? 0} resources`,
    });
    probes.push({
      label: 'Foundation tafsirs',
      ok: Boolean(tafsirs?.tafsirs?.length),
      detail: `${tafsirs?.tafsirs?.length ?? 0} resources`,
    });
    probes.push({
      label: 'Foundation recitations',
      ok: Boolean(recitations?.recitations?.length),
      detail: `${recitations?.recitations?.length ?? 0} resources`,
    });
    probes.push({
      label: 'Foundation languages',
      ok: Boolean(languages?.languages?.length),
      detail: `${languages?.languages?.length ?? 0} listed`,
    });
  }

  const scope = await getSearchScopeStatus();
  probes.push({
    label: 'Foundation search scope',
    ok: scope.available,
    detail: scope.available ? 'enabled for this client' : scope.reason,
  });

  // Supabase ping (read profiles count via service role — bypass RLS).
  let supabaseOk = false;
  let supabaseDetail = 'not configured';
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin();
    if (sb) {
      try {
        const { count, error } = await sb
          .from('profiles')
          .select('id', { count: 'exact', head: true });
        supabaseOk = !error;
        supabaseDetail = error ? error.message : `OK · ${count ?? 0} profiles`;
      } catch (err) {
        supabaseDetail = `connection error: ${(err as Error).message}`;
      }
    } else {
      supabaseDetail = 'service role key not set';
    }
  }
  probes.push({ label: 'Supabase connection', ok: supabaseOk, detail: supabaseDetail });

  // Shan-e-Nuzool.
  const shan = await getShanENuzoolStats();
  probes.push({
    label: 'Shan-e-Nuzool review table',
    ok: shan.configured,
    detail: shan.configured
      ? `${shan.approvedCount} approved / ${shan.pendingCount} pending`
      : 'Supabase not configured',
  });

  // Archive.org metadata.
  const archive = await fetchArchiveMetadataForShanENuzool();
  probes.push({
    label: 'Archive.org metadata fetch',
    ok: Boolean(archive),
    detail: archive ? archive.identifier ?? 'fetched' : 'unreachable',
  });

  // Resource summary.
  const summary = await getResourcesSummary();

  return (
    <>
      <PageHeader
        eyebrow="Developer"
        title="API diagnostics"
        description="Development-only probes for Quran.Foundation, Supabase, and Archive.org. Secret values are never displayed — only their presence is checked."
      />
      <AppShell>
        <Card variant="elevated" className="p-5">
          <ul className="flex flex-col divide-y divide-ink-700/40">
            {probes.map((p) => (
              <li key={p.label} className="flex items-start gap-3 py-3">
                <span
                  className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${
                    p.ok
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-red-500/15 text-red-300'
                  }`}
                >
                  <Icon name={p.ok ? 'check' : 'close'} size={12} />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-cream-50">{p.label}</p>
                  {p.detail && <p className="text-xs text-cream-200/55">{p.detail}</p>}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <h2 className="mt-8 font-display text-lg text-cream-50">Resource summary</h2>
        <pre className="mt-3 max-h-96 overflow-auto rounded-2xl border border-ink-700/60 bg-ink-950 p-4 text-xs leading-relaxed text-cream-200/80">
          {JSON.stringify(summary, null, 2)}
        </pre>
      </AppShell>
    </>
  );
}
