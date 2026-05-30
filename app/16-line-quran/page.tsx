import type { Metadata } from 'next';
import { MushafLanding } from '@/components/quran/MushafLanding';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/16-line-quran',
    titleKey: 'meta.16line.title',
    descriptionKey: 'meta.mushaf.description',
  });
}

export default function SixteenLinePage() {
  return (
    <MushafLanding
      eyebrow="Mushaf style"
      title="16-line Mushaf — the classic Indo-Pak layout"
      highlight="16-line"
      description="The 16-line Mushaf is the layout used by most Indo-Pak printed Qur'āns and is the visual page format millions of readers know by heart. QuranVoice activates this style as soon as verified 16-line line-break data is registered."
      status="locked"
      sourceRequirement="This Mushaf line style needs verified line-break data before activation. We will not approximate the 16-line page layout — once a verified Indo-Pak dataset (e.g. Taj Company, Tanzil, or Quran.Foundation mushaf resource) is connected, this layout becomes available."
      sourceCredit="When activated, page-level source attribution names the layout publisher."
      primaryCta={{ label: 'Open the reader', href: '/quran' }}
      secondaryCta={{ label: 'See all Mushaf styles', href: '/mushaf' }}
      pattern="lines"
      features={[
        { icon: 'feather', title: 'Iconic Indo-Pak page', body: 'Page-perfect rendering of the layout most Hifz students learn from.' },
        { icon: 'book', title: 'Memorization-first', body: 'Visual page consistency is one of the strongest aids for long-term Hifz.' },
        { icon: 'check', title: 'No fake layout', body: 'No invented line breaks — only verified data is rendered.' },
        { icon: 'sparkle', title: 'Beautiful typography', body: 'Pairs with your chosen Arabic font and Tajweed mode when both are connected.' },
        { icon: 'globe', title: 'Bilingual reading', body: 'Translation drawer slides in, leaving the mushaf layout intact.' },
        { icon: 'bookmark', title: 'Page-by-page navigation', body: 'Jump page-to-page with keyboard / swipe gestures.' },
      ]}
    />
  );
}
