'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { isBookmarked, toggleBookmark } from '@/lib/services/bookmarkService';
import { cn } from '@/lib/utils/cn';

interface BookmarkButtonProps {
  surah: number;
  ayah: number;
  className?: string;
}

export function BookmarkButton({ surah, ayah, className }: BookmarkButtonProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isBookmarked(surah, ayah));
  }, [surah, ayah]);

  const onClick = () => {
    const res = toggleBookmark({ surah, ayah, verseKey: `${surah}:${ayah}` });
    setActive(!!res);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? 'Remove bookmark' : 'Bookmark this ayah'}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
        active ? 'bg-gold-500/15 text-gold-300' : 'text-cream-200/65 hover:bg-ink-700/60 hover:text-gold-300',
        className,
      )}
    >
      <Icon name="bookmark" size={16} />
    </button>
  );
}
