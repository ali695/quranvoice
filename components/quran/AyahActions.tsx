'use client';

import { useState } from 'react';
import { useAudioPlayer } from '@/components/audio/AudioPlayerProvider';
import { Icon } from '@/components/ui/Icon';
import { BookmarkButton } from '@/components/study/BookmarkButton';
import { NotesPanel } from '@/components/study/NotesPanel';
import { cn } from '@/lib/utils/cn';

interface AyahActionsProps {
  surah: number;
  ayah: number;
  arabic: string;
  surahLabel: string;
}

export function AyahActions({ surah, ayah, arabic, surahLabel }: AyahActionsProps) {
  const { playSurah, isPlaying, now, toggle } = useAudioPlayer();
  const [notesOpen, setNotesOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isCurrent = now?.surah === surah && now?.ayah === ayah;

  const onPlay = () => {
    if (isCurrent) {
      toggle();
    } else {
      playSurah(surah, surahLabel, ayah);
    }
  };

  const onCopy = async () => {
    const text = `${arabic}\n— Quran ${surah}:${ayah}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const onShare = async () => {
    const url = `${window.location.origin}/quran/${surah}/${ayah}`;
    const sharedText = `Quran ${surah}:${ayah} — read on QuranVoice`;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'QuranVoice', text: sharedText, url });
      } catch {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={onPlay}
          aria-label={isCurrent && isPlaying ? 'Pause this ayah' : 'Play this ayah'}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
            isCurrent && isPlaying
              ? 'bg-gold-500 text-ink-950'
              : 'text-cream-200/65 hover:bg-ink-700/60 hover:text-gold-300',
          )}
        >
          <Icon name={isCurrent && isPlaying ? 'pause' : 'play'} size={14} />
        </button>
        <BookmarkButton surah={surah} ayah={ayah} />
        <button
          type="button"
          onClick={() => setNotesOpen(true)}
          aria-label="Add a note"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-cream-200/65 transition-colors hover:bg-ink-700/60 hover:text-gold-300"
        >
          <Icon name="note" size={15} />
        </button>
        <button
          type="button"
          onClick={onCopy}
          aria-label="Copy ayah"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-cream-200/65 transition-colors hover:bg-ink-700/60 hover:text-gold-300"
        >
          <Icon name={copied ? 'check' : 'feather'} size={14} />
        </button>
        <button
          type="button"
          onClick={onShare}
          aria-label="Share ayah"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-cream-200/65 transition-colors hover:bg-ink-700/60 hover:text-gold-300"
        >
          <Icon name="share" size={14} />
        </button>
      </div>
      <NotesPanel surah={surah} ayah={ayah} open={notesOpen} onClose={() => setNotesOpen(false)} />
    </>
  );
}
