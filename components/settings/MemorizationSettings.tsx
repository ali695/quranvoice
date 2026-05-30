'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { loadSettings, updateSettings } from '@/lib/services/settingsService';
import type { MemorizationSettings as MS } from '@/lib/types/settings';

export function MemorizationSettings() {
  const [s, setS] = useState<MS | null>(null);
  useEffect(() => setS(loadSettings().memorization), []);
  if (!s) return null;
  const patch = (p: Partial<MS>) => {
    const next = updateSettings('memorization', p);
    setS(next.memorization);
  };
  return (
    <Card variant="elevated" className="p-6">
      <h2 className="font-display text-lg font-medium text-cream-50">Memorization</h2>
      <p className="mt-1 text-sm text-cream-200/65">How review sessions behave.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-cream-200/70">
            Repeats per ayah: {s.repeatCount}
          </label>
          <input
            type="range"
            min={1}
            max={20}
            value={s.repeatCount}
            onChange={(e) => patch({ repeatCount: Number(e.target.value) })}
            className="mt-2 w-full accent-gold-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-cream-200/70">
            Delay between repeats: {s.delayBetweenRepeatsMs}ms
          </label>
          <input
            type="range"
            min={0}
            max={4000}
            step={100}
            value={s.delayBetweenRepeatsMs}
            onChange={(e) => patch({ delayBetweenRepeatsMs: Number(e.target.value) })}
            className="mt-2 w-full accent-gold-500"
          />
        </div>
        <Select
          label="Review schedule"
          value={s.reviewSchedule}
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'alt-day', label: 'Every other day' },
            { value: 'weekly', label: 'Weekly' },
          ]}
          onChange={(e) => patch({ reviewSchedule: e.target.value as MS['reviewSchedule'] })}
        />
        <label className="flex items-center justify-between rounded-xl border border-ink-700/60 bg-ink-850/60 px-4 py-3 text-sm text-cream-100/90">
          <span>Hide translation during review</span>
          <input
            type="checkbox"
            checked={s.hideTranslationDuringReview}
            onChange={(e) => patch({ hideTranslationDuringReview: e.target.checked })}
            className="h-4 w-4 accent-gold-500"
          />
        </label>
      </div>
    </Card>
  );
}
