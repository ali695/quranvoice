-- QuranVoice — initial schema and RLS.
--
-- Run this in the Supabase SQL editor (or via the Supabase CLI) after
-- creating your project. All tables enforce row-level security so users
-- can only access their own rows; service role bypasses RLS for the
-- admin import/review workflows used by Shan-e-Nuzool.
--
-- The `auth.users` table is provided by Supabase.

-- =========================================================================
-- helper: updated_at trigger
-- =========================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================================
-- profiles — 1:1 with auth.users
-- =========================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles upsert own" on public.profiles;
create policy "profiles upsert own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row whenever a user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists trg_auth_user_created on auth.users;
create trigger trg_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- user_settings
-- =========================================================================
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_user_settings_updated_at on public.user_settings;
create trigger trg_user_settings_updated_at before update on public.user_settings
  for each row execute function public.set_updated_at();

alter table public.user_settings enable row level security;

drop policy if exists "user_settings select own" on public.user_settings;
create policy "user_settings select own" on public.user_settings
  for select using (auth.uid() = user_id);

drop policy if exists "user_settings insert own" on public.user_settings;
create policy "user_settings insert own" on public.user_settings
  for insert with check (auth.uid() = user_id);

drop policy if exists "user_settings update own" on public.user_settings;
create policy "user_settings update own" on public.user_settings
  for update using (auth.uid() = user_id);

-- =========================================================================
-- collections (folders for bookmarks)
-- =========================================================================
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_collections_user on public.collections (user_id);

drop trigger if exists trg_collections_updated_at on public.collections;
create trigger trg_collections_updated_at before update on public.collections
  for each row execute function public.set_updated_at();

alter table public.collections enable row level security;
drop policy if exists "collections own" on public.collections;
create policy "collections own" on public.collections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================================
-- bookmarks
-- =========================================================================
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  surah smallint not null check (surah between 1 and 114),
  ayah smallint not null check (ayah >= 1),
  verse_key text not null,
  collection_id uuid references public.collections (id) on delete set null,
  tags text[] default '{}',
  note text,
  created_at timestamptz not null default now()
);
create unique index if not exists uq_bookmarks_user_verse on public.bookmarks (user_id, surah, ayah);
create index if not exists idx_bookmarks_user on public.bookmarks (user_id);
create index if not exists idx_bookmarks_collection on public.bookmarks (collection_id);

alter table public.bookmarks enable row level security;
drop policy if exists "bookmarks own" on public.bookmarks;
create policy "bookmarks own" on public.bookmarks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================================
-- notes
-- =========================================================================
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  surah smallint not null check (surah between 1 and 114),
  ayah smallint not null check (ayah >= 1),
  verse_key text not null,
  text text not null check (length(text) <= 4000),
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists uq_notes_user_verse on public.notes (user_id, surah, ayah);
create index if not exists idx_notes_user on public.notes (user_id);

drop trigger if exists trg_notes_updated_at on public.notes;
create trigger trg_notes_updated_at before update on public.notes
  for each row execute function public.set_updated_at();

alter table public.notes enable row level security;
drop policy if exists "notes own" on public.notes;
create policy "notes own" on public.notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================================
-- reading_progress (current position + history)
-- =========================================================================
create table if not exists public.reading_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  surah smallint not null check (surah between 1 and 114),
  ayah smallint not null check (ayah >= 1),
  verse_key text not null,
  percent numeric(5,2) not null default 0,
  last_read_at timestamptz not null default now()
);

alter table public.reading_progress enable row level security;
drop policy if exists "reading_progress own" on public.reading_progress;
create policy "reading_progress own" on public.reading_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Long-form history kept compactly for streak/activity-day calculations.
create table if not exists public.reading_activity (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  occurred_on date not null,
  ayahs_read int not null default 0,
  pages_read int not null default 0,
  minutes_read int not null default 0,
  unique (user_id, occurred_on)
);
create index if not exists idx_reading_activity_user_date on public.reading_activity (user_id, occurred_on desc);
alter table public.reading_activity enable row level security;
drop policy if exists "reading_activity own" on public.reading_activity;
create policy "reading_activity own" on public.reading_activity
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================================
-- memorization_items
-- =========================================================================
create table if not exists public.memorization_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  surah smallint not null check (surah between 1 and 114),
  ayah smallint not null check (ayah >= 1),
  verse_key text not null,
  mastery numeric(3,2) not null default 0 check (mastery between 0 and 1),
  review_count int not null default 0,
  next_review_at timestamptz not null default now(),
  added_at timestamptz not null default now()
);
create unique index if not exists uq_memorization_user_verse on public.memorization_items (user_id, surah, ayah);
create index if not exists idx_memorization_due on public.memorization_items (user_id, next_review_at);

