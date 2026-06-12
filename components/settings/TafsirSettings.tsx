'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { UnavailableState } from '@/components/ui/ErrorState';
import { loadSettings, updateSettings } from '@/lib/services/settingsService';
import { languageName } from '@/lib/utils/languageNames';
import type { TafsirSettings as TS } from '@/lib/types/settings';
import type { TafsirResource } from '@/lib/types/tafsir';

export function TafsirSettings() {
  const [s, setS] = useState<TS | null>(null);
  const [available, setAvailable] = useState<TafsirResource[]>([]);

  useEffect(() => setS(loadSettings().tafsir), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch('/api/quran/tafsirs');
      if (!res.ok) return;
      const json = (await res.json()) as { data?: TafsirResource[] };
      if (!cancelled && json.data) setAvailable(json.data);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!s) return null;
  return (
    <Card variant="elevated" className="p-6">
      <h2 className="font-display text-lg font-medium text-cream-50">Tafsir</h2>
      <p className="mt-1 text-sm text-cream-200/65">Default tafsir source and display.</p>

      {available.length === 0 ? (
        <div className="mt-5">
          <UnavailableState
            title="No tafsir from the active source"
            badge="No sources"
            description="The connected content source returned no tafsir resources. Connect Quran.Foundation to unlock tafsir selection in multiple languages."
          />
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Select
            label="Default tafsir"
            value={String(s.defaultTafsirId ?? '')}
            options={[{ value: '', label: 'Auto (first available)' }].concat(
              available.map((t) => ({
                value: String(t.id),
                label: `${t.name}${t.language ? ` · ${languageName(t.language)}` : ''}`,
              })),
            )}
            onChange={(e) => {
              const id = e.target.value || null;
              const next = updateSettings('tafsir', { defaultTafsirId: id });
              setS(next.tafsir);
            }}
          />
          <Select
            label="Display mode"
            value={s.displayMode}
            options={[
              { value: 'inline', label: 'Inline under ayah' },
              { value: 'panel', label: 'In study panel' },
            ]}
            onChange={(e) => {
              const next = updateSettings('tafsir', { displayMode: e.target.value as TS['displayMode'] });
              setS(next.tafsir);
            }}
          />
        </div>
      )}
    </Card>
  );
}
