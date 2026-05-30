'use client';

import { useEffect, useState } from 'react';
import { Select } from '@/components/ui/Select';
import { useAudioPlayer } from './AudioPlayerProvider';
import type { Reciter } from '@/lib/types/audio';

export function ReciterSelector() {
  const { reciterId, setReciter } = useAudioPlayer();
  const [reciters, setReciters] = useState<Reciter[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/quran/recitations');
        if (!res.ok) return;
        const json = (await res.json()) as { data?: Reciter[] };
        if (!cancelled && json.data) setReciters(json.data);
      } catch {
        // ignore
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (reciters.length === 0) {
    return null;
  }
  return (
    <Select
      label="Reciter"
      value={reciterId}
      onChange={(e) => {
        const r = reciters.find((x) => x.id === e.target.value);
        setReciter(e.target.value, r?.name);
      }}
      options={reciters.map((r) => ({ value: r.id, label: r.name }))}
    />
  );
}
