'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';

const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

function toRad(d: number) { return (d * Math.PI) / 180; }
function toDeg(r: number) { return (r * 180) / Math.PI; }

function qiblaBearing(lat: number, lng: number): number {
  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA_LAT);
  const dLon = toRad(KAABA_LNG - lng);
  const y = Math.sin(dLon) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

type Permission = 'idle' | 'requesting' | 'granted' | 'denied';

export default function QiblaPage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number; label?: string } | null>(null);
  const [bearing, setBearing] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [perm, setPerm] = useState<Permission>('idle');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not available in this browser.');
      return;
    }
    setError(null);
    setPerm('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        setBearing(qiblaBearing(lat, lng));
        setDistance(haversineKm(lat, lng, KAABA_LAT, KAABA_LNG));
        setPerm('granted');
      },
      () => {
        setError('Location permission denied. You can grant it and try again, or enter a city.');
        setPerm('denied');
      },
      { timeout: 10_000 },
    );
  };

  const lookupByCity = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!city || !country) {
      setError('Enter both city and country.');
      return;
    }
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
      const json = (await res.json()) as Array<{ lat: string; lon: string; display_name?: string }>;
      const hit = json[0];
      if (!hit) {
        setError('No matching city found.');
        return;
      }
      const lat = Number(hit.lat);
      const lng = Number(hit.lon);
      setCoords({ lat, lng, label: hit.display_name });
      setBearing(qiblaBearing(lat, lng));
      setDistance(haversineKm(lat, lng, KAABA_LAT, KAABA_LNG));
    } catch {
      setError('Could not resolve that city.');
    }
  };

  useEffect(() => {
    function onOrient(e: DeviceOrientationEvent) {
      const alpha = e.alpha ?? null;
      if (alpha !== null) setHeading(alpha);
    }
    window.addEventListener('deviceorientationabsolute', onOrient as EventListener);
    window.addEventListener('deviceorientation', onOrient as EventListener);
    return () => {
      window.removeEventListener('deviceorientationabsolute', onOrient as EventListener);
      window.removeEventListener('deviceorientation', onOrient as EventListener);
    };
  }, []);

  const rotation = bearing != null ? bearing - (heading ?? 0) : 0;

  return (
    <>
      <QiblaHero />
      <AppShell>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Card variant="feature" className="relative overflow-hidden p-6 md:p-8">
            <div className="absolute inset-0 pattern-ornament opacity-25" aria-hidden="true" />
            <div className="relative">
              <div className="text-xs uppercase tracking-[0.2em] text-gold-400/80">Compass</div>
              <p className="mt-1 text-sm text-cream-200/65">
                Live needle rotates with your device&apos;s magnetometer when available.
              </p>
            </div>

            <div className="relative mt-8 flex items-center justify-center">
              <div className="relative h-72 w-72 rounded-full border border-gold-500/30 bg-gradient-radial from-ink-850 to-ink-900 shadow-gold-glow">
                {/* Ornament ring */}
                <div className="absolute inset-3 rounded-full border border-gold-500/15" aria-hidden="true" />
                <div className="absolute inset-6 rounded-full border border-gold-500/10" aria-hidden="true" />
                {/* Cardinal markers */}
                {['N', 'E', 'S', 'W'].map((d, i) => (
                  <span
                    key={d}
                    className="absolute left-1/2 top-1/2 text-xs font-medium text-cream-200/70"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(-110px) rotate(${-i * 90}deg)`,
                    }}
                  >
                    {d}
                  </span>
                ))}
                {/* Degree ticks */}
                {Array.from({ length: 36 }).map((_, i) => (
                  <span
                    key={i}
                    className="absolute left-1/2 top-1/2 h-2 w-px bg-cream-200/30"
                    style={{ transform: `translate(-50%, -50%) rotate(${i * 10}deg) translateY(-130px)` }}
                    aria-hidden="true"
                  />
                ))}
                {/* Qibla needle */}
                <div
                  className="absolute left-1/2 top-1/2 h-1.5 w-32 origin-left rounded-full bg-gradient-to-r from-gold-500 to-gold-200 shadow-[0_0_20px_-2px_rgba(212,165,116,0.6)] transition-transform duration-300"
                  style={{ transform: `translate(0, -50%) rotate(${rotation - 90}deg)` }}
                  aria-hidden="true"
                />
                {/* Kaaba marker at the needle tip */}
                <div
                  className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-gold-500 text-ink-950 transition-transform duration-300"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-110px) rotate(${-rotation}deg)`,
                  }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                    <path d="M3 8l9-5 9 5v2H3V8zm0 4h18v8H3v-8zm3 2v4h3v-4H6zm5 0v4h3v-4h-3zm5 0v4h2v-4h-2z" />
                  </svg>
                </div>
                {/* Center pip */}
                <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-200" />
              </div>
            </div>

            {!coords && (
              <Button className="relative mt-6 w-full" size="md" onClick={requestLocation}>
                <Icon name="compass" size={14} />
                {perm === 'requesting' ? 'Requesting location…' : 'Use my location'}
              </Button>
            )}
            {error && <p className="relative mt-3 text-xs text-red-300">{error}</p>}
            <p className="relative mt-4 text-[11px] leading-relaxed text-cream-200/55">
              Phone compasses can drift. For prayer, verify with a dedicated qibla device or a
              calibrated compass.
            </p>
          </Card>

          <div className="flex flex-col gap-5">
            <Card variant="elevated" className="p-6">
              <div className="text-xs uppercase tracking-wider text-gold-400/80">Bearing details</div>
              {coords ? (
                <dl className="mt-4 grid gap-3 text-sm">
                  <Row label="Your location">
                    {coords.label
                      ? coords.label.split(',').slice(0, 2).join(', ')
                      : `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`}
                  </Row>
                  <Row label="Qibla bearing">
                    <span className="font-mono text-gold-200">{bearing!.toFixed(1)}° from North</span>
                  </Row>
                  <Row label="Distance to Makkah">
                    <span className="font-mono text-cream-100">
                      {distance!.toLocaleString(undefined, { maximumFractionDigits: 0 })} km
                    </span>
                  </Row>
                  {heading != null && (
                    <Row label="Device heading">
                      <span className="font-mono text-cream-100">{heading.toFixed(0)}°</span>
                    </Row>
                  )}
                </dl>
              ) : (
                <p className="mt-3 text-sm text-cream-200/65">
                  Use your location or enter a city below to compute the bearing.
                </p>
              )}
            </Card>

            <Card variant="elevated" className="p-6">
              <div className="text-xs uppercase tracking-wider text-gold-400/80">Lookup by city</div>
              <form onSubmit={lookupByCity} className="mt-4 grid gap-3 sm:grid-cols-2">
                <Input
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="London"
                />
                <Input
                  label="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United Kingdom"
                />
                <div className="sm:col-span-2">
                  <Button type="submit" size="sm" variant="secondary">
                    Lookup
                  </Button>
                </div>
              </form>
              <p className="mt-3 text-[11px] text-cream-200/55">
                Geocoding by Nominatim (OpenStreetMap).
              </p>
            </Card>

            <Card variant="elevated" className="p-6">
              <div className="text-xs uppercase tracking-wider text-gold-400/80">About the calculation</div>
              <p className="mt-3 text-sm leading-relaxed text-cream-200/75">
                The bearing is the great-circle initial heading from your location toward the
                Kaaba at <span className="font-mono text-cream-100">21.4225° N, 39.8262° E</span>.
                Stand facing that bearing, then offset by your device heading if compass
                rotation isn&apos;t active.
              </p>
            </Card>
          </div>
        </div>
      </AppShell>
    </>
  );
}

function QiblaHero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-600/40">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-ink-850/70 via-ink-900 to-ink-900" />
        <div className="absolute inset-0 pattern-ornament opacity-25" />
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
      </div>
      <div className="container-page relative py-12 md:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gold-400">
              <span className="h-px w-6 bg-gold-500/60" />
              Worship tool
            </span>
            <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-cream-50 sm:text-4xl">
              Find the <span className="text-gradient-gold">Qibla</span> from anywhere
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-cream-200/70">
              QuranVoice computes a precise great-circle bearing to the Kaaba in Makkah from your
              location or a city you enter. The compass needle live-rotates when your device
              supports orientation sensors.
            </p>
          </div>
          <div className="relative mx-auto hidden h-40 w-40 items-center justify-center lg:flex">
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <linearGradient id="qhg" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="rgba(212,165,116,0.5)" />
                  <stop offset="1" stopColor="rgba(212,165,116,0.05)" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="none" stroke="url(#qhg)" strokeWidth="1" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="url(#qhg)" strokeWidth="1" />
              <circle cx="100" cy="100" r="40" fill="none" stroke="url(#qhg)" strokeWidth="1" />
              <path d="M100 30 L100 170 M30 100 L170 100" stroke="rgba(212,165,116,0.3)" />
              <path d="M50 50 L150 150 M150 50 L50 150" stroke="rgba(212,165,116,0.2)" />
            </svg>
            <div className="relative flex h-14 w-14 items-center justify-center rounded-lg bg-gold-500 text-ink-950">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M3 8l9-5 9 5v2H3V8zm0 4h18v8H3v-8zm3 2v4h3v-4H6zm5 0v4h3v-4h-3zm5 0v4h2v-4h-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-ink-700/40 pb-2 last:border-0 last:pb-0">
      <dt className="text-xs uppercase tracking-wider text-cream-200/55">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}
