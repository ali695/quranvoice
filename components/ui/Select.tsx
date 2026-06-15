import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  options: Option[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, label, hint, options, id, ...rest },
  ref,
) {
  const selectId = id || rest.name;
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-medium uppercase tracking-wider text-cream-200/70">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'h-11 w-full min-w-0 max-w-full truncate appearance-none rounded-xl border border-ink-600/70 bg-ink-800/70 px-4 pr-10 text-sm text-cream-50',
          'transition-colors focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20',
          'bg-[url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12 8%22 fill=%22none%22 stroke=%22%23d4a574%22 stroke-width=%221.5%22><polyline points=%221 1 6 6 11 1%22/></svg>")] bg-no-repeat bg-[right_1rem_center]',
          className,
        )}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-ink-900 text-cream-50">
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-xs text-cream-200/55">{hint}</p>}
    </div>
  );
});
