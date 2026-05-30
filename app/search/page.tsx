import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { search } from '@/lib/services/searchService';

export const metadata: Metadata = {
  title: 'Search the Quran',
  description: 'Search surahs, ayahs, English translation, and verse references.',
};

interface SearchParams {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchParams) {
  const { q = '' } = await searchParams;
  const results = q ? await search(q) : [];
  return (
    <>
      <PageHeader
        eyebrow="Search"
        title="Search the Quran"
        description="Type a surah name, English keyword, or verse reference like 2:255."
      />
      <AppShell>
        <form method="get" action="/search" className="mb-6">
          <div className="flex items-center rounded-2xl border border-ink-600/80 bg-ink-800/70 p-2 shadow-soft">
            <Icon name="search" size={20} className="ml-3 text-cream-200/55" />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search Surah, Ayah, topic, translation…"
              className="h-12 flex-1 bg-transparent px-3 text-base text-cream-50 placeholder:text-cream-200/40 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="h-12 rounded-xl bg-gold-500 px-5 text-sm font-medium text-ink-950 hover:bg-gold-400"
            >
              Search
            </button>
          </div>
        </form>

        {!q ? (
          <p className="text-sm text-cream-200/55">
            Try <Link href="/search?q=2:255" className="text-gold-300 hover:text-gold-200">2:255</Link>,{' '}
            <Link href="/search?q=patience" className="text-gold-300 hover:text-gold-200">patience</Link>, or{' '}
            <Link href="/search?q=Yaseen" className="text-gold-300 hover:text-gold-200">Yaseen</Link>.
          </p>
        ) : results.length === 0 ? (
          <EmptyState
            icon="search"
            title={`No results for “${q}”`}
            description="Try a different spelling, a reference like 2:255, or an English keyword."
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {results.map((r, i) => (
              <Card key={`${r.kind}-${r.verseKey}-${i}`} as="li" variant="elevated">
                <Link
                  href={
                    r.ayah ? `/quran/${r.surah}/${r.ayah}` : `/quran/${r.surah}`
                  }
                  className="block p-5"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-display text-base text-cream-50">
                      {r.surahName}{' '}
                      {r.arabicName && (
                        <span className="arabic ml-1 text-lg text-gold-200" dir="rtl" lang="ar">
                          {r.arabicName}
                        </span>
                      )}
                    </p>
                    <span className="text-xs uppercase tracking-wider text-gold-400/80">
                      {r.verseKey}
                    </span>
                  </div>
                  {r.matchText && (
                    <p className="mt-3 text-sm leading-relaxed text-cream-100/85">
                      {r.matchText}
                    </p>
                  )}
                  {r.matchSource && (
                    <p className="mt-2 text-[11px] uppercase tracking-wider text-cream-200/45">
                      — {r.matchSource}
                    </p>
                  )}
                </Link>
              </Card>
            ))}
          </ul>
        )}
      </AppShell>
    </>
  );
}
