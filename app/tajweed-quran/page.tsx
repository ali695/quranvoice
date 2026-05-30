import type { Metadata } from 'next';
import { MushafLanding } from '@/components/quran/MushafLanding';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/tajweed-quran',
    titleKey: 'meta.tajweed.title',
    descriptionKey: 'meta.tajweed.description',
  });
}

export default function TajweedPage() {
  return (
    <MushafLanding
      eyebrow="Mushaf style"
      title="Tajweed Quran with verified rule coloring"
      highlight="Tajweed"
      description="Tajweed mode color-codes the rules of recitation directly onto the Arabic script. QuranVoice activates this view only when a verified Tajweed text dataset or licensed Tajweed font is connected — we do not infer rules ourselves."
      status="locked"
      sourceRequirement="Tajweed coloring is shown only when verified Tajweed data is connected. We will not color Quran letters using rules we infer ourselves. Acceptable sources include the Tanzil tajweed-tagged Quran text dataset, the QPC Tajweed Hafs font, or a King Fahd Complex Tajweed font under license."
      sourceCredit="When activated, the Tajweed view shows the source name and license status on every page."
      primaryCta={{ label: 'Open the reader', href: '/quran' }}
      secondaryCta={{ label: 'Tajweed Basics guide', href: '/learn/tajweed-basics' }}
      pattern="circles"
      features={[
        { icon: 'feather', title: 'Madd & Idghām', body: 'Lengthening and merging rules color-coded per source convention.' },
        { icon: 'sparkle', title: 'Ghunna & Qalqala', body: 'Nasal and bouncing letters highlighted as defined by the verified dataset.' },
        { icon: 'check', title: 'No invented coloring', body: 'Every colored letter must come from a registered Tajweed source — never from heuristics.' },
        { icon: 'globe', title: 'Translation-friendly', body: 'Tajweed mode runs alongside your selected translation and tafsir.' },
        { icon: 'volume', title: 'Recitation pairing', body: 'Read with Tajweed colors while a verified reciter plays the same verse.' },
        { icon: 'note', title: 'Study notes', body: 'Personal notes on Tajweed observations attach to the same ayah card as your translation notes.' },
      ]}
    />
  );
}
