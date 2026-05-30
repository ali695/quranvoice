import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { UnavailableState } from '@/components/ui/ErrorState';
import { getShanENuzoolStats } from '@/lib/services/shanENuzool.service';

export const metadata: Metadata = {
  title: 'Shan-e-Nuzool',
  description: 'Reviewed Shan-e-Nuzool entries by ayah, with full source attribution.',
};

export const revalidate = 600;

export default async function ShanENuzoolIndex() {
  const stats = await getShanENuzoolStats();
  return (
    <>
      <PageHeader
        eyebrow="Study"
        title="Shan-e-Nuzool"
        description="QuranVoice only shows Shan-e-Nuzool after source review."
        actions={
          <Link
            href="/sources/shan-e-nuzool"
            className="inline-flex items-center gap-2 rounded-lg border border-ink-600/70 bg-ink-800/40 px-3 py-2 text-xs text-cream-200/80 hover:border-gold-500/40"
          >
            <Icon name="scroll" size={13} />
            Source disclosure
          </Link>
        }
      />
      <AppShell>
        <Card variant="elevated" className="p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Approved entries" value={stats.approvedCount} />
            <Stat label="Pending review (admin)" value={stats.pendingCount} />
            <Stat label="Registered sources" value={stats.sources.length} />
          </div>
        </Card>

        {stats.approvedCount === 0 ? (
          <div className="mt-6">
            <UnavailableState
              title="No reviewed entries yet"
              description="QuranVoice only displays Shan-e-Nuzool entries after they pass source review. When you open an ayah and tap the Shan-e-Nuzool button, the drawer will show reviewed entries here."
            />
          </div>
        ) : (
          <p className="mt-6 text-sm text-cream-200/65">
            Open any ayah and tap <strong>Shan-e-Nuzool</strong> to see reviewed entries inline.
          </p>
        )}
      </AppShell>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-ink-700/60 bg-ink-850/60 p-4">
      <p className="text-xs uppercase tracking-wider text-cream-200/45">{label}</p>
      <p className="mt-1 font-display text-2xl text-cream-50">{value}</p>
    </div>
  );
}
