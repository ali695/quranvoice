import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RECOMMENDATIONS } from '@/lib/data/home';

export function RecommendedForYou() {
  return (
    <section className="container-page py-12 md:py-16">
      <SectionHeader
        eyebrow="Made for You"
        title="Recommended for You"
        description="Pick up where you left off or explore something new — these adapt as you use QuranVoice."
      />

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RECOMMENDATIONS.map((r) => (
          <Card key={r.id} as="li" variant="elevated" className="group flex flex-col gap-4 p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-300">
                <Icon name={r.icon} size={20} />
              </span>
              <div className="text-xs uppercase tracking-wider text-cream-200/45">
                {r.status}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-cream-50">
                {r.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cream-200/65">
                {r.description}
              </p>
            </div>
            <Link
              href={r.href}
              className="inline-flex items-center gap-2 self-start text-sm font-medium text-gold-300 transition-colors hover:text-gold-200"
            >
              {r.cta}
              <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Card>
        ))}
      </ul>
    </section>
  );
}
