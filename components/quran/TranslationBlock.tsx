import type { TranslationVerse } from '@/lib/types/translation';

interface TranslationBlockProps {
  translations?: TranslationVerse[];
}

export function TranslationBlock({ translations }: TranslationBlockProps) {
  if (!translations || translations.length === 0) return null;
  return (
    <div className="mt-5 flex flex-col gap-4">
      {translations.map((t, i) => (
        <div key={`${t.resourceId}-${i}`} className="border-l-2 border-gold-500/40 pl-4">
          <p className="text-[0.95rem] leading-relaxed text-cream-100/90">{t.text}</p>
          <p className="mt-1.5 text-[10px] uppercase tracking-wider text-cream-200/45">
            — {t.resourceName}
          </p>
        </div>
      ))}
    </div>
  );
}
