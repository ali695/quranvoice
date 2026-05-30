import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Prose } from '@/components/ui/Prose';

export const metadata: Metadata = {
  title: 'Accessibility',
  description: 'QuranVoice accessibility statement.',
};

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Accessibility"
        description="Commitments and known issues."
      />
      <AppShell>
        <Prose>
          <h2>Our commitment</h2>
          <p>
            QuranVoice is built to be accessible to as many people as possible. We test for
            keyboard navigation, focus order, color contrast, and screen-reader compatibility.
            We aim to meet WCAG 2.1 AA across the reader experience.
          </p>

          <h2>Features</h2>
          <ul>
            <li>Skip-to-content link at the top of every page</li>
            <li>Visible focus rings on all interactive elements</li>
            <li>Adjustable Arabic and translation font sizes from Settings</li>
            <li>Semantic HTML landmarks for header, main, and footer</li>
            <li>RTL-correct rendering for Arabic with proper <code>lang</code> attributes</li>
          </ul>

          <h2>Report an issue</h2>
          <p>
            If you encounter an accessibility issue, please write to us via the{' '}
            <a href="/feedback">Feedback</a> page so we can fix it.
          </p>
        </Prose>
      </AppShell>
    </>
  );
}
