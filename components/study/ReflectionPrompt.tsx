import { Icon } from '@/components/ui/Icon';

interface ReflectionPromptProps {
  surah: number;
  ayah: number;
}

const NEUTRAL_PROMPTS = [
  'What words in this ayah feel most weighty to you right now?',
  'How might you carry this ayah with you through the day?',
  'Is there a question this ayah raises that you want to explore in tafsir?',
  'What memory or moment does this ayah bring to mind?',
];

/**
 * Soft, non-doctrinal reflection prompts. These are generic
 * meditation hints — they make no theological claims and require
 * no verified religious source.
 */
export function ReflectionPrompt({ surah, ayah }: ReflectionPromptProps) {
  const idx = (surah * 31 + ayah) % NEUTRAL_PROMPTS.length;
  const prompt = NEUTRAL_PROMPTS[idx];
  return (
    <div className="rounded-2xl border border-ink-600/50 bg-ink-800/40 p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold-400/80">
        <Icon name="sparkle" size={13} />
        Reflection
      </div>
      <p className="mt-3 text-sm leading-relaxed text-cream-100/85">{prompt}</p>
      <p className="mt-3 text-[11px] text-cream-200/45">
        Write your thoughts in the notes panel — they stay private to your device.
      </p>
    </div>
  );
}
