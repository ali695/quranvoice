'use client';

import { useEffect, useState } from 'react';
import { Tabs } from '@/components/ui/Tabs';
import { AsbabBlock } from '@/components/quran/AsbabBlock';
import { TafsirBlock } from '@/components/quran/TafsirBlock';
import { WordByWordBlock } from '@/components/quran/WordByWordBlock';
import { MemorizationControls } from './MemorizationControls';
import { ReflectionPrompt } from './ReflectionPrompt';
import { RelatedAyahs } from './RelatedAyahs';
import type { AsbabEntry } from '@/lib/types/asbab';
import type { TafsirEntry } from '@/lib/types/tafsir';

interface StudyPanelProps {
  surah: number;
  ayah: number;
}

export function StudyPanel({ surah, ayah }: StudyPanelProps) {
  const [tafsir, setTafsir] = useState<TafsirEntry[] | null>(null);
  const [asbab, setAsbab] = useState<AsbabEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [tRes, aRes] = await Promise.all([
          fetch(`/api/quran/tafsirs/by-verse/${surah}/${ayah}`),
          fetch(`/api/asbab/${surah}:${ayah}`),
        ]);
        if (tRes.ok) {
          const json = (await tRes.json()) as { data?: TafsirEntry[] };
          if (!cancelled) setTafsir(json.data ?? []);
        }
        if (aRes.ok) {
          const json = (await aRes.json()) as { data?: AsbabEntry[] };
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
          { id: 'tafsir', label: 'Tafsir', content: <TafsirBlock entries={tafsir ?? undefined} /> },
          { id: 'wbw', label: 'Word by word', content: <WordByWordBlock words={undefined} /> },
          { id: 'asbab', label: 'Asbab al-Nuzul', content: <AsbabBlock entries={asbab} /> },
          { id: 'related', label: 'Related ayahs', content: <RelatedAyahs /> },
        ]}
      />
      <MemorizationControls surah={surah} ayah={ayah} />
      <ReflectionPrompt surah={surah} ayah={ayah} />
    </div>
  );
}
