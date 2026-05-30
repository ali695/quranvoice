import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { UnavailableState } from '@/components/ui/ErrorState';
import { listTafsirs } from '@/lib/services/tafsirService';

interface Params {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Tafsir: ${id}`,
    alternates: { canonical: `/tafsir/${id}` },
  };
}

export default async function TafsirDetail({ params }: Params) {
  const { id } = await params;
  if (!/^[a-z0-9._-]+$/i.test(id)) notFound();
  const all = await listTafsirs();
  const tafsir = all.find((x) => String(x.id) === id);
  return (
    <>
      <PageHeader
        eyebrow="Tafsir"
        title={tafsir?.name ?? 'Tafsir resource'}
        description={tafsir ? `By ${tafsir.authorName} · ${tafsir.languageName}` : undefined}
      />
      <AppShell>
        {!tafsir ? (
          <UnavailableState
            title="Tafsir resource not registered"
            description="This tafsir source is not registered in the Resource Registry. QuranVoice only displays content from registered, verified sources."
          />
        ) : (
          <Card variant="elevated" className="p-6">
            <h2 className="font-display text-lg text-cream-50">About this tafsir</h2>
            <p className="mt-2 text-sm leading-relaxed text-cream-200/75">
              When opened on a specific ayah, tafsir text from this source will appear inside the
              study panel of the reader. Source attribution is included with every entry.
            </p>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2 text-xs">
              <div>
                <dt className="text-cream-200/45 uppercase tracking-wider">Author</dt>
                <dd className="mt-0.5 text-cream-100">{tafsir.authorName}</dd>
              </div>
              <div>
                <dt className="text-cream-200/45 uppercase tracking-wider">Language</dt>
                <dd className="mt-0.5 text-cream-100">{tafsir.languageName}</dd>
              </div>
              <div>
                <dt className="text-cream-200/45 uppercase tracking-wider">Source</dt>
                <dd className="mt-0.5 text-cream-100">{tafsir.source.name}</dd>
              </div>
            </dl>
          </Card>
        )}
      </AppShell>
    </>
  );
}
