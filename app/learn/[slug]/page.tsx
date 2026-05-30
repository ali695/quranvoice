import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { LEARNING_CONTENT } from '@/lib/data/learningContent';

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const c = LEARNING_CONTENT[slug];
  if (!c) return { title: 'Article not found' };
  return {
    title: c.title,
    description: c.summary,
    alternates: { canonical: `/learn/${slug}` },
  };
}

export default async function LearnArticle({ params }: Params) {
  const { slug } = await params;
  const c = LEARNING_CONTENT[slug];
  if (!c) notFound();
  return (
    <>
      <PageHeader eyebrow={c.category} title={c.title} description={c.summary} />
      <AppShell>
        <Card variant="elevated" className="prose-invert p-8">
          {c.sections.map((s) => (
            <section key={s.heading} className="mb-8 last:mb-0">
              <h2 className="font-display text-xl font-medium text-cream-50">{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className="mt-3 text-sm leading-relaxed text-cream-100/80">
                  {p}
                </p>
              ))}
            </section>
          ))}
          <p className="mt-8 border-t border-ink-700/60 pt-4 text-[11px] text-cream-200/45">
            Editorial guide by QuranVoice. Religious commentary requires a registered, verified
            source — this page is a reading-strategy guide, not a tafsir.
          </p>
        </Card>
      </AppShell>
    </>
  );
}
