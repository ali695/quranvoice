'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { EmptyState } from '@/components/ui/EmptyState';
import { readJSON, writeJSON } from '@/lib/utils/storage';

interface RecentItem {
  reciterId: string;
  reciterName?: string;
  surah: number;
  surahLabel: string;
  at: string;
}

const KEY = 'audio-recent';

export function pushRecentlyPlayed(item: Omit<RecentItem, 'at'>) {
  const list = readJSON<RecentItem[]>(KEY, []);
  const dedup = list.filter((x) => !(x.surah === item.surah && x.reciterId === item.reciterId));
  writeJSON(KEY, [{ ...item, at: new Date().toISOString() }, ...dedup].slice(0, 30));
}

export function AudioQueue() {
  const [items, setItems] = useState<RecentItem[]>([]);
  useEffect(() => {
    setItems(readJSON<RecentItem[]>(KEY, []));
  }, []);

  if (items.length === 0) {
    return (
      <EmptyState
        icon="volume"
        title="No recent recitations"
        description="Recently played surahs will appear here."
      />
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((r, i) => (
        <li
          key={`${r.reciterId}-${r.surah}-${i}`}
          className="flex items-center gap-3 rounded-xl border border-ink-700/60 bg-ink-850/60 px-4 py-3"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/10 text-gold-300">
            <Icon name="play" size={14} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-cream-50">{r.surahLabel}</p>
            <p className="truncate text-xs text-cream-200/55">
              {r.reciterName ?? r.reciterId} · {new Date(r.at).toLocaleDateString()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
