import type { ReactNode } from 'react';
import { Card } from './Card';

interface ProseProps {
  children: ReactNode;
}

/** Styled wrapper for long-form static text in info/legal pages. */
export function Prose({ children }: ProseProps) {
  return (
    <Card variant="elevated" className="prose-base p-8">
      <div className="flex flex-col gap-5 text-sm leading-relaxed text-cream-100/85 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-cream-50 [&_h3]:font-medium [&_h3]:text-cream-100 [&_p]:leading-relaxed [&_a]:text-gold-300 [&_a]:hover:text-gold-200 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 [&_strong]:text-cream-50">
        {children}
      </div>
    </Card>
  );
}
