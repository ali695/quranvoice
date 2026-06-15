'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Select } from '@/components/ui/Select';
import {
  buildLineStyles,
  buildMushafStyles,
  buildQuranScripts,
  buildTajweedCapability,
} from '@/lib/data/mushafCapabilities';
import { useCapabilities } from '@/lib/hooks/useCapabilities';
import { loadSettings, updateSettings } from '@/lib/services/settingsService';
import type { ReadingSettings as RS } from '@/lib/types/settings';

const FONT_OPTIONS = [
  { value: 'amiri', label: 'Amiri (recommended)' },
  { value: 'scheherazade', label: 'Scheherazade New' },
  { value: 'noto-naskh', label: 'Noto Naskh Arabic' },
  { value: 'uthmani', label: 'Uthmani Hafs' },
];

const MODE_OPTIONS = [
  { value: 'reading', label: 'Reading (clean)' },
  { value: 'study', label: 'Study (expanded)' },
  { value: 'focus', label: 'Focus (Arabic only)' },
  { value: 'mushaf', label: 'Mushaf (page layout)' },
];

export function ReadingSettings() {
  const [s, setS] = useState<RS | null>(null);
  const { capabilities, loading } = useCapabilities();

  useEffect(() => setS(loadSettings().reading), []);

  const scripts = useMemo(() => buildQuranScripts(capabilities), [capabilities]);
  const mushafStyles = useMemo(() => buildMushafStyles(capabilities), [capabilities]);
  const lineStyles = useMemo(() => buildLineStyles(capabilities), [capabilities]);
  const tajweed = useMemo(() => buildTajweedCapability(capabilities), [capabilities]);

  if (!s) return null;

  const onSave = (patch: Partial<RS>) => {
    setS((cur) => (cur ? { ...cur, ...patch } : cur));
    updateSettings('reading', patch);
  };

  return (
    <Card variant="elevated" className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-medium text-cream-50">Reading</h2>
          <p className="mt-1 text-sm text-cream-200/65">
            Script, mushaf style, fonts, and what to show under every ayah.
          </p>
        </div>
        <SourceStatus loading={loading} provider={capabilities?.provider ?? null} />
      </div>

      {/* ── Script + Mushaf ───────────────────────────────── */}
      <fieldset className="mt-5">
        <legend className="text-xs font-medium uppercase tracking-wider text-gold-400/80">
          Script &amp; mushaf layout
        </legend>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <CapabilitySelect
            label="Quran script"
            value={s.script}
            options={scripts.map((o) => ({ value: o.value, label: o.label, enabled: o.enabled, reason: o.reason }))}
            onChange={(v) => onSave({ script: v as RS['script'] })}
          />
          <CapabilitySelect
            label="Mushaf style"
            value={s.mushafStyle}
            options={mushafStyles.map((o) => ({ value: o.value, label: o.label, enabled: o.enabled, reason: o.reason }))}
            onChange={(v) => onSave({ mushafStyle: v as RS['mushafStyle'] })}
          />
          <CapabilitySelect
            label="Line style"
            value={s.lineStyle}
            options={lineStyles.map((o) => ({ value: o.value, label: o.label, enabled: o.enabled, reason: o.reason }))}
            onChange={(v) => onSave({ lineStyle: v as RS['lineStyle'] })}
          />
          <Select
            label="Reading mode"
            value={s.mode}
            options={MODE_OPTIONS}
            onChange={(e) => onSave({ mode: e.target.value as RS['mode'] })}
          />
        </div>

        <label
          className={`mt-4 flex items-start gap-3 rounded-xl border p-4 text-sm ${
            tajweed.enabled
              ? 'border-ink-700/60 bg-ink-850/60 text-cream-100/90'
              : 'border-ink-700/60 bg-ink-850/40 text-cream-200/55'
          }`}
        >
          <input
            type="checkbox"
            checked={s.tajweedMode && tajweed.enabled}
            disabled={!tajweed.enabled}
            onChange={(e) => onSave({ tajweedMode: e.target.checked })}
            className="mt-0.5 h-4 w-4 accent-gold-500 disabled:opacity-50"
          />
          <span>
            <span className="font-medium text-cream-50">Tajweed mode</span>
            <span className="ml-2 text-xs text-cream-200/55">
              {tajweed.enabled
                ? 'Color-coded Tajweed rules from the active source.'
                : 'Color-coded Tajweed rules.'}
            </span>
            {!tajweed.enabled && tajweed.reason && (
              <span className="mt-1 block text-xs text-gold-300/90">{tajweed.reason}</span>
            )}
          </span>
        </label>
      </fieldset>

      {/* ── Typography ───────────────────────────────────── */}
      <fieldset className="mt-6">
        <legend className="text-xs font-medium uppercase tracking-wider text-gold-400/80">
          Typography
        </legend>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Select
            label="Arabic font"
            value={s.arabicFont}
            options={FONT_OPTIONS}
            onChange={(e) => onSave({ arabicFont: e.target.value as RS['arabicFont'] })}
          />
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-cream-200/70">
              Line height: {s.lineHeight.toFixed(1)}
            </label>
            <input
              type="range"
              min={1.4}
              max={2.6}
              step={0.1}
              value={s.lineHeight}
              onChange={(e) => onSave({ lineHeight: Number(e.target.value) })}
              className="mt-2 w-full accent-gold-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-cream-200/70">
              Arabic font size: {s.arabicFontSize}px
            </label>
            <input
              type="range"
              min={20}
              max={56}
              value={s.arabicFontSize}
              onChange={(e) => onSave({ arabicFontSize: Number(e.target.value) })}
              className="mt-2 w-full accent-gold-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-cream-200/70">
              Translation font size: {s.translationFontSize}px
            </label>
            <input
              type="range"
              min={12}
              max={22}
              value={s.translationFontSize}
              onChange={(e) => onSave({ translationFontSize: Number(e.target.value) })}
              className="mt-2 w-full accent-gold-500"
            />
          </div>
        </div>
      </fieldset>

      {/* ── Visibility ───────────────────────────────────── */}
      <fieldset className="mt-6">
        <legend className="text-xs font-medium uppercase tracking-wider text-gold-400/80">
          What to show
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(
            [
              ['showTranslation', 'Show translation'],
              ['showTransliteration', 'Show transliteration'],
              ['showWordByWord', 'Show word by word'],
              ['showTafsirInline', 'Show tafsir inline'],
              ['showSourceLabels', 'Show source labels'],
              ['showAyahActions', 'Show ayah action bar'],
              ['autoScrollWithAudio', 'Auto-scroll to playing ayah'],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-xl border border-ink-700/60 bg-ink-850/60 px-4 py-3 text-sm text-cream-100/90"
            >
              <span>{label}</span>
              <input
                type="checkbox"
                checked={Boolean(s[key])}
                onChange={(e) => onSave({ [key]: e.target.checked } as Partial<RS>)}
                className="h-4 w-4 accent-gold-500"
              />
            </label>
          ))}
        </div>
      </fieldset>
    </Card>
  );
}

