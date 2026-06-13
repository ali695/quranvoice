'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { UnavailableState } from '@/components/ui/ErrorState';
import { loadSettings, updateSettings } from '@/lib/services/settingsService';
import { languageName } from '@/lib/utils/languageNames';
import { providerLabel } from '@/lib/tafsir/tafsir-source-priority';
import type { NormalizedTafsir, TafsirResource } from '@/lib/types/tafsir';

interface TafsirTabProps {
  surah: number;
  ayah: number;
}

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

const looksHtml = (s: string) => /<[a-z][\s\S]*>/i.test(s);

/**
 * Lazy tafsir loader for the study panel.
 *  - loads tafsir resources (Quran.Foundation + spa5k fallback), grouped
 *  - resolves the verse tafsir via the source-priority endpoint
 *  - shows source label, fallback badge, retry, and a source switcher
 */
export function TafsirTab({ surah, ayah }: TafsirTabProps) {
  const [resources, setResources] = useState<TafsirResource[]>([]);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('auto');
  const [tafsir, setTafsir] = useState<NormalizedTafsir | null>(null);
  const [state, setState] = useState<LoadState>('idle');
  const [fallbackEnabled, setFallbackEnabled] = useState(true);
  const [language, setLanguage] = useState('en');

  // Load resource catalog + saved prefs once.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const s = loadSettings().tafsir;
      setFallbackEnabled(s.fallbackTafsirEnabled);
      setLanguage(s.language || 'en');
      try {
        const res = await fetch(
          `/api/quran/tafsirs?lang=${encodeURIComponent(s.language || 'en')}&fallback=${s.fallbackTafsirEnabled ? '1' : '0'}`,
        );
        if (res.ok) {
          const json = (await res.json()) as { data?: TafsirResource[] };
          if (!cancelled && json.data) {
            setResources(json.data);
            const saved = s.defaultTafsirId;
            setSelectedId(
              saved != null && json.data.some((t) => String(t.id) === String(saved))
                ? String(saved)
                : 'auto',
            );
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
      setState('loading');
      try {
        const res = await fetch(
          `/api/quran/tafsirs/by-verse/${surah}/${ayah}?id=${encodeURIComponent(id)}&lang=${encodeURIComponent(language)}&fallback=${fallbackEnabled ? '1' : '0'}`,
        );
        if (!res.ok) {
          setState('error');
          return;
        }
        const json = (await res.json()) as { data?: NormalizedTafsir | null };
        setTafsir(json.data ?? null);
        setState('loaded');
      } catch {
        setState('error');
      }
    },
    [surah, ayah, language, fallbackEnabled],
  );

  useEffect(() => {
    if (resourcesLoaded) void fetchTafsir(selectedId);
  }, [selectedId, resourcesLoaded, fetchTafsir]);

  const onSelect = (id: string) => {
    setSelectedId(id);
    updateSettings('tafsir', { defaultTafsirId: id === 'auto' ? null : id });
  };

  const grouped = useMemo(() => {
    const qf = resources.filter((r) => r.provider !== 'spa5k_fallback');
    const fb = resources.filter((r) => r.provider === 'spa5k_fallback');
    return { qf, fb };
  }, [resources]);

  if (resourcesLoaded && resources.length === 0) {
    return (
      <UnavailableState
        title="Tafsir"
        badge="No sources"
        description="No tafsir resources are available from Quran.Foundation or the fallback source. Connect Quran.Foundation to unlock tafsir in multiple languages."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Source switcher (grouped by provider) */}
      {resources.length > 0 && (
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex min-w-[260px] flex-1 flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-cream-200/70">
              Tafsir source
            </span>
            <select
              value={selectedId}
              onChange={(e) => onSelect(e.target.value)}
              className="h-11 appearance-none rounded-xl border border-ink-600/70 bg-ink-800/70 px-4 text-sm text-cream-50 focus:border-gold-500/50 focus:outline-none"
            >
              <option value="auto" className="bg-ink-900">
                Auto (best available)
              </option>
              {grouped.qf.length > 0 && (
                <optgroup label="Quran.Foundation">
                  {grouped.qf.map((t) => (
                    <option key={String(t.id)} value={String(t.id)} className="bg-ink-900">
                      {t.name} · {languageName(t.language)}
                    </option>
                  ))}
                </optgroup>
              )}
              {grouped.fb.length > 0 && (
                <optgroup label="Fallback Tafsir API">
                  {grouped.fb.map((t) => (
                    <option key={String(t.id)} value={String(t.id)} className="bg-ink-900">
                      {t.name} · {languageName(t.language)}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </label>
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
          description="The request failed. Try again or pick another tafsir source above."
          action={
            <Button size="sm" variant="secondary" onClick={() => fetchTafsir(selectedId)}>
              Retry loading
            </Button>
          }
        />
      )}

      {state === 'loaded' &&
        (tafsir ? (
          <TafsirContent tafsir={tafsir} />
        ) : (
          <UnavailableState
            title="No tafsir for this verse"
            badge="No content"
            description="No tafsir content is available for this Ayah from the selected sources. Try another tafsir source above."
          />
        ))}
    </div>
  );
}

function TafsirContent({ tafsir }: { tafsir: NormalizedTafsir }) {
  const rtl = /[؀-ۿ]/.test(tafsir.content.slice(0, 40));
  return (
    <article className="rounded-xl border border-ink-700/60 bg-ink-850/60 p-4">
      <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider text-gold-400/80">
        <span>{tafsir.editionName}</span>
        {tafsir.author && <span className="text-cream-200/45">· {tafsir.author}</span>}
        <span className="text-cream-200/45">· {languageName(tafsir.language)}</span>
        {tafsir.isFallback && (
          <span className="rounded-full border border-gold-500/30 bg-gold-500/10 px-2 py-0.5 text-[9px] text-gold-200">
            Fallback source
          </span>
        )}
      </div>
      {looksHtml(tafsir.content) ? (
        <div
          dir={rtl ? 'rtl' : 'ltr'}
          className={`mt-2 text-sm leading-relaxed text-cream-100/85 ${rtl ? 'text-right' : ''}`}
          // Content originates from a registered source (Quran.Foundation or
          // the labelled spa5k fallback); never AI-generated.
          dangerouslySetInnerHTML={{ __html: tafsir.content }}
        />
      ) : (
        <p
          dir={rtl ? 'rtl' : 'ltr'}
          className={`mt-2 text-sm leading-relaxed text-cream-100/85 ${rtl ? 'text-right' : ''}`}
        >
          {tafsir.content}
        </p>
      )}
      <p className="mt-3 text-[10px] uppercase tracking-wider text-cream-200/45">
        Source: {providerLabel(tafsir.provider)} · {tafsir.editionName}
      </p>
    </article>
  );
}
