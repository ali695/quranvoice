import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { listReciters } from '@/lib/services/audioService';

export const metadata: Metadata = {
  title: 'Recitations',
  description: 'Quran audio recitations from renowned reciters. Source attribution included.',
};

export default async function RecitationsPage() {
  const reciters = await listReciters();
  return (
    <>
      <PageHeader
        eyebrow="Audio"
        title="Recitations"
        description="Audio recitations of the Noble Quran. Audio sources are listed where verified."
        actions={
          <Button href="/reciters" variant="outline">
            All reciters
            <Icon name="arrow-right" size={14} />
          </Button>
        }
      />
      <AppShell>
        <div className="rounded-2xl border border-gold-500/20 bg-gold-500/5 p-5">
          <p className="text-sm text-cream-100/90">
            <span className="font-medium text-gold-200">Source disclosure.</span>{' '}
            All recitations are streamed from third-party audio CDNs. Listed source attribution is
            shown on each reciter card; verified-source badges appear once a recitation is fully
            validated by the Resource Registry.
          </p>
        </div>

        <h2 className="mt-10 font-display text-2xl font-medium text-cream-50">All reciters</h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reciters.slice(0, 30).map((r) => (
            <Card key={r.id} as="li" variant="elevated" className="flex items-center gap-4 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-200">
                <Icon name="volume" size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-cream-50">{r.name}</p>
                <p className="text-xs text-cream-200/55">{r.source.name}</p>
              </div>
              <Button href={`/reciters/${r.id}`} size="sm" variant="secondary">
                Open
              </Button>
            </Card>
          ))}
        </ul>
      </AppShell>
    </>
  );
}