interface CapOption {
  value: string;
  label: string;
  enabled: boolean;
  reason?: string;
}

function CapabilitySelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: CapOption[];
  onChange: (v: string) => void;
}) {
  const cur = options.find((o) => o.value === value);
  const showReason = cur && !cur.enabled && cur.reason;
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-cream-200/70">{label}</label>
      <select
        value={value}
        onChange={(e) => {
          const next = options.find((o) => o.value === e.target.value);
          if (!next || !next.enabled) return;
          onChange(e.target.value);
        }}
        className="h-11 w-full min-w-0 max-w-full truncate appearance-none rounded-xl border border-ink-600/70 bg-ink-800/70 px-4 pr-10 text-sm text-cream-50 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={!o.enabled} className="bg-ink-900 text-cream-50">
            {o.label}
            {!o.enabled ? ' — unavailable' : ''}
          </option>
        ))}
      </select>
      {showReason && (
        <div className="flex items-start gap-1.5 rounded-lg border border-gold-500/20 bg-gold-500/5 p-2 text-[11px] text-gold-200/85">
          <Icon name="feather" size={11} className="mt-0.5" />
          {cur?.reason}
        </div>
      )}
    </div>
  );
}

function SourceStatus({
  loading,
  provider,
}: {
  loading: boolean;
  provider: 'foundation' | 'alquran-cloud' | 'none' | null;
}) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-600/60 bg-ink-850/60 px-3 py-1 text-[10px] uppercase tracking-wider text-cream-200/55">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400/70" />
        Checking source…
      </span>
    );
  }
  const label =
    provider === 'foundation'
      ? 'Quran.Foundation'
      : provider === 'alquran-cloud'
        ? 'AlQuran Cloud'
        : 'No source';
  const ok = provider === 'foundation' || provider === 'alquran-cloud';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] uppercase tracking-wider ${
        ok
          ? 'border-gold-500/30 bg-gold-500/5 text-gold-200/90'
          : 'border-ink-600/60 bg-ink-850/60 text-cream-200/55'
      }`}
      title="Capabilities are detected live from the active content source"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? 'bg-gold-400' : 'bg-cream-200/40'}`} />
      {label}
    </span>
  );
}
