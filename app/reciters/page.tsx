import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { ReciterCard } from '@/components/audio/ReciterCard';
import { listReciters } from '@/lib/services/audioService';

export const metadata: Metadata = {
  title: 'Reciters',
  description: 'Reciter directory with profile pages, audio styles, and source attribution.',
};

export default async function RecitersPage() {
  const reciters = await listReciters();
  return (
    <>
      <PageHeader
        eyebrow="Audio"
        title="Reciters"
        description={`${reciters.length} reciters listed. Geometric avatars are used in place of photographs.`}
      />
      <AppShell>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reciters.map((r, i) => (
            <li key={r.id}>
              <ReciterCard reciter={r} index={i} />
            </li>
          ))}
        </ul>
      </AppShell>
    </>
  );
}
