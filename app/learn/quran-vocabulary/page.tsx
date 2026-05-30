import type { Metadata } from 'next';
import Link from 'next/link';
import { LearningTopicShell } from '@/components/learn/LearningTopicShell';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/learn/quran-vocabulary',
    title: 'Quran Vocabulary — QuranVoice',
    description:
      'Learn the most frequent Arabic words in the Quran. Activates when a verified word-frequency dataset is connected.',
  });
}

export default function QuranVocabularyPage() {
  return (
    <LearningTopicShell
      eyebrow="Learning Library"
      title="Recognize the most frequent words of the Quran"
      highlight="words"
      description="A small number of Arabic words make up a very large share of the Quran. QuranVoice will publish a frequency-ordered vocabulary trainer once a verified Quran word-frequency / morphology dataset is registered."
      sourceStatus="needs_source"
      sourceNote="Word frequency, root analysis, and per-word meanings require a verified dataset (e.g. Quran.Foundation word-by-word, Tanzil morphology, or a published lemma database). Until that lands, the reader's word-by-word panel stays empty and this page shows a planned state."
      icon="globe"
      pattern="lines"
      intro={
        <p className="rounded-2xl border border-gold-500/30 bg-gold-500/5 p-4 text-sm leading-relaxed text-cream-100/85">
          Tip: while you wait for the trainer, the QuranVoice reader will show word-by-word data
          on every ayah as soon as a verified word-morphology dataset is registered.
        </p>
      }
      related={[
        { href: '/word-by-word', label: 'Word by Word page' },
        { href: '/learn/quran-themes', label: 'Quran Themes' },
        { href: '/quran', label: 'Open the Quran reader' },
      ]}
    />
  );
}
