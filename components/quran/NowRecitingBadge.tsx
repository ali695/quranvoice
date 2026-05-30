interface NowRecitingBadgeProps {
  label?: string;
}

/**
 * Tiny visual pill with animated audio bars shown on the currently-playing
 * ayah card. Pure CSS animation — no JS work per frame.
 */
export function NowRecitingBadge({ label }: NowRecitingBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-ink-900/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-gold-200 shadow-sm backdrop-blur">
      <span className="flex h-3 items-end gap-0.5" aria-hidden="true">
        <span className="inline-block w-0.5 rounded-sm bg-gold-300 animate-[reciting_0.9s_ease-in-out_infinite]" style={{ height: '40%', animationDelay: '0ms' }} />
        <span className="inline-block w-0.5 rounded-sm bg-gold-300 animate-[reciting_0.9s_ease-in-out_infinite]" style={{ height: '70%', animationDelay: '120ms' }} />
        <span className="inline-block w-0.5 rounded-sm bg-gold-300 animate-[reciting_0.9s_ease-in-out_infinite]" style={{ height: '55%', animationDelay: '240ms' }} />
        <span className="inline-block w-0.5 rounded-sm bg-gold-300 animate-[reciting_0.9s_ease-in-out_infinite]" style={{ height: '90%', animationDelay: '360ms' }} />
      </span>
      <span className="truncate max-w-[150px]">Now reciting{label ? ` · ${label}` : ''}</span>
    </span>
  );
}
