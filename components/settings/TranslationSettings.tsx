'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { UnavailableState } from '@/components/ui/ErrorState';
import { loadSettings, updateSettings } from '@/lib/services/settingsService';
import { languageName } from '@/lib/utils/languageNames';
import type { TranslationSettings as TS } from '@/lib/types/settings';
import type { TranslationResource } from '@/lib/types/translation';

export function TranslationSettings() {
  const [s, setS] = useState<TS | null>(null);
  const [available, setAvailable] = useState<TranslationResource[]>([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const isoOf = (t: TranslationResource) => (t.languageIso || t.language || '').toLowerCase();

  // Languages present in the catalog, sorted by friendly name.
  const languages = useMemo(() => {
    const set = new Map<string, number>();
    for (const t of available) {
      const iso = isoOf(t);
      if (iso) set.set(iso, (set.get(iso) ?? 0) + 1);
    }
    return Array.from(set.entries())
      .map(([iso, count]) => ({ iso, count, name: languageName(iso) }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [available]);

  if (!s) return null;

  const inLang = available.filter((t) => isoOf(t) === s.defaultLanguage);
  const selectedIds = (s.selected ?? []).map(String);

  const onLang = (lang: string) => {
    const next = updateSettings('translation', { defaultLanguage: lang });
    setS(next.translation);
  };
  const toggleSelected = (id: string) => {
    const exists = selectedIds.includes(id);
    const sel = exists ? selectedIds.filter((x) => x !== id) : [...selectedIds, id];
    const next = updateSettings('translation', { selected: sel });
    setS(next.translation);
  };
  const onStyle = (style: TS['displayStyle']) => {
    const next = updateSettings('translation', { displayStyle: style });
    setS(next.translation);
  };

  return (
    <Card variant="elevated" className="p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-medium text-cream-50">Translation</h2>
          <p className="mt-1 text-sm text-cream-200/65">
            Pick the languages and translators shown under each ayah. App language is separate.
          </p>
        </div>
        {!loading && (
          <span className="rounded-full border border-gold-500/25 bg-gold-500/5 px-3 py-1 text-[10px] uppercase tracking-wider text-gold-200/85">
            {available.length} translations · {languages.length} languages
          </span>
        )}
      </div>

      {!loading && available.length === 0 ? (
        <div className="mt-5">
          <UnavailableState
            title="No translations from the active source"
            badge="No sources"
            description="The connected content source returned no translation resources. Connect Quran.Foundation to unlock translations in many languages."
          />
        </div>
      ) : (
        <>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Select
              label="Translation language"
              value={s.defaultLanguage}
              options={
                languages.length > 0
                  ? languages.map((l) => ({ value: l.iso, label: `${l.name} (${l.count})` }))
                  : [{ value: 'en', label: 'English' }]
              }
              onChange={(e) => onLang(e.target.value)}
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

          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-wider text-gold-400/80">
              {languageName(s.defaultLanguage)} translations
            </p>
            {inLang.length === 0 ? (
              <p className="mt-2 text-sm text-cream-200/65">
                No {languageName(s.defaultLanguage)} translation is available from the active source.
                Choose another language above.
              </p>
            ) : (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {inLang.map((t) => {
                  const id = String(t.id);
                  const checked = selectedIds.includes(id);
                  return (
                    <label
                      key={id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                        checked
                          ? 'border-gold-500/40 bg-gold-500/5 text-cream-50'
                          : 'border-ink-700/60 bg-ink-850/60 text-cream-100/90 hover:border-ink-500/60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSelected(id)}
                        className="mt-0.5 h-4 w-4 accent-gold-500"
                      />
                      <span className="min-w-0">
                        <span className="block font-medium">{t.authorName || t.name}</span>
                        <span className="mt-0.5 block text-[11px] text-cream-200/55">
                          {t.source?.name ?? 'Quran.Foundation'}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-cream-200/55">
            {selectedIds.length === 0
              ? 'No translation selected — every ayah will show Arabic only.'
              : `${selectedIds.length} translation${selectedIds.length > 1 ? 's' : ''} selected.`}
          </p>
        </>
      )}
    </Card>
  );
}
