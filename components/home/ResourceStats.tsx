import { Icon, type IconName } from '@/components/ui/Icon';
import { getResourcesSummary } from '@/lib/services/resource-registry.service';

interface StatCard {
  icon: IconName;
  label: string;
  value: string;
  hint?: string;
}

export async function ResourceStats() {
  const s = await getResourcesSummary();
  const items: StatCard[] = [
    { icon: 'book', label: 'Surahs', value: String(s.counts.chapters) },
    {
      icon: 'globe',
      label: 'Translations',
      value: s.counts.translations ? String(s.counts.translations) : '—',
      hint: s.health.foundationConfigured ? 'via Quran.Foundation' : 'add Foundation creds to enable',
    },
    {
      icon: 'feather',
      label: 'Tafsir resources',
      value: s.counts.tafsirs ? String(s.counts.tafsirs) : '—',
      hint: s.health.foundationConfigured ? 'via Quran.Foundation' : 'awaiting verified source',
    },
    {
      icon: 'volume',
      label: 'Reciters',
      value: s.counts.recitations ? String(s.counts.recitations) : '—',
      hint: 'verified catalog',
    },
  ];

  return (
    <section className="container-page py-6" aria-label="Content sources">
      <div className="overflow-hidden rounded-2xl border border-ink-600/50 bg-ink-800/40">
        <ul className="grid grid-cols-2 divide-x divide-y divide-ink-700/50 sm:grid-cols-4 sm:divide-y-0">
          {items.map((it) => (
            <li key={it.label} className="flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-300">
                <Icon name={it.icon} size={18} />
              </span>
              <div>
                <p className="font-display text-xl font-medium text-cream-50">{it.value}</p>
                <p className="text-xs text-cream-200/55">
                  {it.label}
                  {it.hint ? ` · ${it.hint}` : ''}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
