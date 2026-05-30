import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { STUDY_FEATURES } from '@/lib/data/home';

export function StudyQuran() {
  return (
    <section className="relative py-16 md:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-850/40 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 pattern-ornament opacity-20" aria-hidden="true" />

      <div className="container-page relative">
        <SectionHeader
          eyebrow="Deep Study"
          title="Study the Quran with depth and care"
          description="QuranVoice is built for serious study — tafsir, translations, word-by-word meaning, context of revelation, and personal notes, all from verified sources."
          align="center"
        />

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STUDY_FEATURES.map((f) => (
            <Card key={f.title} as="li" variant="elevated" className="flex h-full flex-col gap-4 p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold-500/20 bg-gold-500/8 text-gold-300">
                <Icon name={f.icon} size={20} />
              </span>
              <div>
                <h3 className="text-base font-semibold text-cream-50">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-cream-200/65">
                  {f.description}
                </p>
              </div>
              <div className="mt-auto flex items-center gap-1.5 text-xs text-cream-200/45">
                <Icon name="check" size={13} className="text-gold-400" />
                Verified sources only
              </div>
            </Card>
          ))}
        </ul>
      </div>
    </section>
  );
}
