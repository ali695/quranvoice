'use client';

import { useAudioPlayer } from '@/components/audio/AudioPlayerProvider';
import { Icon } from '@/components/ui/Icon';

interface DuaPlayButtonProps {
  surah: number;
  from: number;
  to?: number;
  label: string;
  size?: 'sm' | 'md';
}

/** Recites exactly the dua's ayahs (then stops), with the live word pointer. */
export function DuaPlayButton({ surah, from, to, label, size = 'md' }: DuaPlayButtonProps) {
  const { now, isPlaying, isLoading, playRange, toggle } = useAudioPlayer();
  const last = to ?? from;
  const active = now?.surah === surah && now.ayah !== undefined && now.ayah >= from && now.ayah <= last;
  const playing = active && isPlaying;

  const onClick = () => {
    if (active) toggle();
    else playRange(surah, from, last, label);
  };

  const cls =
    size === 'sm'
      ? 'h-8 gap-1.5 px-3 text-xs'
      : 'h-10 gap-2 px-4 text-sm';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full bg-gold-500 font-medium text-ink-950 shadow-[0_4px_12px_-2px_rgba(212,165,116,0.45)] transition-colors hover:bg-gold-400 disabled:opacity-60 ${cls}`}
      aria-label={playing ? `Pause ${label}` : `Listen to ${label}`}
      disabled={active && isLoading}
    >
      <Icon name={playing ? 'pause' : 'play'} size={size === 'sm' ? 12 : 14} />
      {playing ? 'Pause' : 'Listen'}
    </button>
  );
}
