'use client';

import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/i18n/context';
import { LOCALES, type LocaleCode } from '@/lib/i18n/locales';

interface LanguageSelectorProps {
  /** "compact" = header style (icon + code); "full" = footer/settings style */
  variant?: 'compact' | 'full';
}

export function LanguageSelector({ variant = 'compact' }: LanguageSelectorProps) {
  const { locale, setLocale } = useTranslation();
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  const trigger =
    variant === 'compact' ? (
      <span
        className="inline-flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm text-cream-100/80 transition-colors hover:bg-ink-800/70 hover:text-gold-300"
        title={`Language: ${current.englishName}`}
      >
        <Icon name="globe" size={16} />
        <span className="text-xs font-medium uppercase">{current.code}</span>
        <Icon name="chevron-down" size={14} />
      </span>
    ) : (
      <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-ink-600 bg-ink-800/60 px-3 text-xs text-cream-100/80 hover:border-gold-500/40">
        <Icon name="globe" size={14} />
        {current.nativeName}
        <Icon name="chevron-down" size={12} />
      </span>
    );

  return (
    <Dropdown trigger={trigger} align="right">
      {(close) => (
        <ul role="menu" className="max-h-[60vh] w-[220px] overflow-y-auto py-1">
          {LOCALES.map((l) => (
            <li key={l.code}>
              <DropdownItem
                onClick={() => {
                  setLocale(l.code as LocaleCode);
                  close();
                }}
              >
                <span className="flex w-full items-center justify-between gap-3">
                  <span dir={l.dir} className="text-sm">
                    {l.nativeName}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-cream-200/45">
                    {l.code}
                  </span>
                </span>
              </DropdownItem>
            </li>
          ))}
        </ul>
      )}
    </Dropdown>
  );
}
