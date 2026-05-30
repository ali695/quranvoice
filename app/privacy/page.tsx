import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Prose } from '@/components/ui/Prose';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How QuranVoice handles your data — Quran.Foundation content sourcing, Supabase user data, no third-party trackers.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated: 2026-05-31. QuranVoice is designed to be private by default."
      />
      <AppShell>
        <Prose>
          <h2>Summary</h2>
          <p>
            QuranVoice is built so that you can read, listen to, and study the
            Quran without being tracked. Bookmarks, notes, settings, and reading
            progress live on your device for guest users; for signed-in users they
            sync to your Supabase row only. We do not run advertising or
            behavioral tracking, and we never sell personal data.
          </p>

          <h2>1. What data we collect</h2>
          <p>
            QuranVoice collects only what it needs to operate the service for you.
            We group it as follows:
          </p>
          <ul>
            <li>
              <strong>Account data</strong> (only if you sign up): your email
              address, optional display name, and the OAuth provider you signed in
              with — all stored by Supabase Auth.
            </li>
            <li>
              <strong>Study data</strong>: bookmarks, collections, notes, reading
              progress (last-read ayah, daily activity, streak), memorization
              items and review schedule, reading goals, and saved app/translation/
              tafsir settings.
            </li>
            <li>
              <strong>Operational logs</strong>: standard web access logs (IP
              address, user agent, request path, response status) needed to debug
              and protect the service. We keep these only as long as necessary
              for security and rate-limiting.
            </li>
          </ul>
          <p>
            We do not request location data unless you explicitly tap “Use my
            location” inside the Qibla or Prayer Times tools. Even then, your
            coordinates are sent to the upstream computational provider (Aladhan
            for prayer times) and are not stored on our servers.
          </p>

          <h2>2. Where the data lives</h2>
          <ul>
            <li>
              <strong>Guest users (no sign-in):</strong> all study data lives in
              your browser’s <code>localStorage</code>. We never see it. If you
              clear browser data, it’s gone.
            </li>
            <li>
              <strong>Signed-in users:</strong> data is stored in our Supabase
              project (PostgreSQL) under your user row, protected by Row-Level
              Security so only you (and an administrator with the service-role
              key) can read it.
            </li>
          </ul>

          <h2>3. Quranic content sourcing</h2>
          <p>
            When you open a surah, ayah, translation, tafsir, or recitation,
            QuranVoice fetches that content from upstream Quran data providers —
            primarily the <strong>Quran.Foundation Content API</strong>, with the
            open AlQuran Cloud provider as a fallback. Audio is streamed from
            third-party CDNs (Quran.Foundation, Islamic.Network).
          </p>
          <p>
            We do <strong>not</strong> send your study data, bookmarks, notes, or
            account identifiers to those providers. We send only the verse,
            surah, page, juz, translation ID, tafsir ID, or recitation ID needed
            to fulfil the request, plus the standard HTTP headers any browser
            would send.
          </p>

          <h2>4. Religious-study data is sensitive</h2>
          <p>
            What a person reads, bookmarks, notes, or memorizes from the Quran is
            personal and can be sensitive. QuranVoice treats this data with extra
            care:
          </p>
          <ul>
            <li>Notes are <strong>private by default</strong> — never shared automatically.</li>
            <li>Bookmarks and reading progress are <strong>not</strong> exposed via any public profile.</li>
            <li>Supabase Row-Level Security is enforced for every user table.</li>
            <li>We never sell or share study data with advertisers.</li>
          </ul>

          <h2>5. Cookies</h2>
          <p>
            QuranVoice uses cookies only for core functionality:
          </p>
          <ul>
            <li>A Supabase session cookie when you sign in (HttpOnly, secure, SameSite=Lax).</li>
            <li>A small preferences cookie (locale, theme) so the app remembers your settings between visits.</li>
          </ul>
          <p>
            We do not set advertising cookies and we do not embed third-party
            tracking pixels.
          </p>

          <h2>6. Third parties &amp; sub-processors</h2>
          <ul>
            <li><strong>Quran.Foundation</strong> — Quran text, translations, tafsir, recitations, search.</li>
            <li><strong>AlQuran Cloud / Islamic.Network</strong> — fallback Quran text and audio streaming.</li>
            <li><strong>Aladhan API</strong> — prayer times and Hijri date conversion.</li>
            <li><strong>Archive.org</strong> — public metadata for the Shan-e-Nuzool source reference.</li>
            <li><strong>Supabase</strong> — authentication and database hosting.</li>
            <li><strong>Vercel</strong> (where applicable) — application hosting and edge caching.</li>
          </ul>

          <h2>7. Your rights</h2>
          <p>
            You can at any time:
          </p>
          <ul>
            <li>
              <strong>Export</strong> your bookmarks and notes from the
              <a href="/settings"> Settings</a> page.
            </li>
            <li>
              <strong>Delete</strong> all local data (the Settings page also clears
              localStorage on this device).
            </li>
            <li>
              <strong>Request account &amp; data deletion</strong> by contacting us at
              <a href="/contact"> /contact</a>. Once verified, we delete your
              Supabase row and any related study data within 30 days.
            </li>
          </ul>

          <h2 id="cookies">8. Cookie reference</h2>
          <p>
            See section 5 for the full list. We do not track you across other
            websites and we do not participate in cross-site advertising
            programs.
          </p>

          <h2>9. Children</h2>
          <p>
            QuranVoice does not knowingly collect personal data from children
            under the age of 13. If you believe a child has provided personal
            data, contact us and we will delete it.
          </p>

          <h2>10. International users</h2>
          <p>
            QuranVoice is available worldwide. Data may be processed in any
            country where our sub-processors (notably Supabase and Vercel) operate
            their infrastructure. By using the service you consent to that
            processing.
          </p>

          <h2>11. Changes to this policy</h2>
          <p>
            When we make material changes, we will update the “Last updated” date
            and, where appropriate, notify signed-in users by email.
          </p>

          <h2>12. Contact</h2>
          <p>
            Privacy questions? Reach us via the
            <a href="/contact"> Contact</a> page.
          </p>
        </Prose>
      </AppShell>
    </>
  );
}
