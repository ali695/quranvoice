import Link from 'next/link';
import { Card } from '@/components/ui/Card';

const TOTAL_PAGES = 604;

interface PageNavigatorProps {
  highlightPage?: number;
}

export function PageNavigator({ highlightPage }: PageNavigatorProps) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-10 lg:grid-cols-12">
      {Array.from({ length: TOTAL_PAGES }).map((_, i) => {
        const n = i + 1;
        const active = highlightPage === n;
        return (
          <Card
            key={n}
            as="div"
            variant={active ? 'feature' : 'default'}
            className={`text-center transition-all ${active ? 'border-gold-500/50' : ''}`}
          >
            <Link
              href={`/pages/${n}`}
              className="block px-2 py-2.5 text-sm font-medium text-cream-100 hover:text-gold-200"
            >
              {n}
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
