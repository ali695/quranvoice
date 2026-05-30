import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { UnavailableState } from '@/components/ui/ErrorState';
import { TOPICS } from '@/lib/data/home';

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const topic = TOPICS.find((t) => t.slug === slug);
  if (!topic) return { title: 'Topic not found' };
  return {
    title: `${topic.label} — Topic`,
    description: `Quran ayahs related to the theme of ${topic.label}.`,
    alternates: { canonical: `/topics/${slug}` },
  };
}

export default async function TopicDetail({ params }: Params) {
  const { slug } = await params;
  const topic = TOPICS.find((t) => t.slug === slug);
  if (!topic) notFound();
  return (
    <>
      <PageHeader eyebrow="Topic" title={topic.label} description="Ayahs grouped by this theme." />
      <AppShell>
        <UnavailableState
          title="Topic index pending"
          description={`We are connecting a verified topic-to-ayah index. When it is registered, ayahs about ${topic.label.toLowerCase()} will appear here.`}
        />
      </AppShell>
    </>
  );
}
