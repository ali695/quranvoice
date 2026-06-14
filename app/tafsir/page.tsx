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
  description: 'Read verse-by-verse tafsir from Quran.Foundation and an open fallback source.',
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
        description="Choose a tafsir source and a verse to read real, source-attributed tafsir. Urdu, Arabic, English and more are available — Quran.Foundation first, with a clearly labelled open fallback."
      />
      <AppShell>
        {/* Interactive reader — pick a source + verse and read the content. */}
        <TafsirExplorer />

        {/* Browse the catalog. */}
        <div className="mt-12">
          <SectionHeader
            eyebrow="Catalog"
            title="Available tafsir sources"
            description={`${quranFoundation.length} from Quran.Foundation · ${fallback.length} from the fallback source.`}
          />
          {all.length === 0 ? (
            <UnavailableState
              title="No tafsir sources connected"
              badge="No sources"
              description="Connect Quran.Foundation to unlock tafsir in multiple languages. An open fallback source is also available."
            />
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {all.map((t) => (
                <Card key={`${t.provider}-${t.id}`} as="li" variant="elevated" className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs uppercase tracking-wider text-gold-400/80">
                      {t.languageName}
                    </p>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wider ${
                        t.provider === 'spa5k_fallback'
                          ? 'border-gold-500/30 bg-gold-500/5 text-gold-200/85'
                          : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200/85'
                      }`}
                    >
                      {t.provider === 'spa5k_fallback' ? 'Fallback' : 'Quran.Foundation'}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-base text-cream-50">{t.name}</h3>
                  <p className="mt-1 text-xs text-cream-200/65">By {t.authorName}</p>
                  <p className="mt-2 text-[11px] text-cream-200/45">Source: {t.source.name}</p>
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
