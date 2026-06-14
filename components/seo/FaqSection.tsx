import { JsonLd } from '@/components/seo/JsonLd';
import { faqSchema, type FaqItem } from '@/lib/seo/schema';

/**
 * Visible FAQ section + matching FAQPage schema. Keep answers factual about the
 * app — no religious claims. Visible content matches the JSON-LD (required by
 * Google for FAQ rich results).
 */
export function FaqSection({
  title = 'Frequently asked questions',
  items,
}: {
  title?: string;
  items: FaqItem[];
}) {
  if (!items.length) return null;
  return (
    <section className="container-page py-12 md:py-16">
      <JsonLd data={faqSchema(items)} />
      <h2 className="font-display text-2xl font-medium text-cream-50 sm:text-3xl">{title}</h2>
      <div className="mt-6 divide-y divide-ink-600/40 rounded-2xl border border-ink-600/50 bg-ink-800/40">
        {items.map((q) => (
          <details key={q.question} className="group p-5">
            <summary className="cursor-pointer list-none font-display text-base font-medium text-cream-50 marker:hidden">
              <span className="flex items-center justify-between gap-3">
                {q.question}
                <span className="text-gold-400 transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-cream-100/80">{q.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
