'use client';

import { useEffect, useMemo, useState } from 'react';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => setS(loadSettings().tafsir), []);

  // Reload resources when language / fallback toggle changes.
  useEffect(() => {
    if (!s) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/quran/tafsirs?lang=${encodeURIComponent(s!.language || 'en')}&fallback=${s!.fallbackTafsirEnabled ? '1' : '0'}`,
        );
        if (res.ok) {
          const json = (await res.json()) as { data?: TafsirResource[] };
          if (!cancelled && json.data) setAvailable(json.data);
        }
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
  }, [s?.language, s?.fallbackTafsirEnabled]);

  const groups = useMemo(() => {
    const qf = available.filter((t) => t.provider !== 'spa5k_fallback');
    const fb = available.filter((t) => t.provider === 'spa5k_fallback');
    return { qf, fb };
  }, [available]);

  if (!s) return null;

  const patch = (p: Partial<TS>) => setS(updateSettings('tafsir', p).tafsir);

  return (
    <Card variant="elevated" className="p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-medium text-cream-50">Tafsir</h2>
          <p className="mt-1 text-sm text-cream-200/65">
            Default tafsir source, language, and the secondary fallback source.
          </p>
        </div>
        {!loading && (
          <span className="rounded-full border border-gold-500/25 bg-gold-500/5 px-3 py-1 text-[10px] uppercase tracking-wider text-gold-200/85">
            {groups.qf.length} QF · {groups.fb.length} fallback
          </span>
        )}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Select
          label="Tafsir language"
          value={s.language}
          options={Array.from(new Set(available.map((t) => t.language)))
            .filter(Boolean)
            .sort()
            .map((l) => ({ value: l, label: languageName(l) }))
            .concat(
              available.length === 0 ? [{ value: s.language, label: languageName(s.language) }] : [],
            )}
          onChange={(e) => patch({ language: e.target.value })}
        />
        <Select
          label="Default tafsir"
          value={String(s.defaultTafsirId ?? '')}
          options={[
            { value: '', label: 'Auto (best available)' },
            ...groups.qf.map((t) => ({
              value: String(t.id),
              label: `Quran.Foundation · ${t.name}`,
            })),
            ...groups.fb.map((t) => ({
              value: String(t.id),
              label: `Fallback · ${t.name} (${languageName(t.language)})`,
            })),
          ]}
          onChange={(e) => patch({ defaultTafsirId: e.target.value || null })}
        />
        <Select
          label="Display mode"
          value={s.displayMode}
          options={[
            { value: 'inline', label: 'Inline under ayah' },
            { value: 'panel', label: 'In study panel' },
          ]}
          onChange={(e) => patch({ displayMode: e.target.value as TS['displayMode'] })}
        />
      </div>

      {/* Fallback toggle + explanation */}
      <label className="mt-4 flex items-start gap-3 rounded-xl border border-ink-700/60 bg-ink-850/60 p-4 text-sm">
        <input
          type="checkbox"
          checked={s.fallbackTafsirEnabled}
          onChange={(e) => patch({ fallbackTafsirEnabled: e.target.checked })}
          className="mt-0.5 h-4 w-4 accent-gold-500"
        />
        <span>
          <span className="font-medium text-cream-50">Use fallback tafsir source</span>
          <span className="mt-1 block text-xs leading-relaxed text-cream-200/65">
            Quran.Foundation is always tried first. When it has no tafsir for a verse or your
            chosen language, QuranVoice falls back to the open spa5k Tafsir API (clearly labelled).
            Disable to use Quran.Foundation only.
          </span>
        </span>
      </label>

      {groups.qf.length === 0 && groups.fb.length === 0 && !loading && (
        <div className="mt-4">
          <UnavailableState
            title="No tafsir for this language"
            badge="Try another language"
            description="Neither Quran.Foundation nor the fallback source has a tafsir in this language. Pick another tafsir language above."
          />
        </div>
      )}
    </Card>
  );
}
