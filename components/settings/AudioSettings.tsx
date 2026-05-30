'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { loadSettings, updateSettings } from '@/lib/services/settingsService';
import type { AudioSettings as AS } from '@/lib/types/settings';
import type { Reciter } from '@/lib/types/audio';

export function AudioSettings() {
  const [s, setS] = useState<AS | null>(null);
  const [reciters, setReciters] = useState<Reciter[]>([]);

  useEffect(() => setS(loadSettings().audio), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch('/api/quran/recitations');
      if (!res.ok) return;
      const json = (await res.json()) as { data?: Reciter[] };
      if (!cancelled && json.data) setReciters(json.data);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!s) return null;
  const patch = (p: Partial<AS>) => {
    const next = updateSettings('audio', p);
    setS(next.audio);
  };

  return (
    <Card variant="elevated" className="p-6">
      <h2 className="font-display text-lg font-medium text-cream-50">Audio</h2>
      <p className="mt-1 text-sm text-cream-200/65">Reciter, playback, and behavior.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Select
          label="Default reciter"
          value={s.defaultReciterId}
          options={
            reciters.length > 0
              ? reciters.map((r) => ({ value: r.id, label: r.name }))
              : [{ value: s.defaultReciterId, label: s.defaultReciterId }]
          }
          onChange={(e) => patch({ defaultReciterId: e.target.value })}
        />
        <Select
          label="Playback speed"
          value={String(s.playbackSpeed)}
          options={[
            { value: '0.75', label: '0.75×' },
            { value: '1', label: '1.0×' },
            { value: '1.25', label: '1.25×' },
            { value: '1.5', label: '1.5×' },
            { value: '2', label: '2.0×' },
          ]}
          onChange={(e) => patch({ playbackSpeed: Number(e.target.value) })}
        />
        <Select
          label="Audio quality"
          value={s.audioQuality}
          options={[
            { value: 'low', label: 'Low (saves data)' },
            { value: 'standard', label: 'Standard' },
            { value: 'high', label: 'High' },
          ]}
          onChange={(e) => patch({ audioQuality: e.target.value as AS['audioQuality'] })}
        />
        <Select
          label="Repeat mode"
          value={s.repeatMode}
          options={[
            { value: 'off', label: 'Off' },
            { value: 'ayah', label: 'Ayah' },
            { value: 'range', label: 'Range' },
            { value: 'surah', label: 'Surah' },
          ]}
          onChange={(e) => patch({ repeatMode: e.target.value as AS['repeatMode'] })}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {(
          [
            ['autoScroll', 'Auto-scroll to playing ayah'],
            ['autoPlayNextAyah', 'Auto-play next ayah'],
            ['autoPlayNextSurah', 'Auto-play next surah'],
            ['showMiniPlayer', 'Show mini player'],
          ] as const
        ).map(([key, label]) => (
          <label
            key={key}
            className="flex items-center justify-between rounded-xl border border-ink-700/60 bg-ink-850/60 px-4 py-3 text-sm text-cream-100/90"
          >
            <span>{label}</span>
            <input
              type="checkbox"
              checked={Boolean(s[key])}
              onChange={(e) => patch({ [key]: e.target.checked } as Partial<AS>)}
              className="h-4 w-4 accent-gold-500"
            />
          </label>
        ))}
      </div>
    </Card>
  );
}
