'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { loadSettings, updateSettings } from '@/lib/services/settingsService';
import type { AppearanceSettings as AS } from '@/lib/types/settings';

export function AppearanceSettings() {
  const [s, setS] = useState<AS | null>(null);
  useEffect(() => setS(loadSettings().appearance), []);
  if (!s) return null;
  const patch = (p: Partial<AS>) => {
    const next = updateSettings('appearance', p);
    setS(next.appearance);
  };
  return (
    <Card variant="elevated" className="p-6">
      <h2 className="font-display text-lg font-medium text-cream-50">Appearance</h2>
      <p className="mt-1 text-sm text-cream-200/65">
        Choose your theme. The gold accent stays consistent across both themes.
      </p>

      <div className="mt-5">
        <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-cream-200/70">
          Theme
        </span>
        <ThemeToggle />
        <p className="mt-2 text-xs text-cream-200/55">
          Dark Gold is the default. White Gold is a premium light theme with strong, readable
          contrast. System follows your device setting. Your choice is saved on this device.
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Select
          label="Density"
          value={s.density}
          options={[
            { value: 'comfortable', label: 'Comfortable' },
            { value: 'compact', label: 'Compact' },
          ]}
          onChange={(e) => patch({ density: e.target.value as AS['density'] })}
        />
      </div>
    </Card>
  );
}
