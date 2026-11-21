'use client';

import { useEffect, useState } from 'react';
import { Select } from '@/components/ui/Select';
import { useAudioPlayer } from './AudioPlayerProvider';

interface TimedReciter {
  id: string;
  name: string;
  style?: string;
}

/** Legacy AlQuran-Cloud IDs that older saved settings may still hold. */
const LEGACY_IDS: Record<string, string> = {
  'ar.abdulbasitmujawwad': '1',
  'ar.abdulbasitmurattal': '2',
  'ar.abdurrahmaansudais': '3',
  'ar.sudais': '3',
  'ar.shaatree': '4',
  'ar.hanirifai': '5',
  'ar.husary': '6',
  'ar.alafasy': '7',
  'ar.minshawi': '9',
  'ar.saoodshuraym': '10',
  'ar.shuraim': '10',
  'ar.ghamdi': '13',
  'ar.ahmedajamy': '19',
  'ar.mahermuaiqly': '159',
};

let cached: TimedReciter[] | null = null;

/**
 * Reciter picker limited to voices whose full-surah audio carries real
 * word-level timing, so the live pointer works for every choice.
 */
export function ReciterSelector() {
  const { reciterId, setReciter } = useAudioPlayer();
  const [reciters, setReciters] = useState<TimedReciter[]>(cached ?? []);

  useEffect(() => {
    if (cached) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/quran/timed-reciters');
        if (!res.ok) return;
        const json = (await res.json()) as { data?: TimedReciter[] };
        if (!cancelled && json.data?.length) {
          cached = json.data;
          setReciters(json.data);
        }
      } catch {
        // ignore — picker stays hidden
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (reciters.length === 0) return null;
  const value = reciters.some((r) => r.id === reciterId) ? reciterId : LEGACY_IDS[reciterId] ?? '';

  return (
    <Select
      label="Reciter (word-synced)"
      value={value}
      onChange={(e) => {
        const r = reciters.find((x) => x.id === e.target.value);
        setReciter(e.target.value, r?.name);
      }}
      options={[
        ...(value ? [] : [{ value: '', label: 'Choose a reciter' }]),
        ...reciters.map((r) => ({
          value: r.id,
          label: r.style && !/murattal/i.test(r.style) ? `${r.name} · ${r.style}` : r.name,
        })),
      ]}
    />
  );
}
