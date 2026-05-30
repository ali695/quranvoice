'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { parseAyahReference } from '@/lib/utils/parseAyahReference';

export default function ShareAyahPage() {
  const [ref, setRef] = useState('');
  const [copied, setCopied] = useState(false);

  const parsed = parseAyahReference(ref);
  const url = parsed
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/quran/${parsed.surah}${parsed.ayah ? `/${parsed.ayah}` : ''}`
    : '';

  const onCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const onShare = async () => {
    if (!url) return;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ url, title: `Quran ${ref}` });
      } catch {
        /* user cancelled */
      }
    } else {
      onCopy();
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Tools"
        title="Share Ayah"
        description="Build a clean QuranVoice link to share any ayah."
      />
      <AppShell>
        <Card variant="elevated" className="p-6">
          <Input
            label="Verse reference"
            placeholder="2:255"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
          />
          {url && (
            <div className="mt-5 rounded-xl border border-ink-700/60 bg-ink-850/60 p-4">
              <p className="text-xs uppercase tracking-wider text-cream-200/45">Share link</p>
              <p className="mt-1 break-all font-mono text-sm text-cream-100">{url}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" onClick={onCopy}>
                  <Icon name={copied ? 'check' : 'feather'} size={14} />
                  {copied ? 'Copied' : 'Copy link'}
                </Button>
                <Button size="sm" variant="secondary" onClick={onShare}>
                  <Icon name="share" size={14} />
                  Share
                </Button>
                <Button size="sm" variant="outline" href={url || '#'}>
                  <Icon name="book" size={14} />
                  Open
                </Button>
              </div>
            </div>
          )}
        </Card>
      </AppShell>
    </>
  );
}
