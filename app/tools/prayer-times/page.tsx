'use client';

import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PageHeader } from '@/components/ui/PageHeader';

interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
}

interface AladhanResponse {
  data?: {
    timings?: PrayerTimings;
    date?: { readable?: string; hijri?: { date?: string; weekday?: { en?: string } } };
    meta?: { timezone?: string };
  };
}

const PRAYERS: Array<[keyof PrayerTimings, string]> = [
  ['Fajr', 'Fajr'],
  ['Sunrise', 'Sunrise'],
  ['Dhuhr', 'Dhuhr'],
  ['Asr', 'Asr'],
  ['Maghrib', 'Maghrib'],
  ['Isha', 'Isha'],
];

const METHODS = [
  { value: '2', label: 'ISNA — North America' },
  { value: '3', label: 'Muslim World League' },
  { value: '4', label: 'Umm al-Qura, Makkah' },
  { value: '1', label: 'University of Karachi' },
  { value: '5', label: 'Egyptian General Authority' },
  { value: '7', label: 'Diyanet (Turkey)' },
];

function parseHHmm(today: Date, hhmm: string): Date | null {
  const m = hhmm.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const d = new Date(today);
  d.setHours(Number(m[1]), Number(m[2]), 0, 0);
  return d;
}

function fmtCountdown(ms: number) {
  if (ms < 0) return '00:00:00';
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function PrayerTimesPage() {
  const [method, setMethod] = useState('2');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  const [readableDate, setReadableDate] = useState<string>('');
  const [hijriDate, setHijriDate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!timings) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [timings]);

  const next = useMemo(() => {
    if (!timings) return null;
    const now = new Date();
    const candidates = PRAYERS.map(([k, label]) => ({ key: k, label, at: parseHHmm(now, timings[k]) }))
      .filter((c) => c.at && c.at.getTime() > now.getTime()) as Array<{ key: keyof PrayerTimings; label: string; at: Date }>;
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => a.at.getTime() - b.at.getTime());
    return candidates[0];
  }, [timings, tick]);

  async function loadByGeolocation() {
    setLoading(true);
    setError(null);
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not available in this browser.');
      setLoading(false);
      return;
    }
    try {
      await new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const today = new Date();
            const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
            const u = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&method=${method}`;
            try {
              const r = await fetch(u);
              const j = (await r.json()) as AladhanResponse;
              if (!j.data?.timings) throw new Error('No data');
              setTimings(j.data.timings);
              setReadableDate(j.data.date?.readable ?? '');
              setHijriDate(j.data.date?.hijri?.date ?? '');
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          () => reject(new Error('Permission denied')),
          { timeout: 10_000 },
        );
      });
    } catch {
      setError('Could not load prayer times. Try again or use city + country.');
    } finally {
      setLoading(false);
    }
  }

  async function loadByCity() {
    setLoading(true);
    setError(null);
    if (!city || !country) {
      setError('Enter both city and country.');
      setLoading(false);
      return;
    }
    try {
      const today = new Date();
      const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
      const u = `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;
      const r = await fetch(u);
      const j = (await r.json()) as AladhanResponse;
      if (!j.data?.timings) throw new Error('No data');
      setTimings(j.data.timings);
      setReadableDate(j.data.date?.readable ?? '');
      setHijriDate(j.data.date?.hijri?.date ?? '');
    } catch {
      setError('Could not resolve that location.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Worship"
        title="Prayer Times"
        description="Calculated times by Aladhan. Method selectable. Verify with your local masjid for community precision."
      />
      <AppShell>
        {/* Next prayer card */}
        <Card variant="feature" className="relative overflow-hidden p-6 md:p-8">
          <div className="absolute inset-0 pattern-ornament opacity-25" aria-hidden="true" />
          <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gold-400/80">
                Next prayer
              </div>
              {timings ? (
                next ? (
                  <>
                    <h2 className="mt-2 font-display text-3xl text-cream-50">
                      {next.label}{' '}
                      <span className="text-cream-200/55">at</span>{' '}
                      <span className="font-mono text-gold-200">{timings[next.key]}</span>
                    </h2>
                    <p className="mt-2 text-sm text-cream-200/65">
                      Starts in{' '}
                      <span className="font-mono text-cream-50">
                        {fmtCountdown(next.at.getTime() - Date.now())}
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="mt-2 font-display text-2xl text-cream-50">Isha has passed</h2>
                    <p className="mt-1 text-sm text-cream-200/65">Tomorrow&apos;s Fajr comes next — reload after midnight.</p>
                  </>
                )
              ) : (
                <p className="mt-2 text-sm text-cream-200/65">
                  Choose a location to start showing today&apos;s prayer schedule.
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 text-right text-xs text-cream-200/55">
              {readableDate && <p>{readableDate}</p>}
              {hijriDate && <p className="text-gold-300/80">{hijriDate} (Hijri)</p>}
            </div>
          </div>
        </Card>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Card variant="elevated" className="p-6">
            <div className="text-xs uppercase tracking-wider text-gold-400/80">Lookup</div>
            <p className="mt-1 text-sm text-cream-200/65">Use your location or a city.</p>
            <div className="mt-4 grid gap-3">
              <Select
                label="Calculation method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                options={METHODS}
              />
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={loadByGeolocation} disabled={loading}>
                  <Icon name="compass" size={14} />
                  {loading ? 'Loading…' : 'Use my location'}
                </Button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} placeholder="London" />
                <Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="United Kingdom" />
              </div>
              <Button size="sm" variant="secondary" onClick={loadByCity} disabled={loading}>
                Lookup by city
              </Button>
              {error && <p className="text-xs text-red-300">{error}</p>}
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <div className="text-xs uppercase tracking-wider text-gold-400/80">Today&apos;s timings</div>
            {!timings ? (
              <p className="mt-4 text-sm text-cream-200/65">No data yet. Use the lookup at left.</p>
            ) : (
              <ul className="mt-5 flex flex-col gap-2">
                {PRAYERS.map(([key, label]) => {
                  const isNext = next?.key === key;
                  return (
                    <li
                      key={key}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
                        isNext
                          ? 'border-gold-500/40 bg-gold-500/10 text-gold-100'
                          : 'border-ink-700/60 bg-ink-850/60 text-cream-100'
                      }`}
                    >
                      <span>{label}</span>
                      <span className="font-mono text-gold-300">{timings[key]}</span>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="mt-4 text-[11px] text-cream-200/55">
              Source: Aladhan API ·{' '}
              {METHODS.find((m) => m.value === method)?.label ?? 'Selected method'}.
            </p>
          </Card>
        </div>
      </AppShell>
    </>
  );
}
