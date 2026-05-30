import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, hint, error, id, ...rest },
  ref,
) {
  const inputId = id || rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium uppercase tracking-wider text-cream-200/70">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'h-11 rounded-xl border border-ink-600/70 bg-ink-800/70 px-4 text-sm text-cream-50 placeholder:text-cream-200/40',
          'transition-colors focus:border-gold-500/50 focus:bg-ink-800 focus:outline-none focus:ring-2 focus:ring-gold-500/20',
          error && 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/20',
          className,
        )}
        {...rest}
      />
      {hint && !error && <p className="text-xs text-cream-200/55">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
});
