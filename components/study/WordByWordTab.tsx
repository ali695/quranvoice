'use client';

import { useEffect, useState } from 'react';
import { WordByWordBlock } from '@/components/quran/WordByWordBlock';
import type { WordToken } from '@/lib/types/quran';

interface WordByWordTabProps {
  surah: number;
  ayah: number;
}

/** Lazy word-by-word loader for the study panel. */
export function WordByWordTab({ surah, ayah }: WordByWordTabProps) {
  const [words, setWords] = useState<WordToken[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/quran/verses/by-key/${surah}:${ayah}/words`);
        if (res.ok) {
          const json = (await res.json()) as { data?: WordToken[] };
          if (!cancelled) setWords(json.data ?? null);
        } else if (!cancelled) {
          setWords(null);
        }
      } catch {
        if (!cancelled) setWords(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [surah, ayah]);

  return <WordByWordBlock words={words ?? undefined} loading={loading} />;
}
