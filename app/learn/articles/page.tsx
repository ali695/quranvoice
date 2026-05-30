import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { LEARNING_CONTENT } from '@/lib/data/learningContent';

const c = LEARNING_CONTENT.articles;

export const metadata: Metadata = {
  title: c?.title ?? 'Islamic Articles',
  description: c?.summary,
};

export default function ArticlesPage() {
  if (!c) return null;
  return (
    <>
      <PageHeader eyebrow={c.category} title={c.title} description={c.summary} />
      <AppShell>
        <Card variant="elevated" className="p-8">
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
        </Card>
      </AppShell>
    </>
  );
}
