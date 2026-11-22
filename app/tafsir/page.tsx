import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { UnavailableState } from '@/components/ui/ErrorState';
import { TafsirExplorer } from '@/components/quran/TafsirExplorer';
import { listAllTafsirResources } from '@/lib/services/tafsir.service';

export const metadata: Metadata = {
  title: 'Tafsir',
  description: 'Read verse-by-verse tafsir in Urdu, Arabic, English and more — Ibn Kathir, Ma\'arif al-Qur\'an, Bayan-ul-Quran, Tafsir Muyassar and others, each shown with its author.',
};

export const revalidate = 86400;

export default async function TafsirCatalog() {
  const { quranFoundation, fallback } = await listAllTafsirResources('en', true);
  const all = [...quranFoundation, ...fallback];

  return (
    <>
      <PageHeader
        eyebrow="Study"
        title="Tafsir"
        description="Choose a tafsir and a verse to read it. Urdu, Arabic, English and more are available, each shown with its author and source."
      />
      <AppShell>
        {/* Interactive reader — pick a source + verse and read the content. */}
        <TafsirExplorer />

        {/* Browse the catalog. */}
        <div className="mt-12">
          <SectionHeader
            eyebrow="Catalog"
            title="Available tafsir sources"
            description={`${all.length} tafsirs across several languages.`}
          />
          {all.length === 0 ? (
            <UnavailableState
              title="No tafsir sources connected"
              badge="No sources"
              description="Tafsir is not available right now. Please try again in a moment."
            />
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {all.map((t) => (
                <Card key={`${t.provider}-${t.id}`} as="li" variant="elevated" className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs uppercase tracking-wider text-gold-400/80">
                      {t.languageName}
                    </p>
                  </div>
                  <h3 className="mt-2 font-display text-base text-cream-50">{t.name}</h3>
                  <p className="mt-1 text-xs text-cream-200/65">By {t.authorName}</p>
                </Card>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-cream-200/55">
            QuranVoice never generates tafsir with AI. See the{' '}
            <Link href="/sources" className="text-gold-300 hover:text-gold-200">
              sources page
            </Link>{' '}
            for full attribution and license status.
          </p>
        </div>
      </AppShell>
    </>
  );
}
