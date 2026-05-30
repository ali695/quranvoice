import type { Metadata } from 'next';
import { MushafLanding } from '@/components/quran/MushafLanding';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/12-line-quran',
    titleKey: 'meta.12line.title',
    descriptionKey: 'meta.mushaf.description',
  });
}

export default function TwelveLinePage() {
  return (
    <MushafLanding
      eyebrow="Mushaf style"
      title="12-line Mushaf — denser classical layout"
      highlight="12-line"
      description="The 12-line Mushaf packs more verses per page than the 8-line, with the same fidelity expectation. QuranVoice activates this layout when a verified 12-line line-break dataset is registered."
      status="locked"
      sourceRequirement="This Mushaf line style needs verified line-break data before activation. We do not synthesize 12-line page breaks — when a verified dataset is connected, the layout becomes available system-wide."
      primaryCta={{ label: 'Open the reader', href: '/quran' }}
      secondaryCta={{ label: 'See all Mushaf styles', href: '/mushaf' }}
      pattern="lines"
      features={[
        { icon: 'feather', title: 'Compact page rhythm', body: 'Slightly denser than the 8-line for readers who prefer fewer page turns.' },
        { icon: 'book', title: 'Memorization landmarks', body: 'The page rhythm itself becomes a memorization aid.' },
        { icon: 'check', title: 'No fake layout', body: 'Exact line breaks come from the verified dataset only.' },
        { icon: 'sparkle', title: 'Smooth typography', body: 'Renders in your chosen Arabic font with verified Uthmani text.' },
        { icon: 'globe', title: 'Translation drawer', body: 'Translation is one tap away without leaving the page.' },
        { icon: 'bookmark', title: 'Page-level study', body: 'Bookmark and review by page, not just by ayah.' },
      ]}
    />
  );
}
