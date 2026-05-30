'use client';

import { Icon } from '@/components/ui/Icon';
import { useAudioPlayer } from './AudioPlayerProvider';
import type { RepeatMode } from '@/lib/types/audio';
import { cn } from '@/lib/utils/cn';

const MODES: Array<{ value: RepeatMode; label: string }> = [
  { value: 'off', label: 'Off' },
  { value: 'ayah', label: 'Ayah' },
  { value: 'range', label: 'Range' },
  { value: 'surah', label: 'Surah' },
];

export function RepeatControls() {
  const { repeatMode, setRepeatMode } = useAudioPlayer();
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-cream-200/70">
        Repeat
      </span>
      <div className="inline-flex rounded-xl border border-ink-600/70 bg-ink-800/60 p-1">
        {MODES.map((m) => {
          const active = repeatMode === m.value;
          return (
            <button
              key={m.value}
              type="button"
              onClick={() => setRepeatMode(m.value)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                active
                  ? 'bg-gold-500/15 text-gold-200'
                  : 'text-cream-200/70 hover:bg-ink-700/50 hover:text-cream-100',
              )}
            >
              {m.label}
            </button>
          );
        })}
      </div>
      <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-cream-200/55">
        <Icon name="check" size={11} className="mt-0.5 text-gold-400" />
        Range and ayah-level repeat require ayah-audio timestamps, which activate when verified
        timing data is connected.
      </p>
    </div>
  );
}
