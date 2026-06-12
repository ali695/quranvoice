'use client';

import { useEffect, useState } from 'react';
import { Tabs } from '@/components/ui/Tabs';
import { AsbabBlock } from '@/components/quran/AsbabBlock';
import { MemorizationControls } from './MemorizationControls';
import { ReflectionPrompt } from './ReflectionPrompt';
import { RelatedAyahs } from './RelatedAyahs';
import { TafsirTab } from './TafsirTab';
import { WordByWordTab } from './WordByWordTab';
import type { AsbabEntry } from '@/lib/types/asbab';

interface StudyPanelProps {
  surah: number;
  ayah: number;
}

export function StudyPanel({ surah, ayah }: StudyPanelProps) {
  const [asbab, setAsbab] = useState<AsbabEntry[]>([]);

  // Asbab is a small Supabase lookup — safe to fetch up front.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/asbab/${surah}:${ayah}`);
        if (res.ok) {
          const json = (await res.json()) as { data?: AsbabEntry[] };
          if (!cancelled) setAsbab(json.data ?? []);
        }
      } catch {
        // ignore
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [surah, ayah]);

  return (
    <div className="flex flex-col gap-5">
      <Tabs
        defaultId="tafsir"
        items={[
          { id: 'tafsir', label: 'Tafsir', content: <TafsirTab surah={surah} ayah={ayah} /> },
          { id: 'wbw', label: 'Word by word', content: <WordByWordTab surah={surah} ayah={ayah} /> },
          { id: 'asbab', label: 'Asbab al-Nuzul', content: <AsbabBlock entries={asbab} /> },
          { id: 'related', label: 'Related ayahs', content: <RelatedAyahs /> },
        ]}
      />
      <MemorizationControls surah={surah} ayah={ayah} />
      <ReflectionPrompt surah={surah} ayah={ayah} />
    </div>
  );
}
