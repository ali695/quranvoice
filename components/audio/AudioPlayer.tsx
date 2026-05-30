'use client';

import { useState } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Icon } from '@/components/ui/Icon';
import { Select } from '@/components/ui/Select';
import { useAudioPlayer } from './AudioPlayerProvider';
import { RepeatControls } from './RepeatControls';
import { ReciterSelector } from './ReciterSelector';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

const SPEEDS = [
  { value: '0.75', label: '0.75×' },
  { value: '1', label: '1.0×' },
  { value: '1.25', label: '1.25×' },
  { value: '1.5', label: '1.5×' },
  { value: '2', label: '2.0×' },
];

interface AudioPlayerProps {
  open: boolean;
  onClose: () => void;
}

export function AudioPlayer({ open, onClose }: AudioPlayerProps) {
  const {
    now,
    isPlaying,
    currentTime,
    duration,
    toggle,
    seek,
    playbackSpeed,
    setPlaybackSpeed,
  } = useAudioPlayer();
  const [volume, setVolume] = useState(1);

  const pct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="right"
      title="Audio player"
      description="Reciter, speed, repeat, and seek."
      width="440px"
    >
      <div className="flex flex-col gap-6">
        {/* Now playing */}
        <section className="rounded-2xl border border-ink-700/60 bg-ink-850/60 p-5">
          <div className="text-xs uppercase tracking-wider text-gold-400/80">Now playing</div>
          {now ? (
            <>
              <h3 className="mt-2 font-display text-lg font-medium text-cream-50">{now.surahLabel}</h3>
              <p className="text-xs text-cream-200/65">{now.reciterName ?? now.reciterId}</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-cream-200/65">No surah loaded.</p>
          )}

          <div className="mt-5">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="h-1.5 w-full appearance-none rounded-full accent-gold-500"
              style={{
                background: `linear-gradient(90deg, rgb(var(--color-gold)) 0%, rgb(var(--color-gold)) ${pct}%, #1c2238 ${pct}%, #1c2238 100%)`,
              }}
              aria-label="Seek"
            />
            <div className="mt-1 flex justify-between text-[11px] tabular-nums text-cream-200/55">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-cream-100 hover:bg-ink-700/60"
              aria-label="Previous"
            >
              <Icon name="arrow-left" size={16} />
            </button>
            <button
              type="button"
              onClick={toggle}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-ink-950 shadow-[0_4px_12px_-2px_rgba(212,165,116,0.5)] hover:bg-gold-400"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <Icon name={isPlaying ? 'pause' : 'play'} size={18} />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-cream-100 hover:bg-ink-700/60"
              aria-label="Next"
            >
              <Icon name="arrow-right" size={16} />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Icon name="volume" size={14} className="text-cream-200/55" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => {
                const v = Number(e.target.value);
                setVolume(v);
                const el = document.querySelector('audio');
                if (el) el.volume = v;
              }}
              className="h-1 flex-1 appearance-none rounded-full bg-ink-700 accent-gold-500"
              aria-label="Volume"
            />
          </div>
        </section>

        <ReciterSelector />

        <Select
          label="Playback speed"
          value={String(playbackSpeed)}
          onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
          options={SPEEDS}
        />

        <RepeatControls />
      </div>
    </Drawer>
  );
}
