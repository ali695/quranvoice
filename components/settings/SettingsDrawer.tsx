'use client';

import { Drawer } from '@/components/ui/Drawer';
import { Tabs } from '@/components/ui/Tabs';
import { ReadingSettings } from './ReadingSettings';
import { TranslationSettings } from './TranslationSettings';
import { AudioSettings } from './AudioSettings';
import { AppearanceSettings } from './AppearanceSettings';

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Settings"
      description="Customize the reader on the fly."
      width="460px"
    >
      <Tabs
        items={[
          { id: 'reading', label: 'Reading', content: <ReadingSettings /> },
          { id: 'translation', label: 'Translation', content: <TranslationSettings /> },
          { id: 'audio', label: 'Audio', content: <AudioSettings /> },
          { id: 'appearance', label: 'Appearance', content: <AppearanceSettings /> },
        ]}
      />
    </Drawer>
  );
}
