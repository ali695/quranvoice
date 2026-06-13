'use client';

import { useRouter } from 'next/navigation';
import { useAudioPlayer } from '@/components/audio/AudioPlayerProvider';
import { Icon } from '@/components/ui/Icon';
import type { ResolvedQuery } from '@/lib/search/search-router';

/**
 * Prominent "jump to" card for a resolved navigation query. Open navigates to
 * the locale-aware target; Listen plays the exact ayah (or surah from start),
 * never confusing the two.
 */
export function QuickJump({ resolved }: { resolved: ResolvedQuery }) {
  const router = useRouter();
  const { playAyah, playSurah } = useAudioPlayer();

  const open = () => router.push(resolved.localizedUrl || resolved.targetUrl);

  const canListen = resolved.type === 'ayah' || resolved.type === 'surah';
  const listen = () => {
    if (resolved.type === 'ayah' && resolved.surahNumber && resolved.ayahNumber) {
      playAyah(resolved.surahNumber, resolved.ayahNumber, resolved.label);
    } else if (resolved.type === 'surah' && resolved.surahNumber) {
      playSurah(resolved.surahNumber, resolved.label);
    }
  };

  const typeLabel =
    resolved.type === 'ayah'
      ? 'Ayah'
      : resolved.type === 'surah'
        ? 'Surah'
        : resolved.type === 'juz'
          ? 'Juz'
          : 'Page';

  return (
    <div className="mb-6 rounded-2xl border border-gold-500/40 bg-gradient-to-br from-gold-500/10 via-ink-800/60 to-ink-800/60 p-5 shadow-gold-glow">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gold-300/90">
            <Icon name="compass" size={12} />
            Jump to {typeLabel}
          </div>
          <p className="mt-1 font-display text-lg text-cream-50">
            {resolved.label}
            {resolved.arabicName && (
              <span className="arabic ml-2 text-xl text-gold-200" dir="rtl" lang="ar">
                {resolved.arabicName}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canListen && (
            <button
              type="button"
              onClick={listen}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-gold-500/40 px-4 text-sm font-medium text-gold-200 hover:bg-gold-500/10"
            >
              <Icon name="play" size={14} />
              Listen
            </button>
          )}
          <button
            type="button"
            onClick={open}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-gold-500 px-4 text-sm font-medium text-ink-950 hover:bg-gold-400"
          >
            <Icon name="book" size={14} />
            Open
          </button>
        </div>
      </div>
    </div>
  );
}
