import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { AudioSettings } from '@/components/settings/AudioSettings';
import { MemorizationSettings } from '@/components/settings/MemorizationSettings';
import { ReadingSettings } from '@/components/settings/ReadingSettings';
import { TafsirSettings } from '@/components/settings/TafsirSettings';
import { TranslationSettings } from '@/components/settings/TranslationSettings';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Reading, translation, tafsir, audio, memorization, and appearance settings.',
};

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Customize how QuranVoice looks, reads, and sounds."
      />
      <AppShell>
        <div className="flex flex-col gap-5">
          <ReadingSettings />
          <TranslationSettings />
          <TafsirSettings />
          <AudioSettings />
          <MemorizationSettings />
          <AppearanceSettings />
          <AccountSettings />
        </div>
      </AppShell>
    </>
  );
}
