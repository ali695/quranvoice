'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import {
  addToMemorization,
  isMemorized,
  recordReview,
  removeFromMemorization,
} from '@/lib/services/memorizationService';

interface MemorizationControlsProps {
  surah: number;
  ayah: number;
}

export function MemorizationControls({ surah, ayah }: MemorizationControlsProps) {
  const [memorized, setMemorized] = useState(false);

  useEffect(() => {
    setMemorized(isMemorized(surah, ayah));
  }, [surah, ayah]);

  const onAdd = () => {
    addToMemorization(surah, ayah);
    setMemorized(true);
  };

  const onRemove = () => {
    removeFromMemorization(surah, ayah);
    setMemorized(false);
  };

  return (
    <div className="rounded-2xl border border-ink-600/50 bg-ink-800/40 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-gold-400/80">Hifz</div>
          <h3 className="mt-1 font-display text-base font-medium text-cream-50">
            Memorization
          </h3>
          <p className="mt-1 text-xs text-cream-200/65">
            Track this verse in your review schedule.
          </p>
        </div>
        {memorized ? (
          <Button size="sm" variant="ghost" onClick={onRemove}>
            <Icon name="close" size={14} />
            Remove
          </Button>
        ) : (
          <Button size="sm" onClick={onAdd}>
            <Icon name="plus" size={14} />
            Add to Hifz
          </Button>
        )}
      </div>
      {memorized && (
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => recordReview(surah, ayah, 0.95)}
            className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-300 hover:bg-emerald-500/15"
          >
            Solid
          </button>
          <button
            type="button"
            onClick={() => recordReview(surah, ayah, 0.65)}
            className="rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-gold-300 hover:bg-gold-500/15"
          >
            Okay
          </button>
          <button
            type="button"
            onClick={() => recordReview(surah, ayah, 0.3)}
            className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-red-300 hover:bg-red-500/15"
          >
            Needs work
          </button>
        </div>
      )}
    </div>
  );
}
