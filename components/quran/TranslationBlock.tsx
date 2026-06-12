import type { TranslationVerse } from '@/lib/types/translation';

interface TranslationBlockProps {
  translations?: TranslationVerse[];
}

/** Right-to-left scripts (Arabic, Urdu, Persian, Sindhi, Pashto, Hebrew). */
const RTL_RANGE = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿֐-׿]/;

function isRtl(text: string): boolean {
  return RTL_RANGE.test(text);
}

export function TranslationBlock({ translations }: TranslationBlockProps) {
  if (!translations || translations.length === 0) return null;
  return (
    <div className="mt-5 flex flex-col gap-4">
      {translations.map((t, i) => {
        const rtl = isRtl(t.text);
        return (
          <div
            key={`${t.resourceId}-${i}`}
            className={rtl ? 'border-r-2 border-gold-500/40 pr-4' : 'border-l-2 border-gold-500/40 pl-4'}
          >
            <p
              dir={rtl ? 'rtl' : 'ltr'}
              className={
                rtl
                  ? 'text-right text-lg leading-loose text-cream-100/90'
                  : 'text-[0.95rem] leading-relaxed text-cream-100/90'
              }
            >
              {t.text}
            </p>
            <p
              dir={rtl ? 'rtl' : 'ltr'}
              className={`mt-1.5 text-[10px] uppercase tracking-wider text-cream-200/45 ${rtl ? 'text-right' : ''}`}
            >
              — {t.resourceName}
            </p>
          </div>
        );
      })}
    </div>
  );
}
