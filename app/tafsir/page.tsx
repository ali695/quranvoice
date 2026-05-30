import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { UnavailableState } from '@/components/ui/ErrorState';
import { listTafsirs } from '@/lib/services/tafsirService';

export const metadata: Metadata = {
  title: 'Tafsir',
  description: 'Tafsir catalog from verified, registered sources.',
};

export default async function TafsirCatalog() {
  const tafsirs = await listTafsirs();
  return (
    <>
      <PageHeader
        eyebrow="Study"
        title="Tafsir"
        description="Browse tafsir works available in QuranVoice. Only registered, verified sources are shown."
      />
      <AppShell>
        {tafsirs.length === 0 ? (
          <UnavailableState
            title="No tafsir sources registered yet"
            description="Tafsir entries are shown only from verified sources registered in the Resource Registry. We never display synthesized or AI-generated tafsir."
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tafsirs.map((t) => (
              <Card key={String(t.id)} as="li" variant="elevated" className="p-5">
                <p className="text-xs uppercase tracking-wider text-gold-400/80">{t.languageName}</p>
                <h3 className="mt-2 font-display text-base text-cream-50">{t.name}</h3>
                <p className="mt-1 text-xs text-cream-200/65">By {t.authorName}</p>
                <p className="mt-2 text-[11px] text-cream-200/45">Source: {t.source.name}</p>
              </Card>
            ))}
          </ul>
        )}
      </AppShell>
    </>
  );
}
