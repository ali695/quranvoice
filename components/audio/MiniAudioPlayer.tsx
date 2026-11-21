'use client';

import { Icon } from '@/components/ui/Icon';
import { useAudioPlayer } from './AudioPlayerProvider';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
}

export function MiniAudioPlayer() {
  const {
    now,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    toggle,
    seek,
    next,
    previous,
    syncedSurah,
    followAlong,
    setFollowAlong,
    notice,
  } = useAudioPlayer();
  if (!now) return null;

  const pct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const canStep = syncedSurah || now.ayah !== undefined;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-ink-600/60 bg-ink-900/95 backdrop-blur-lg">
      {!followAlong && now.verseKey && (
        <div className="pointer-events-none absolute -top-14 left-0 right-0 flex justify-center">
          <button
            type="button"
            onClick={() => setFollowAlong(true)}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-gold-500/50 bg-ink-900/95 px-4 py-2 text-sm text-gold-200 shadow-lg backdrop-blur hover:border-gold-400"
          >
            <Icon name="play" size={12} />
            Follow recitation · Ayah {now.ayah}
          </button>
        </div>
      )}
      <div className="container-page flex items-center gap-3 py-3 md:gap-4">
        {canStep && (
          <button
            type="button"
            onClick={previous}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-cream-200/70 hover:bg-ink-800 hover:text-cream-50 sm:flex"
            aria-label="Previous ayah"
          >
            <span aria-hidden="true">⏮</span>
          </button>
        )}
        <button
          onClick={toggle}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-500 text-ink-950 shadow-[0_4px_12px_-2px_rgba(212,165,116,0.5)] hover:bg-gold-400 disabled:opacity-50"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          disabled={isLoading}
        >
          <Icon name={isLoading ? 'sparkle' : isPlaying ? 'pause' : 'play'} size={16} />
        </button>
        {canStep && (
          <button
            type="button"
            onClick={next}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-cream-200/70 hover:bg-ink-800 hover:text-cream-50 sm:flex"
            aria-label="Next ayah"
          >
            <span aria-hidden="true">⏭</span>
          </button>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
            <span className="truncate font-medium text-cream-50">
              {now.surahLabel}
              {now.ayah ? <span className="text-gold-300"> · Ayah {now.ayah}</span> : null}
            </span>
            {now.reciterName && <span className="text-xs text-cream-200/55">· {now.reciterName}</span>}
            {syncedSurah && (
              <span
                className="rounded-full border border-gold-500/40 px-2 py-px text-[10px] uppercase tracking-wider text-gold-300"
                title="Ayah and word highlighting use the recording's real timestamps"
              >
                Live pointer
              </span>
            )}
          </div>
          {notice && <p className="mt-0.5 truncate text-[11px] text-cream-200/60">{notice}</p>}
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[10px] tabular-nums text-cream-200/50">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="h-1 flex-1 appearance-none rounded-full bg-ink-700 accent-gold-500"
              style={{
                background: `linear-gradient(90deg, rgb(var(--color-gold)) 0%, rgb(var(--color-gold)) ${pct}%, #1c2238 ${pct}%, #1c2238 100%)`,
              }}
              aria-label="Seek"
            />
            <span className="text-[10px] tabular-nums text-cream-200/50">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
