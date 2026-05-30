# QuranVoice

A premium Quran web app — read, listen, study, memorize. Built with Next.js, TypeScript, Tailwind, Quran.Foundation Content API, and Supabase.

![next.js](https://img.shields.io/badge/Next.js-16-black) ![typescript](https://img.shields.io/badge/TypeScript-strict-3178c6) ![tailwind](https://img.shields.io/badge/Tailwind-3.4-38b2ac) ![supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ecf8e)

## Brand pillars

| | |
| --- | --- |
| 📖 **QuranVoice Reader** | Premium reading experience, Uthmani script, multiple Mushaf styles |
| 🔊 **QuranVoice Audio** | Verified reciters, ayah-level audio when available, mini player |
| 🧠 **QuranVoice Memorize** | Spaced-repetition review queue with audio loop and repeat controls |
| ✍️ **QuranVoice Study** | Tafsir, translation comparison, word-by-word, source-verified Asbab al-Nuzul |
| 📅 **QuranVoice Daily** | Ayah of the Day, Quran in a Year plan, reading streak, goals |

## Content authenticity

QuranVoice never fakes religious content. Every translation, tafsir, recitation, and Asbab al-Nuzul entry comes from a registered source with attribution. When a verified source is not connected, the UI shows an explicit "Content not available yet" state.

- ✅ Verified Uthmani text from the Quran.Foundation Content API
- ✅ Translations and tafsir served with source labels
- ✅ Shan-e-Nuzool review workflow (no auto-imported OCR text)
- ❌ No AI-generated religious commentary, ever
- ❌ No fake reciter photos (geometric initials only)
- ❌ No invented Tajweed coloring or Mushaf line breaks

See [`/sources`](app/sources/page.tsx) for the in-app source disclosure.

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS** with a premium dark + gold design system
- **Quran.Foundation Content API** (OAuth2 client_credentials, server-only)
- **Supabase** (Auth + Postgres + RLS)
- Provider-abstracted user data — Supabase today, ready for Quran.Foundation user scopes when approved

## Quick start

See [`SETUP.md`](SETUP.md) for the full setup including env vars and the Supabase migration.

```bash
npm install
cp .env.example .env.local      # then paste your real keys into .env.local
npm run dev
```

Open `http://localhost:3000`.

Verify your wiring at `http://localhost:3000/developers/api-test` (dev only).

## Project structure

```
app/                         # Next.js App Router pages and route handlers
  api/quran/                 # Server proxy routes for the Foundation API
  api/shan-e-nuzool/         # Reviewed Shan-e-Nuzool entries
  api/archive/               # Archive.org metadata for the reference source
  api/user/                  # Reserved for account sync
  auth/                      # Sign-in, sign-up, OAuth callback
  developers/api-test/       # Dev-only diagnostics page
  sources/                   # Source disclosure pages
  ...                        # Reader, study, tools, learn, profile, settings
components/
  layout/                    # Header, Footer, AppShell, Sidebar, MobileNav
  ui/                        # Button, Card, Modal, Drawer, Tabs, etc.
  quran/                     # SurahHeader, AyahCard, QuranReader, ...
  audio/                     # AudioPlayerProvider, MiniAudioPlayer, AudioPlayer
  study/                     # BookmarkButton, NotesPanel, MemorizationControls
  settings/                  # ReadingSettings, AudioSettings, ...
  home/                      # Homepage sections
lib/
  quran-foundation/          # OAuth + endpoint client (server-only)
  supabase/                  # Browser, server, admin clients + auth helpers
  services/                  # Quran, translation, tafsir, audio, search, ...
  services/user-feature-provider.ts  # Adapter: local (guest) or Supabase
  data/                      # Static catalogs (surahs, juz, navigation)
  types/                     # Domain types (quran, audio, translation, ...)
supabase/migrations/         # SQL schema with full RLS
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project** → import the GitHub repo.
3. Framework preset: **Next.js**. Build & install commands default-detected.
4. Add the same environment variables from your `.env.local` in **Settings → Environment Variables**. (Do **not** wrap secrets with `NEXT_PUBLIC_*` unless they are meant to be public.)
5. Deploy.
6. After the first deploy, set `NEXT_PUBLIC_APP_URL` to your production URL (`https://your-domain.vercel.app`) and redeploy so `sitemap.xml`, Open Graph, and Supabase auth redirects use the right origin.

## License

Application code: © QuranVoice. UI is unique to this project — please don't copy without permission.

Religious content (Quran text, translations, tafsir, recitations) belongs to the respective sources listed inside the app at [`/sources`](app/sources/page.tsx) and is served under each source's own license.
