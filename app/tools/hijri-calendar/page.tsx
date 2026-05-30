'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';

interface HijriResponse {
  data?: {
    hijri?: { date?: string; day?: string; month?: { en?: string; ar?: string }; year?: string; weekday?: { en?: string } };
    gregorian?: { date?: string };
  };
}

export default function HijriCalendarPage() {
  const [data, setData] = useState<HijriResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const today = new Date();
        const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
        const res = await fetch(`https://api.aladhan.com/v1/gToH/${dateStr}`);
        const json = (await res.json()) as HijriResponse;
        if (!cancelled) setData(json.data ?? null);
      } catch {
        if (!cancelled) setError('Could not load Hijri date.');
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Calendar"
        title="Hijri Calendar"
        description="Today’s Islamic date, converted from Gregorian via the Aladhan calendar API."
      />
      <AppShell>
        <Card variant="feature" className="overflow-hidden p-8 text-center">
          <Icon name="crescent" size={36} className="mx-auto text-gold-300" />
          {data?.hijri ? (
            <>
              <h2 className="mt-4 font-display text-4xl text-cream-50">
                {data.hijri.day} {data.hijri.month?.en} {data.hijri.year} AH
              </h2>
              <p className="mt-1 text-sm text-cream-200/65">{data.hijri.weekday?.en}</p>
              <p className="mt-3 arabic text-2xl text-gold-200" dir="rtl" lang="ar">
                {data.hijri.month?.ar}
              </p>
              <p className="mt-6 text-xs text-cream-200/45">
                Gregorian: {data.gregorian?.date}
              </p>
            </>
          ) : error ? (
            <p className="mt-4 text-sm text-red-300">{error}</p>
          ) : (
            <p className="mt-4 text-sm text-cream-200/65">Loading…</p>
          )}
          <p className="mt-6 text-[11px] text-cream-200/55">
            Source: Aladhan calendar API. For ritual observance, verify with local moon-sighting
            authorities.
          </p>
        </Card>
      </AppShell>
    </>
  );
}
