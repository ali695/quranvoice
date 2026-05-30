import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { FOOTER_LINKS } from '@/lib/data/footerLinks';

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'All public QuranVoice pages.',
};

const SECTIONS: Array<{ title: string; key: keyof typeof FOOTER_LINKS }> = [
  { title: 'Navigate', key: 'navigate' },
  { title: 'Quran', key: 'quran' },
  { title: 'Study', key: 'study' },
  { title: 'Learn', key: 'learn' },
  { title: 'Tools', key: 'tools' },
  { title: 'Account & Support', key: 'account' },
  { title: 'Legal & Developers', key: 'legal' },
];

export default function SitemapPage() {
  return (
    <>
      <PageHeader
        eyebrow="Index"
        title="Sitemap"
        description="An index of every public page in QuranVoice."
      />
      <AppShell>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((sec) => (
            <Card key={sec.key} as="li" variant="elevated" className="p-5">
              <h2 className="text-xs uppercase tracking-[0.16em] text-gold-400/90">{sec.title}</h2>
              <ul className="mt-3 flex flex-col gap-1.5">
                {FOOTER_LINKS[sec.key].map((link) => (
                  <li key={link.label + link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream-200/70 hover:text-gold-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </ul>
      </AppShell>
    </>
  );
}
