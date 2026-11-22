'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { UnavailableState } from '@/components/ui/ErrorState';
import { SURAHS } from '@/lib/data/surahs';
import { languageName } from '@/lib/utils/languageNames';
import type { NormalizedTafsir, TafsirResource } from '@/lib/types/tafsir';
import { sanitizeHtml } from '@/lib/utils/sanitizeHtml';

const looksHtml = (s: string) => /<[a-z][\s\S]*>/i.test(s);

/**
 * Full interactive tafsir reader: choose a language, a tafsir source
 * (Quran.Foundation + spa5k fallback), and a verse, then read the real tafsir
 * content with a source label and a fallback badge — not just a list of names.
 */
export function TafsirExplorer() {
  const [resources, setResources] = useState<TafsirResource[]>([]);
  const [language, setLanguage] = useState('en');
  const [selectedId, setSelectedId] = useState('auto');
  const [surah, setSurah] = useState(1);
  const [ayah, setAyah] = useState(1);
  const [tafsir, setTafsir] = useState<NormalizedTafsir | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');

  const ayahCount = SURAHS.find((s) => s.number === surah)?.ayahCount ?? 7;

  // Load the full catalog (QF + fallback) once.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/quran/tafsirs?fallback=1');
        if (res.ok) {
          const json = (await res.json()) as { data?: TafsirResource[] };
          if (!cancelled && json.data) setResources(json.data);
        }
      } catch {
        /* ignore */
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const languages = useMemo(() => {
    const set = new Map<string, number>();
    for (const t of resources) {
      const iso = (t.language || '').toLowerCase();
      if (iso) set.set(iso, (set.get(iso) ?? 0) + 1);
    }
    return Array.from(set.entries())
      .map(([iso, count]) => ({ iso, count, name: languageName(iso) }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [resources]);

  const inLang = useMemo(
    () => resources.filter((t) => (t.language || '').toLowerCase() === language),
    [resources, language],
  );
  const grouped = useMemo(
    () => ({
      qf: inLang.filter((t) => t.provider !== 'spa5k_fallback'),
      fb: inLang.filter((t) => t.provider === 'spa5k_fallback'),
    }),
    [inLang],
  );

  // Only the latest request may update the screen — a slow response for a
  // previous surah/ayah must never replace the current one.
  const requestSeq = useRef(0);
  const read = useCallback(
    async (id: string, s: number, a: number, lang: string) => {
      const seq = ++requestSeq.current;
      setTafsir(null);
      setState('loading');
      try {
        const res = await fetch(
          `/api/quran/tafsirs/by-verse/${s}/${a}?id=${encodeURIComponent(id)}&lang=${encodeURIComponent(lang)}&fallback=1`,
        );
        if (seq !== requestSeq.current) return;
        if (!res.ok) {
          setState('error');
          return;
        }
        const json = (await res.json()) as { data?: NormalizedTafsir | null };
        if (seq !== requestSeq.current) return;
        const data = json.data ?? null;
        // Defensive: never show commentary for a different verse than requested.
        setTafsir(data && data.surahNumber === s && data.ayahNumber === a ? data : null);
        setState('loaded');
      } catch {
        if (seq === requestSeq.current) setState('error');
      }
    },
    [],
  );

  // Load automatically whenever the surah, ayah, tafsir or language changes
  // (short delay so typing an ayah number doesn't fire on every keystroke).
  useEffect(() => {
    if (resources.length === 0) return;
    const t = window.setTimeout(() => void read(selectedId, surah, ayah, language), 250);
    return () => window.clearTimeout(t);
  }, [selectedId, surah, ayah, language, resources.length, read]);

  const surahName = SURAHS.find((x) => x.number === surah)?.transliteration ?? `Surah ${surah}`;

  const rtl = tafsir ? /[؀-ۿ]/.test(tafsir.content.slice(0, 40)) : false;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 rounded-2xl border border-ink-600/50 bg-ink-800/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Tafsir language">
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setSelectedId('auto');
            }}
            className="select-base"
          >
            {languages.length === 0 && <option value="en">English</option>}
            {languages.map((l) => (
              <option key={l.iso} value={l.iso} className="bg-ink-900">
                {l.name} ({l.count})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tafsir source">
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="select-base">
            <option value="auto" className="bg-ink-900">Auto (best available)</option>
            {grouped.qf.length > 0 && (
              <optgroup label="Tafsirs">
                {grouped.qf.map((t) => (
                  <option key={String(t.id)} value={String(t.id)} className="bg-ink-900">{t.name}</option>
                ))}
              </optgroup>
            )}
            {grouped.fb.length > 0 && (
              <optgroup label="More tafsirs">
                {grouped.fb.map((t) => (
                  <option key={String(t.id)} value={String(t.id)} className="bg-ink-900">{t.name}</option>
                ))}
              </optgroup>
            )}
          </select>
        </Field>
        <Field label="Surah">
          <select
            value={surah}
            onChange={(e) => {
              setSurah(Number(e.target.value));
              setAyah(1);
            }}
            className="select-base"
          >
            {SURAHS.map((s) => (
              <option key={s.number} value={s.number} className="bg-ink-900">
                {s.number}. {s.transliteration}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ayah">
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              max={ayahCount}
              value={ayah}
              onChange={(e) => setAyah(Math.max(1, Math.min(ayahCount, Number(e.target.value) || 1)))}
              className="select-base w-20"
            />
            <Button size="md" onClick={() => read(selectedId, surah, ayah, language)} disabled={state === 'loading'}>
              {state === 'loading' ? 'Loading…' : 'Read tafsir'}
            </Button>
          </div>
        </Field>
      </div>

      {state === 'idle' && (
        <p className="text-sm text-cream-200/55">
          Choose a language, a tafsir, a surah and an ayah — the tafsir loads automatically. Urdu,
          Arabic, English and more are available.
        </p>
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
          description="The request failed. Try again or pick another tafsir source."
          action={
            <Button size="sm" variant="secondary" onClick={() => read(selectedId, surah, ayah, language)}>
              Retry loading
            </Button>
          }
        />
      )}
      {state === 'loaded' &&
        (tafsir ? (
          <article className="rounded-2xl border border-ink-600/50 bg-ink-800/40 p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-gold-400/80">
              <span>{tafsir.editionName}</span>
              {tafsir.author && <span className="text-cream-200/45">· {tafsir.author}</span>}
              <span className="text-cream-200/45">· {languageName(tafsir.language)}</span>
              <span className="text-cream-200/45">
                · Surah {surahName} {tafsir.verseKey}
              </span>
            </div>
            {selectedId !== 'auto' && String(tafsir.editionSlug) !== selectedId && (
              <p className="mt-3 rounded-lg border border-gold-500/30 bg-gold-500/5 px-3 py-2 text-xs text-gold-100/90">
                {resources.find((t) => String(t.id) === selectedId)?.name ?? 'The selected tafsir'} has no commentary on
                this verse, so {tafsir.editionName} is shown instead.
              </p>
            )}
            {looksHtml(tafsir.content) ? (
              <div
                dir={rtl ? 'rtl' : 'ltr'}
                className={`mt-3 leading-relaxed text-cream-100/90 ${rtl ? 'text-right text-base' : 'text-sm'}`}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(tafsir.content, { allowClass: true }) }}
              />
            ) : (
              <p
                dir={rtl ? 'rtl' : 'ltr'}
                className={`mt-3 leading-relaxed text-cream-100/90 ${rtl ? 'text-right text-base' : 'text-sm'}`}
              >
                {tafsir.content}
              </p>
            )}
            <p className="mt-4 text-[10px] uppercase tracking-wider text-cream-200/45">
              Source: {tafsir.editionName}
            </p>
          </article>
        ) : (
          <UnavailableState
            title="No tafsir for this verse"
            badge="No content"
            description="No tafsir content is available for this Ayah from the selected sources. Try another tafsir source or language above."
          />
        ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-cream-200/70">{label}</span>
      {children}
    </label>
  );
}
