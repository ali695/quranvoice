'use client';

import { useTheme } from './ThemeProvider';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';
import type { ThemePref } from '@/lib/theme/theme';

/**
 * Single icon button that flips Dark Gold ↔ White Gold — for the header
 * ("daylight" quick toggle). Shows a sun in dark mode (tap for light) and a
 * moon in light mode (tap for dark).
 */
export function ThemeButton() {
  const { resolved, setTheme } = useTheme();
  const next = resolved === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={resolved === 'dark' ? 'Switch to White Gold (light)' : 'Switch to Dark Gold'}
      title={resolved === 'dark' ? 'Light theme' : 'Dark theme'}
      className="flex h-10 w-10 items-center justify-center rounded-lg text-cream-100/80 transition-colors hover:bg-ink-800/70 hover:text-gold-300"
    >
      <Icon name={resolved === 'dark' ? 'sun' : 'moon'} size={18} />
    </button>
  );
}

const OPTIONS: Array<{ value: ThemePref; label: string; icon: 'moon' | 'sun' | 'compass' }> = [
  { value: 'dark', label: 'Dark Gold', icon: 'moon' },
  { value: 'light', label: 'White Gold', icon: 'sun' },
  { value: 'system', label: 'System', icon: 'compass' },
];

/** Segmented theme switcher: Dark Gold · White Gold · System. */
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { pref, setTheme } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex items-center gap-1 rounded-xl border border-ink-600/70 bg-ink-800/60 p-1"
    >
      {OPTIONS.map((o) => {
        const active = pref === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(o.value)}
            title={o.label}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
              active
                ? 'bg-gold-500 text-ink-950'
                : 'text-cream-200/75 hover:bg-ink-700/60 hover:text-gold-300',
            )}
          >
            <Icon name={o.icon} size={14} />
            {!compact && <span>{o.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