alter table public.memorization_items enable row level security;
drop policy if exists "memorization own" on public.memorization_items;
create policy "memorization own" on public.memorization_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================================
-- reading_goals
-- =========================================================================
create table if not exists public.reading_goals (
  user_id uuid primary key references auth.users (id) on delete cascade,
  goal_type text not null check (goal_type in ('ayahs','pages','minutes')),
  target int not null check (target between 1 and 1000),
  started_at timestamptz not null default now()
);

alter table public.reading_goals enable row level security;
drop policy if exists "reading_goals own" on public.reading_goals;
create policy "reading_goals own" on public.reading_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================================
-- Shan-e-Nuzool source review workflow
-- =========================================================================
create table if not exists public.shan_e_nuzool_sources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  author text,
  language text default 'ur',
  archive_identifier text,
  archive_url text,
  source_type text default 'classical',
  license_status text not null default 'open_source_claim',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.shan_e_nuzool_entries (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.shan_e_nuzool_sources (id) on delete cascade,
  -- Primary ayah this entry is attached to.
  surah smallint not null check (surah between 1 and 114),
  ayah smallint not null check (ayah >= 1),
  verse_key text not null,
  language text not null default 'ur',
  title text,
  body text not null,
  page_reference text,
  authenticity_status text default 'unknown'
    check (authenticity_status in ('sahih','hasan','weak','unknown','multiple_reports')),
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_shan_entry_verse on public.shan_e_nuzool_entries (surah, ayah, status);

drop trigger if exists trg_shan_entry_updated_at on public.shan_e_nuzool_entries;
create trigger trg_shan_entry_updated_at before update on public.shan_e_nuzool_entries
  for each row execute function public.set_updated_at();

-- Optional secondary ayahs covered by the same entry (for ranges).
create table if not exists public.shan_e_nuzool_entry_ranges (
  id bigserial primary key,
  entry_id uuid not null references public.shan_e_nuzool_entries (id) on delete cascade,
  surah smallint not null check (surah between 1 and 114),
  start_ayah smallint not null check (start_ayah >= 1),
  end_ayah smallint not null check (end_ayah >= start_ayah)
);
create index if not exists idx_shan_range_entry on public.shan_e_nuzool_entry_ranges (entry_id);
create index if not exists idx_shan_range_lookup on public.shan_e_nuzool_entry_ranges (surah, start_ayah, end_ayah);

alter table public.shan_e_nuzool_sources enable row level security;
alter table public.shan_e_nuzool_entries enable row level security;
alter table public.shan_e_nuzool_entry_ranges enable row level security;

-- Anyone (including anon) can SELECT approved sources and entries.
drop policy if exists "shan sources select public" on public.shan_e_nuzool_sources;
create policy "shan sources select public" on public.shan_e_nuzool_sources
  for select using (true);

drop policy if exists "shan entries select approved" on public.shan_e_nuzool_entries;
create policy "shan entries select approved" on public.shan_e_nuzool_entries
  for select using (status = 'approved' or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.is_admin
  ));

drop policy if exists "shan ranges select" on public.shan_e_nuzool_entry_ranges;
create policy "shan ranges select" on public.shan_e_nuzool_entry_ranges
  for select using (
    exists (
      select 1 from public.shan_e_nuzool_entries e
      where e.id = entry_id
        and (e.status = 'approved' or exists (
          select 1 from public.profiles p where p.id = auth.uid() and p.is_admin
        ))
    )
  );

-- Only admins can mutate the source workflow tables.
drop policy if exists "shan sources admin write" on public.shan_e_nuzool_sources;
create policy "shan sources admin write" on public.shan_e_nuzool_sources
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

drop policy if exists "shan entries admin write" on public.shan_e_nuzool_entries;
create policy "shan entries admin write" on public.shan_e_nuzool_entries
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

drop policy if exists "shan ranges admin write" on public.shan_e_nuzool_entry_ranges;
create policy "shan ranges admin write" on public.shan_e_nuzool_entry_ranges
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- Seed the Archive.org Shan-e-Nuzool reference source (unreviewed entries
-- stay private — public users only see entries with status='approved').
insert into public.shan_e_nuzool_sources (slug, title, author, language, archive_identifier, archive_url, source_type, license_status)
values (
  'ayaat-qurani-kay-shan-e-nuzool',
  'Ayaat Qurani Kay Shan E Nuzool',
  'Allama Abul Hasan Ali Al Nishapuri',
  'ur',
  'AyaatQuraniKayShanENuzool',
  'https://archive.org/details/AyaatQuraniKayShanENuzool',
  'classical',
  'open_source_claim'
)
on conflict (slug) do nothing;
