import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { listTranslations } from '@/lib/services/translationService';

export const metadata: Metadata = {
  title: 'Translations',
  description: 'Translation catalog. Compare translations by language and translator.',
};

interface SearchParams {
  searchParams: Promise<{ lang?: string }>;
}

export default async function TranslationsPage({ searchParams }: SearchParams) {
  const { lang } = await searchParams;
  const all = await listTranslations();
  const filtered = lang ? all.filter((t) => (t.languageIso || t.language) === lang) : all;
  const languages = Array.from(new Set(all.map((t) => t.languageIso || t.language))).sort();
  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Translations"
        description={`${filtered.length} translations available. Source attribution shown on each entry.`}
      />
      <AppShell>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Link
            href="/translations"
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              !lang ? 'border-gold-500/50 bg-gold-500/10 text-gold-200' : 'border-ink-600/70 text-cream-200/65'
            }`}
          >
            All
          </Link>
          {languages.map((l) => (
            <Link
              key={l}
              href={`/translations?lang=${l}`}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                lang === l
                  ? 'border-gold-500/50 bg-gold-500/10 text-gold-200'
                  : 'border-ink-600/70 text-cream-200/65 hover:border-gold-500/30'
              }`}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <Card key={String(t.id)} as="li" variant="elevated">
              <Link href={`/translations/${t.id}`} className="block p-5">
                <div className="text-xs uppercase tracking-wider text-gold-400/80">
                  {(t.languageIso || t.language).toUpperCase()}
                </div>
                <h3 className="mt-2 font-display text-base text-cream-50">{t.name}</h3>
                <p className="mt-1 text-xs text-cream-200/65">By {t.authorName}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gold-300">
                  Open
                  <Icon name="arrow-right" size={12} />
                </div>
              </Link>
            </Card>
          ))}
        </ul>
      </AppShell>
    </>
  );
}
