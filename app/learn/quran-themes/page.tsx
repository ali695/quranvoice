import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { SourceBadge } from '@/components/learn/SourceBadge';
import { QURAN_THEMES } from '@/lib/data/learning/themes';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/learn/quran-themes',
    title: 'Quran Themes — QuranVoice',
    description:
      'Themes the Quran returns to. Each theme links into the Topics index — verified ayah-to-theme mapping pending.',
  });
}

export default function QuranThemesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learning Library"
        title="Reading the Quran by theme"
        description="Themes are powerful entry points into the Quran. QuranVoice opens each theme into the Topics index — but per-theme ayah mappings activate only when a verified topic-to-ayah index is connected. We never invent mappings."
      />
      <AppShell>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {QURAN_THEMES.map((t) => (
            <Card key={t.id} as="li" variant="elevated">
              <Link href={`/topics/${t.topicSlug}`} className="flex h-full flex-col gap-3 p-5">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-300">
                    <Icon name="flag" size={15} />
                  </span>
                  <SourceBadge status={t.sourceStatus} />
                </div>
                <h3 className="font-display text-base text-cream-50">{t.title}</h3>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-gold-300">
                  Explore
                  <Icon name="arrow-right" size={11} />
                </span>
              </Link>
            </Card>
          ))}
        </ul>

        <Card variant="feature" className="mt-10 p-6 md:p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-400/80">
            <Icon name="check" size={13} />
            Why mappings are pending
          </div>
          <p className="mt-3 text-sm leading-relaxed text-cream-100/85">
            Mapping which ayahs &ldquo;belong to&rdquo; a theme is itself a scholarly decision.
            QuranVoice will display per-theme ayah lists only when a verified topic-to-ayah index
            (e.g. from a published thematic concordance) is registered. Until then, theme cards
            link into the broader Topics index.
          </p>
        </Card>
      </AppShell>
    </>
  );
}
