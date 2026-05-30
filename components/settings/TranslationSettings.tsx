'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { loadSettings, updateSettings } from '@/lib/services/settingsService';
import type { TranslationSettings as TS } from '@/lib/types/settings';
import type { TranslationResource } from '@/lib/types/translation';

export function TranslationSettings() {
  const [s, setS] = useState<TS | null>(null);
  const [available, setAvailable] = useState<TranslationResource[]>([]);

  useEffect(() => {
    setS(loadSettings().translation);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/quran/translations');
        if (!res.ok) return;
        const json = (await res.json()) as { data?: TranslationResource[] };
        if (!cancelled && json.data) setAvailable(json.data);
      } catch {
        /* ignore */
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!s) return null;

  const languages = Array.from(new Set(available.map((t) => t.languageIso || t.language))).sort();
  const inLang = available.filter((t) => (t.languageIso || t.language) === s.defaultLanguage);

  const onLang = (lang: string) => {
    const next = updateSettings('translation', { defaultLanguage: lang });
    setS(next.translation);
  };
  const onSelected = (id: string) => {
    const sel = [id];
    const next = updateSettings('translation', { selected: sel });
    setS(next.translation);
  };
  const onStyle = (style: TS['displayStyle']) => {
    const next = updateSettings('translation', { displayStyle: style });
    setS(next.translation);
  };

  return (
    <Card variant="elevated" className="p-6">
      <h2 className="font-display text-lg font-medium text-cream-50">Translation</h2>
      <p className="mt-1 text-sm text-cream-200/65">Default language and translation source.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Select
          label="Default language"
          value={s.defaultLanguage}
          options={
            languages.length > 0
              ? languages.map((l) => ({ value: l, label: l.toUpperCase() }))
              : [{ value: 'en', label: 'EN' }]
          }
          onChange={(e) => onLang(e.target.value)}
        />
        <Select
          label="Default translation"
          value={(s.selected[0] as string) ?? ''}
          options={inLang.map((t) => ({ value: String(t.id), label: t.authorName }))}
          onChange={(e) => onSelected(e.target.value)}
        />
        <Select
          label="Display style"
          value={s.displayStyle}
          options={[
            { value: 'stacked', label: 'Stacked' },
            { value: 'tabbed', label: 'Tabbed' },
          ]}
          onChange={(e) => onStyle(e.target.value as TS['displayStyle'])}
        />
      </div>
      <p className="mt-4 text-xs text-cream-200/55">
        Selected translation: {(s.selected[0] as string) || 'none'}
      </p>
    </Card>
  );
}
