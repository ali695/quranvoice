import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Prose } from '@/components/ui/Prose';

export const metadata: Metadata = {
  title: 'About QuranVoice',
  description: 'About QuranVoice: mission, content authenticity, and how we work.',
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="About QuranVoice"
        description="A modern Quran platform built with care and respect."
      />
      <AppShell>
        <Prose>
          <h2>Mission</h2>
          <p>
            QuranVoice is an independent Quran reading platform. Our mission is to help
            people read the Noble Quran, listen to recitations, and study with verified
            translations and tafsir — without noise, ads, or compromise on authenticity.
          </p>

          <h2>Content authenticity</h2>
          <p>
            We do not invent religious content. Every translation, tafsir, recitation, and
            Asbab al-Nuzul entry must originate from a registered, verified resource. When a
            verified source is not connected, we show a clearly marked unavailable state
            instead of generating placeholder content.
          </p>

          <h2 id="apps">Mobile apps</h2>
          <p>
            Native mobile apps are on our roadmap. For now, QuranVoice runs as a fast,
            installable web app that works on every device.
          </p>

          <h2 id="accessibility">Accessibility</h2>
          <p>
            Accessibility is a first-class concern. The reader supports keyboard
            navigation, semantic HTML landmarks, high-contrast text, and adjustable
            font sizes. If you encounter an accessibility issue, please reach out via{' '}
            <a href="/feedback">Feedback</a>.
          </p>

          <h2 id="help">Help</h2>
          <p>
            Visit the <a href="/help">Help Center</a> for common questions, or send us a
            note from the <a href="/contact">Contact</a> page.
          </p>
        </Prose>
      </AppShell>
    </>
  );
}
