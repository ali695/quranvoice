'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
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
        Theme and density. We use the same gold accent across themes.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Select
          label="Theme"
          value={s.theme}
          options={[
            { value: 'dark', label: 'Dark (recommended)' },
            { value: 'light', label: 'Light' },
          ]}
          onChange={(e) => patch({ theme: e.target.value as AS['theme'] })}
        />
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
      <p className="mt-4 text-xs text-cream-200/55">
        Light mode is being polished. The dark theme remains the recommended reading experience.
      </p>
    </Card>
  );
}
