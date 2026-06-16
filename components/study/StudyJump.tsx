'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { parseAyahReference } from '@/lib/utils/parseAyahReference';

/** Jump straight into the in-depth study view for any ayah reference. */
export function StudyJump() {
  const [value, setValue] = useState('');
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseAyahReference(value.trim());
    if (parsed?.ayah) router.push(`/study/${parsed.surah}/${parsed.ayah}`);
    else if (parsed) router.push(`/study/${parsed.surah}/1`);
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <label htmlFor="study-jump" className="sr-only">
        Study an ayah (e.g. 2:255)
      </label>
      <div className="flex flex-1 items-center rounded-xl border border-ink-600/70 bg-ink-800/70 px-3">
        <Icon name="book" size={15} className="text-cream-200/55" />
        <input
          id="study-jump"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Study any ayah — e.g. 2:255"
          className="h-11 flex-1 bg-transparent px-2.5 text-sm text-cream-50 placeholder:text-cream-200/40 focus:outline-none"
        />
      </div>
      <Button type="submit" size="md">
        Study
        <Icon name="arrow-right" size={14} />
      </Button>
    </form>
  );
}
