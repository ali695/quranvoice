import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Icon } from '@/components/ui/Icon';
import { listTranslations } from '@/lib/services/translationService';

interface Params {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Translation: ${id}`,
    alternates: { canonical: `/translations/${id}` },
  };
}

export default async function TranslationDetail({ params }: Params) {
  const { id } = await params;
  if (!/^[a-z0-9._-]+$/i.test(id)) notFound();
  const all = await listTranslations();
  const t = all.find((x) => String(x.id) === id);
  if (!t) notFound();
  return (
    <>
      <PageHeader
        eyebrow={`Translation · ${(t.languageIso || t.language).toUpperCase()}`}
        title={t.name}
        description={`By ${t.authorName}. Source attribution: ${t.source.name}.`}
        actions={
          <Button href={`/quran/1?translation=${t.id}`} variant="outline">
            <Icon name="book" size={14} />
            Open in reader
          </Button>
        }
      />
      <AppShell>
        <Card variant="elevated" className="p-6">
          <h2 className="font-display text-lg text-cream-50">About this translation</h2>
          <p className="mt-2 text-sm leading-relaxed text-cream-200/75">
            QuranVoice loads translation text on demand from {t.source.name}. Translations are
            shown beneath each ayah in the reader. You can change your default translation in{' '}
            <Link href="/settings" className="text-gold-300 hover:text-gold-200">
              Settings
            </Link>
            .
          </p>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2 text-xs">
            <div>
              <dt className="text-cream-200/45 uppercase tracking-wider">Language</dt>
              <dd className="mt-0.5 text-cream-100">{t.languageName}</dd>
            </div>
            <div>
              <dt className="text-cream-200/45 uppercase tracking-wider">Translator</dt>
              <dd className="mt-0.5 text-cream-100">{t.authorName}</dd>
            </div>
            <div>
              <dt className="text-cream-200/45 uppercase tracking-wider">Source</dt>
              <dd className="mt-0.5 text-cream-100">{t.source.name}</dd>
            </div>
            <div>
              <dt className="text-cream-200/45 uppercase tracking-wider">Resource ID</dt>
              <dd className="mt-0.5 font-mono text-cream-100">{String(t.id)}</dd>
            </div>
          </dl>
        </Card>
      </AppShell>
    </>
  );
}
