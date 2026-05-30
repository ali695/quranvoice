import type { Metadata } from 'next';
import { MushafLanding } from '@/components/quran/MushafLanding';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/8-line-quran',
    titleKey: 'meta.8line.title',
    descriptionKey: 'meta.mushaf.description',
  });
}

export default function EightLinePage() {
  return (
    <MushafLanding
      eyebrow="Mushaf style"
      title="8-line Mushaf — classical line-break layout"
      highlight="8-line"
      description="The 8-line Mushaf is a classical print layout where every page contains exactly eight lines. QuranVoice will render it once a verified line-break dataset is connected — we never approximate page breaks."
      status="locked"
      sourceRequirement="This Mushaf line style needs verified line-break data before activation. Approximating where lines end would misrepresent the printed mushaf — once a verified dataset (Tanzil layout files, Quran.Foundation mushaf resource, or a licensed publisher's data) is connected, this layout activates automatically."
      sourceCredit="When activated, page-level source attribution shows the line-break dataset name."
      primaryCta={{ label: 'Open the reader', href: '/quran' }}
      secondaryCta={{ label: 'See all Mushaf styles', href: '/mushaf' }}
      pattern="lines"
      features={[
        { icon: 'feather', title: 'True page fidelity', body: 'Every page renders with the exact line breaks of the source mushaf.' },
        { icon: 'book', title: 'Memorization-friendly', body: 'Hifz benefits from a consistent visual page — your memory associates verses with line position.' },
        { icon: 'check', title: 'No fake layout', body: 'We render exactly what the verified data specifies, or nothing at all.' },
        { icon: 'sparkle', title: 'Pairs with audio', body: 'Listen while you read with line-aware highlights once timestamps land.' },
        { icon: 'globe', title: 'Translation drawer', body: 'Tap a verse to open the translation/tafsir drawer without leaving the page view.' },
        { icon: 'bookmark', title: 'Page bookmarks', body: 'Save full pages — useful for daily wird routines.' },
      ]}
    />
  );
}
