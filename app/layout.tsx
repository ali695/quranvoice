import type { Metadata, Viewport } from 'next';
import { Inter, Cormorant_Garamond, Amiri } from 'next/font/google';
import './globals.css';
import { AudioPlayerProvider } from '@/components/audio/AudioPlayerProvider';
import { MiniAudioPlayer } from '@/components/audio/MiniAudioPlayer';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SuppressExtensionWarnings } from '@/components/layout/SuppressExtensionWarnings';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://quranvoice.app';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'QuranVoice — Read, Listen, and Study the Noble Quran',
    template: '%s · QuranVoice',
  },
  description:
    'A modern Quran platform for recitation, tafsir, translations, memorization, notes, bookmarks, and daily reflection. Built for serious study with verified sources.',
  keywords: [
    'Quran',
    'Quran online',
    'Quran reader',
    'Quran audio',
    'Tafsir',
    'Translations',
    'Surahs',
    'Memorization',
    'Hifz',
    'Islamic learning',
  ],
  authors: [{ name: 'QuranVoice' }],
  openGraph: {
    type: 'website',
    title: 'QuranVoice — Read, Listen, and Study the Noble Quran',
    description:
      'A modern Quran platform for recitation, tafsir, translations, memorization, notes, bookmarks, and daily reflection.',
    siteName: 'QuranVoice',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuranVoice',
    description:
      'Read, Listen, and Study the Noble Quran with translations, tafsir, and memorization tools.',
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#0a0e1a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${amiri.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-ink-900 text-cream-100 antialiased"
        // Browser extensions (e.g. Bitdefender TrafficLight, Grammarly,
        // 1Password) inject attributes like `bis_skin_checked`, `bis_register`
        // and `__processed_…` into <body> and child elements. React would
        // otherwise log a hydration mismatch warning on every navigation —
        // we suppress at the body level so the dev console stays clean.
        suppressHydrationWarning
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink-950"
        >
          Skip to main content
        </a>
        <SuppressExtensionWarnings />
        <AudioPlayerProvider>
          <Header />
          <main id="main" className="relative pb-24">
            {children}
          </main>
          <Footer />
          <MiniAudioPlayer />
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
