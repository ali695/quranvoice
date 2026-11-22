import type { Metadata } from 'next';
import { MushafLanding } from '@/components/quran/MushafLanding';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { getCurrentLocale } from '@/lib/i18n/server';
import { isFoundationConfigured } from '@/lib/quran-foundation/env';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return generateLocalizedMetadata({
    locale,
    path: '/uthmani-quran',
    titleKey: 'meta.uthmani.title',
    descriptionKey: 'meta.uthmani.description',
  });
}

export default function UthmaniPage() {
  const ok = isFoundationConfigured();
  return (
    <MushafLanding
      eyebrow="Mushaf style"
      title="The Uthmani Quran, served from a verified source"
      highlight="Uthmani"
      description="Read the Quran in the Uthmani script, preserved exactly as published — no edits, no re-typing."
      status={ok ? 'available' : 'preview'}
      sourceRequirement={
        ok
          ? 'The Uthmani text comes from a verified published source and is never modified.'
          : 'The Uthmani text comes from the open Tanzil dataset and is never modified.'
      }
      sourceCredit="Full source credits are listed on the Sources page."
      primaryCta={{ label: 'Open the reader', href: '/quran' }}
      secondaryCta={{ label: 'Browse all 114 surahs', href: '/surahs' }}
      pattern="star"
      features={[
        { icon: 'check', title: 'Source-verified text', body: 'Uthmani text comes from the registered provider — never AI-generated, never edited.' },
        { icon: 'book', title: 'Full mushaf coverage', body: 'All 114 surahs, every juz, every page. Direct links like /quran/2/255 work everywhere.' },
        { icon: 'sparkle', title: 'Premium typography', body: 'Amiri / Scheherazade / Noto Naskh — choose your Arabic font in Settings.' },
        { icon: 'globe', title: 'Translation pairing', body: 'Pair the Uthmani text with any registered translation, in any UI language.' },
        { icon: 'volume', title: 'Audio support', body: 'Surah audio plays from verified reciter sources. Per-ayah timestamps activate when published.' },
        { icon: 'bookmark', title: 'Bookmarks & notes', body: 'Save verses, write private reflections — synced to your account when signed in.' },
      ]}
    />
  );
}
