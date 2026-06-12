'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookmarkButton } from '@/components/study/BookmarkButton';
import { NotesPanel } from '@/components/study/NotesPanel';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { loadSettings } from '@/lib/services/settingsService';
import type { TafsirEntry } from '@/lib/types/tafsir';

interface DailyVerseExtrasProps {
  surah: number;
  ayah: number;
}

type TafsirState = 'idle' | 'loading' | 'loaded' | 'empty' | 'error' | 'unselected';

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Client extras for Ayah of the Day: bookmark, reflection note, and a live
 * tafsir preview using the reader's selected/default tafsir source.
 */
export function DailyVerseExtras({ surah, ayah }: DailyVerseExtrasProps) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [tafsir, setTafsir] = useState<TafsirEntry | null>(null);
  const [state, setState] = useState<TafsirState>('idle');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const settings = loadSettings();
      let id = settings.tafsir.defaultTafsirId;
      // No explicit default — try the first available tafsir resource.
      if (id == null) {
        try {
          const res = await fetch('/api/quran/tafsirs');
          if (res.ok) {
            const json = (await res.json()) as { data?: Array<{ id: string | number }> };
            id = json.data?.[0]?.id ?? null;
          }
        } catch {
          /* ignore */
        }
      }
      if (id == null) {
        if (!cancelled) setState('unselected');
        return;
      }
      if (!cancelled) setState('loading');
      try {
        const res = await fetch(
          `/api/quran/tafsirs/by-verse/${surah}/${ayah}?id=${encodeURIComponent(String(id))}`,
        );
        if (!res.ok) {
          if (!cancelled) setState('error');
          return;
        }
        const json = (await res.json()) as { data?: TafsirEntry[] };
        const entry = json.data?.[0] ?? null;
        if (cancelled) return;
        if (entry) {
          setTafsir(entry);
          setState('loaded');
        } else {
          setState('empty');
        }
      } catch {
        if (!cancelled) setState('error');
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [surah, ayah, reloadKey]);

  const previewText = tafsir
    ? stripHtml(tafsir.text || tafsir.textHtml || '')
    : '';

  return (
    <div className="mt-6 space-y-4">
      {/* Save + reflect */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 text-xs text-cream-200/80">
          <BookmarkButton surah={surah} ayah={ayah} />
          <span>Save to bookmarks</span>
        </span>
        <button
          type="button"
          onClick={() => setNotesOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink-600/70 px-3 py-2 text-xs font-medium text-cream-200/80 hover:border-gold-500/40 hover:text-gold-300"
        >
          <Icon name="note" size={14} />
          Add reflection note
        </button>
      </div>

      {/* Tafsir preview */}
      <div className="rounded-xl border border-ink-700/60 bg-ink-850/50 p-4">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gold-400/80">
          <Icon name="feather" size={12} />
          Tafsir preview
        </div>
        {state === 'loading' && (
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-ink-700/60" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-ink-700/50" />
          </div>
        )}
        {state === 'loaded' && tafsir && (
          <>
            <p className="mt-2 text-sm leading-relaxed text-cream-100/85">
              {previewText.length > 280 ? `${previewText.slice(0, 280)}…` : previewText}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-[10px] uppercase tracking-wider text-cream-200/45">
                Source: {tafsir.source.name}
              </span>
              <Link
                href={`/study/${surah}/${ayah}`}
                className="text-xs font-medium text-gold-300 hover:text-gold-200"
              >
                Read full tafsir →
              </Link>
            </div>
          </>
        )}
        {state === 'unselected' && (
          <p className="mt-2 text-sm text-cream-200/70">
            No tafsir source is selected.{' '}
            <Link href="/settings" className="text-gold-300 hover:text-gold-200">
              Choose a tafsir
            </Link>{' '}
            to see a preview here.
          </p>
        )}
        {state === 'empty' && (
          <p className="mt-2 text-sm text-cream-200/70">
            The selected tafsir source returned no content for this verse.{' '}
            <Link href="/tafsir" className="text-gold-300 hover:text-gold-200">
              Browse tafsir sources
            </Link>
            .
          </p>
        )}
        {state === 'error' && (
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-sm text-cream-200/70">Couldn’t load the tafsir preview.</p>
            <Button size="sm" variant="secondary" onClick={() => setReloadKey((k) => k + 1)}>
              Retry loading
            </Button>
          </div>
        )}
      </div>

      <NotesPanel surah={surah} ayah={ayah} open={notesOpen} onClose={() => setNotesOpen(false)} />
    </div>
  );
}
