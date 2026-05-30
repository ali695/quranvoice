# QuranVoice — local setup

These are the only steps you need to get the app fully working locally with
real Quran.Foundation content + Supabase user data.

> **Security:** never paste real credentials into chat, into commits, or into
> any source file. They go into `.env.local` (gitignored) on your machine only.
> If a secret has been seen by anyone other than you, **rotate it** in the
> Quran.Foundation developer console / Supabase dashboard before continuing.

---

## 1. Stop the dev server

If `npm run dev` is already running, **stop it with `Ctrl+C`**. Next.js does
not pick up new env values without a fresh start.

## 2. Create `.env.local`

In the project root (`C:/Users/user/Downloads/Quran/.env.local`), create the
file with **exactly** the content below. Replace each `PASTE_…_HERE` token
with the real value. Do **not** wrap values in quotes.

```dotenv
# Quran.Foundation Content API (server-side only)
QURAN_FOUNDATION_CLIENT_ID=PASTE_CLIENT_ID_HERE
QURAN_FOUNDATION_CLIENT_SECRET=PASTE_CLIENT_SECRET_HERE
QURAN_FOUNDATION_OAUTH_URL=https://oauth2.quran.foundation
QURAN_FOUNDATION_API_BASE_URL=https://apis.quran.foundation

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=PASTE_SUPABASE_PROJECT_URL_HERE
NEXT_PUBLIC_SUPABASE_ANON_KEY=PASTE_SUPABASE_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=PASTE_SUPABASE_SERVICE_ROLE_KEY_HERE
```

### Where each value comes from

| Variable | Where to get it |
| --- | --- |
| `QURAN_FOUNDATION_CLIENT_ID` | Quran.Foundation developer console → your app |
| `QURAN_FOUNDATION_CLIENT_SECRET` | Same console (you may need to *Reveal* / regenerate) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page → `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page → `service_role` `secret` key (NEVER share) |

> **Don’t use `NEXT_PUBLIC_` for `QURAN_FOUNDATION_CLIENT_SECRET` or
> `SUPABASE_SERVICE_ROLE_KEY`.** Anything `NEXT_PUBLIC_*` is sent to the
> browser bundle and visible to everyone.

## 3. Apply the Supabase schema

In your Supabase project → **SQL Editor**, run the contents of:

```
supabase/migrations/0001_initial.sql
```

This creates the tables (`profiles`, `user_settings`, `bookmarks`,
`collections`, `notes`, `reading_progress`, `reading_activity`,
`memorization_items`, `reading_goals`, plus the Shan-e-Nuzool review tables)
and sets up Row-Level Security so users only see their own rows.

## 4. (Optional) Configure Google sign-in

If you want Google login on `/auth/sign-in`:

1. In Google Cloud Console, create an OAuth 2.0 client (web application).
2. Add redirect URI:
   `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
3. In Supabase → **Authentication → Providers → Google**, enable it and
   paste the Google Client ID + Secret.
4. Add `http://localhost:3000` to **Site URL** and to
   **Redirect URLs** (Supabase Auth settings).

Magic-link login works out of the box once Supabase is connected — no Google
setup needed.

## 5. Start the dev server

```bash
npm run dev
```

## 6. Verify everything

Open `http://localhost:3000/developers/api-test`. You should see all green
checks:

- `QURAN_FOUNDATION_CLIENT_ID present`
- `QURAN_FOUNDATION_CLIENT_SECRET present`
- `Quran.Foundation OAuth token` — cached (expires in ~60 min)
- `Foundation /chapters` — 114 chapters
- `Foundation verse 2:255` — Uthmani text returned
- `Foundation translations`, `tafsirs`, `recitations`, `languages` — counts
- `Foundation search scope` — *enabled* if your client has the search scope
  approved; *not granted* otherwise (this is fine; search falls back to the
  open AlQuran Cloud full-text search)
- `Supabase connection` — `OK · 0 profiles` (or more if you’ve signed up)
- `Shan-e-Nuzool review table` — `0 approved / 0 pending`
- `Archive.org metadata fetch` — `AyaatQuraniKayShanENuzool`

Then test:

- `http://localhost:3000/quran/2/255` — full Ayat al-Kursi with translation
- `http://localhost:3000/sources` — live source disclosure with counts
- `http://localhost:3000/tools/qibla` — premium compass tool
- `http://localhost:3000/auth/sign-in` — magic-link login

---

## Troubleshooting

### “Quran.Foundation OAuth token: not configured or auth failed”

- Re-check the `.env.local` values — no quotes, no trailing spaces, no
  `NEXT_PUBLIC_` prefixes on the private vars.
- Re-check that the Client ID/Secret pair is from the **same** app in the
  Foundation console and is set to **Production (Live)**.
- Re-start `npm run dev` — Next.js caches env values per process.

### “Supabase connection: not configured”

- Are all three Supabase env vars present in `.env.local`?
- Did you restart `npm run dev` after adding them?
- Open the Supabase dashboard → API page and confirm the keys match.

### Hydration warning with `bis_skin_checked` / `bis_register` in the diff

This is caused by the **Bitdefender Anti-Tracker / TrafficLight** browser
extension (or similar — Grammarly, 1Password, AdBlock can also do it). It
injects attributes into your DOM after the server HTML is delivered, before
React hydrates. We already mark `<body>` with `suppressHydrationWarning`, so
the warning is silenced for the most common case. To eliminate it entirely
in dev, disable the extension on `localhost`. In production builds, React
silently uses the server HTML, so this warning never reaches users.
