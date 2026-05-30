import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/ui/PageHeader';
import { alquranCloudFetch } from '@/lib/api/quranApiProxy';

interface Params {
  params: Promise<{ page: string }>;
}

interface AlquranCloudPageResponse {
  data?: {
    ayahs?: Array<{
      number: number;
      text: string;
      surah?: { number: number; englishName?: string; name?: string };
      numberInSurah: number;
    }>;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { page } = await params;
  const n = Number(page);
  return {
    title: `Quran Page ${n}`,
    description: `Read page ${n} of the standard mushaf.`,
    alternates: { canonical: `/pages/${n}` },
  };
}

export default async function PageDetail({ params }: Params) {
  const { page } = await params;
  const n = Number(page);
  if (!Number.isInteger(n) || n < 1 || n > 604) notFound();
  const data = await alquranCloudFetch<AlquranCloudPageResponse>(`/page/${n}/quran-uthmani`);
  const ayahs = data?.data?.ayahs ?? [];
  return (
    <>
      <PageHeader eyebrow="Mushaf" title={`Page ${n}`} description="Standard mushaf layout." />
      <AppShell withSidebar>
        {ayahs.length === 0 ? (
          <ErrorState />
        ) : (
          <ol className="flex flex-col gap-4">
            {ayahs.map((a) => (
              <li key={a.number}>
                <article className="rounded-2xl border border-ink-600/50 bg-ink-800/40 p-5 md:p-7">
                  <div className="text-xs uppercase tracking-wider text-cream-200/55">
                    {a.surah?.englishName ?? `Surah ${a.surah?.number}`} · Ayah {a.numberInSurah}
                  </div>
                  <p
                    className="arabic mt-4 text-right text-3xl leading-[2.1] text-cream-50"
                    dir="rtl"
                    lang="ar"
                  >
                    {a.text}
                  </p>
                </article>
              </li>
            ))}
          </ol>
        )}
      </AppShell>
    </>
  );
}
