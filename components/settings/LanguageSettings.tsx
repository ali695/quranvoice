'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Select } from '@/components/ui/Select';
import { useTranslation } from '@/lib/i18n/context';
import { LOCALES, type LocaleCode } from '@/lib/i18n/locales';

/**
 * App-language settings card.
 *
 * Translation/tafsir language choices live in their dedicated cards
 * (`TranslationSettings`, `TafsirSettings`) — this card is for the
 * QuranVoice UI itself.
 */
export function LanguageSettings() {
  const { locale, setLocale, dir } = useTranslation();
  const [pending, setPending] = useState<LocaleCode>(locale);

  const onApply = () => setLocale(pending);
  const onReset = () => setLocale('en');

  return (
    <Card variant="elevated" className="p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold-400/80">
        <Icon name="globe" size={13} />
        Language
      </div>
      <h2 className="mt-2 font-display text-lg font-medium text-cream-50">App language</h2>
      <p className="mt-1 text-sm text-cream-200/65">
        QuranVoice supports {LOCALES.length} languages. Quran Arabic text and verified
        translations are never altered — only the app interface changes.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Select
          label="App language"
          value={pending}
          onChange={(e) => setPending(e.target.value as LocaleCode)}
          options={LOCALES.map((l) => ({
            value: l.code,
            label: `${l.nativeName} · ${l.englishName}`,
          }))}
        />
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-cream-200/70">
            Reading direction
          </label>
          <div className="mt-1.5 rounded-xl border border-ink-600/70 bg-ink-800/60 px-4 py-3 text-sm text-cream-50">
            <span dir={dir} className="font-mono uppercase">{dir}</span>{' '}
            <span className="text-cream-200/55">
              {dir === 'rtl' ? '— right-to-left' : '— left-to-right'}
            </span>
          </div>
        </div>
      </div>

      <div
        dir={LOCALES.find((l) => l.code === pending)?.dir ?? 'ltr'}
        className="mt-4 rounded-xl border border-ink-700/60 bg-ink-850/60 p-4"
      >
        <p className="text-xs uppercase tracking-wider text-cream-200/55">Preview</p>
        <p className="mt-2 text-sm text-cream-100">
          {LOCALES.find((l) => l.code === pending)?.nativeName}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button size="md" onClick={onApply} disabled={pending === locale}>
          <Icon name="check" size={14} />
          Apply language across app
        </Button>
        <Button size="md" variant="ghost" onClick={onReset}>
          Reset to English
        </Button>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-cream-200/55">
        Your selection is saved as a cookie (and synced to your account if signed in).
        Quran translation and tafsir language are configured separately below.
      </p>
    </Card>
  );
}
