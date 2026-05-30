'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { parseAyahReference } from '@/lib/utils/parseAyahReference';

interface JumpToAyahProps {
  /** Current surah, used to default the surah when user types an ayah-only number */
  currentSurah?: number;
  maxAyah?: number;
}

export function JumpToAyah({ currentSurah, maxAyah }: JumpToAyahProps) {
  const [value, setValue] = useState('');
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    const parsed = parseAyahReference(trimmed);
    if (parsed) {
      router.push(
        parsed.ayah ? `/quran/${parsed.surah}/${parsed.ayah}` : `/quran/${parsed.surah}`,
      );
      return;
    }
    // Try ayah-only (within current surah)
    const ayahOnly = Number(trimmed);
    if (currentSurah && Number.isInteger(ayahOnly) && ayahOnly >= 1 && (!maxAyah || ayahOnly <= maxAyah)) {
      router.push(`/quran/${currentSurah}/${ayahOnly}`);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <label htmlFor="jump-input" className="sr-only">
        Jump to ayah
      </label>
      <div className="flex items-center rounded-lg border border-ink-600/70 bg-ink-800/70 px-2.5">
        <Icon name="arrow-right" size={14} className="text-cream-200/55" />
        <input
          id="jump-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={currentSurah ? `Jump to ${currentSurah}:1` : '2:255'}
          className="h-9 w-32 bg-transparent px-2 text-sm text-cream-50 placeholder:text-cream-200/40 focus:outline-none"
        />
      </div>
      <Button type="submit" variant="secondary" size="sm">
        Go
      </Button>
    </form>
  );
}
