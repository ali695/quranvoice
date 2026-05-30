import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
  /** When true, render as a circle */
  circle?: boolean;
}

export function Skeleton({ className, circle = false }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden bg-ink-700/60',
        circle ? 'rounded-full' : 'rounded-lg',
        className,
      )}
    >
      <span
        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-ink-600/80 to-transparent"
        style={{ backgroundSize: '200% 100%' }}
      />
    </div>
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3', i === lines - 1 && 'w-2/3')}
        />
      ))}
    </div>
  );
}
