'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { UnavailableState } from '@/components/ui/ErrorState';
import { TafsirBlock } from '@/components/quran/TafsirBlock';
import { loadSettings, updateSettings } from '@/lib/services/settingsService';
import { languageName } from '@/lib/utils/languageNames';
import type { TafsirEntry, TafsirResource } from '@/lib/types/tafsir';

interface TafsirTabProps {
  surah: number;
  ayah: number;
}

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * Lazy tafsir loader for the study panel:
 *  - loads available tafsir resources from /api/quran/tafsirs
 *  - uses the saved default, else the first resource
 *  - fetches the tafsir for the exact verse, with retry on failure
 *  - always shows the source/book/author + language
 */
export function TafsirTab({ surah, ayah }: TafsirTabProps) {
  const [resources, setResources] = useState<TafsirResource[]>([]);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('');
  const [entries, setEntries] = useState<TafsirEntry[] | null>(null);
  const [state, setState] = useState<LoadState>('idle');

  // Load resource catalog + saved default once.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const saved = loadSettings().tafsir.defaultTafsirId;
      try {
        const res = await fetch('/api/quran/tafsirs');
        if (res.ok) {
          const json = (await res.json()) as { data?: TafsirResource[] };
          if (!cancelled && json.data) {
            setResources(json.data);
            const initial =
              saved != null && json.data.some((t) => String(t.id) === String(saved))
                ? String(saved)
                : json.data[0]
                  ? String(json.data[0].id)
                  : '';
            setSelectedId(initial);
          }
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setResourcesLoaded(true);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchTafsir = useCallback(
    async (id: string) => {
      if (!id) return;
      setState('loading');
      try {
        const res = await fetch(
          `/api/quran/tafsirs/by-verse/${surah}/${ayah}?id=${encodeURIComponent(id)}`,
        );
        if (!res.ok) {
          setState('error');
          return;
        }
        const json = (await res.json()) as { data?: TafsirEntry[] };
        setEntries(json.data ?? []);
        setState('loaded');
      } catch {
        setState('error');
      }
    },
    [surah, ayah],
  );

  // Fetch whenever the verse or selected tafsir changes.
  useEffect(() => {
    if (selectedId) void fetchTafsir(selectedId);
  }, [selectedId, fetchTafsir]);

  const onSelect = (id: string) => {
    setSelectedId(id);
    updateSettings('tafsir', { defaultTafsirId: id || null });
  };

  const options = useMemo(
    () =>
      resources.map((t) => ({
        value: String(t.id),
        label: `${t.name}${t.language ? ` · ${languageName(t.language)}` : ''}`,
      })),
    [resources],
  );

  if (resourcesLoaded && resources.length === 0) {
    return (
      <UnavailableState
        title="Tafsir"
        badge="No sources"
        description="The active content source returned no tafsir resources. Connect Quran.Foundation to unlock tafsir in multiple languages."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {resources.length > 0 && (
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[240px] flex-1">
            <Select
              label="Tafsir source"
              value={selectedId}
              options={options}
              onChange={(e) => onSelect(e.target.value)}
            />
          </div>
          {state === 'error' && (
            <Button size="sm" variant="secondary" onClick={() => fetchTafsir(selectedId)}>
              Retry loading
            </Button>
          )}
        </div>
      )}

      {state === 'loading' && (
        <div className="flex flex-col gap-2 rounded-xl border border-ink-700/60 bg-ink-850/60 p-4">
          <div className="h-3 w-1/3 animate-pulse rounded bg-ink-700/70" />
          <div className="h-3 w-full animate-pulse rounded bg-ink-700/50" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-ink-700/50" />
        </div>
      )}

      {state === 'error' && (
        <UnavailableState
          title="Couldn’t load this tafsir"
          badge="Retry"
          description="The request failed or the source returned no content for this verse. Try again or pick another tafsir source above."
          action={
            <Button size="sm" variant="secondary" onClick={() => fetchTafsir(selectedId)}>
              Retry loading
            </Button>
          }
        />
      )}

      {state === 'loaded' &&
        (entries && entries.length > 0 ? (
          <TafsirBlock entries={entries} />
        ) : (
          <UnavailableState
            title="No tafsir for this verse"
            badge="No content"
            description="The selected tafsir source did not return content for this specific verse. Try another tafsir source above."
          />
        ))}
    </div>
  );
}
