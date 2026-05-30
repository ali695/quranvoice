import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { ReciterAvatar } from '@/components/audio/ReciterCard';
import { listAllSurahs } from '@/lib/services/quranService';
import { getReciter } from '@/lib/services/audioService';

interface Params {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const r = await getReciter(id);
  if (!r) return { title: 'Reciter not found' };
  return {
    title: `${r.name} — Reciter`,
    description: `Listen to Quran recitations by ${r.name}.`,
    alternates: { canonical: `/reciters/${r.id}` },
  };
}

export default async function ReciterDetail({ params }: Params) {
  const { id } = await params;
  if (!/^[a-z0-9._-]+$/i.test(id)) notFound();
  const reciter = await getReciter(id);
  if (!reciter) notFound();
  const surahs = await listAllSurahs();
  return (
    <>
      <PageHeader
        eyebrow="Reciter"
        title={reciter.name}
        description={`${reciter.style ?? 'Recitation'} · ${reciter.source.name}`}
      />
      <AppShell>
        <div className="mb-8 flex flex-wrap items-center gap-5 rounded-2xl border border-ink-600/50 bg-ink-800/40 p-5">
          <ReciterAvatar name={reciter.name} seed={1} />
          <div>
            <p className="text-sm text-cream-100/85">
              {reciter.arabicName && (
                <span className="arabic mr-3 text-lg text-gold-200" dir="rtl" lang="ar">
                  {reciter.arabicName}
                </span>
              )}
              {reciter.style ?? 'Murattal'}
            </p>
            <p className="mt-1 text-xs text-cream-200/55">
              Surah audio: {reciter.hasSurahAudio ? 'available' : 'unavailable'} · Ayah audio:{' '}
              {reciter.hasAyahAudio ? 'available' : 'unavailable'}
            </p>
          </div>
          <p className="ml-auto max-w-xs text-xs text-cream-200/55">
            Source attribution: {reciter.source.name}. Audio file licensing is the responsibility of
            the source CDN.
          </p>
        </div>

        <h2 className="font-display text-xl font-medium text-cream-50">Listen by Surah</h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {surahs.map((s) => (
            <Card key={s.number} as="li" variant="elevated">
              <Link
                href={`/quran/${s.number}?reciter=${reciter.id}`}
                className="flex items-center gap-3 p-4"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/10 text-gold-300">
                  <Icon name="play" size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-cream-50">
                    {s.number}. {s.transliteration}
                  </p>
                  <p className="truncate text-xs text-cream-200/55">{s.meaning}</p>
                </div>
                <span className="arabic text-lg text-cream-100" dir="rtl" lang="ar">
                  {s.arabic}
                </span>
              </Link>
            </Card>
          ))}
        </ul>
      </AppShell>
    </>
  );
}
