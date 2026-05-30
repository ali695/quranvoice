-- QuranVoice — Learning Library tables.
-- Run this in the Supabase SQL editor after 0001_initial.sql.
--
-- Design:
--   - `learning_sources` is the source registry. Public can read; only admins write.
--   - `learning_items` are individual items (names, duas, stories, etc.) keyed by
--     slug + type. Public can read only `status='approved'` items. Admins write.
--   - `learning_item_sources` is a many-to-many join between items and sources.
--   - `saved_learning_items` is per-user (RLS: own rows only).
--   - `learning_progress` is per-user (RLS: own rows only).
--
-- All public read policies use `status='approved'` so unreviewed entries
-- never reach end users.

-- =========================================================================
-- learning_sources
-- =========================================================================
create table if not exists public.learning_sources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  source_type text not null check (source_type in (
    'quran', 'tafsir', 'hadith', 'seerah', 'scholarly_reference', 'manual_review'
  )),
  author text,
  url text,
  reference text,
  license_status text not null default 'unknown'
    check (license_status in ('verified_allowed', 'unknown', 'needs_permission')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_learning_sources_updated_at on public.learning_sources;
create trigger trg_learning_sources_updated_at before update on public.learning_sources
  for each row execute function public.set_updated_at();

alter table public.learning_sources enable row level security;

drop policy if exists "learning_sources read public" on public.learning_sources;
create policy "learning_sources read public" on public.learning_sources
  for select using (true);

drop policy if exists "learning_sources admin write" on public.learning_sources;
create policy "learning_sources admin write" on public.learning_sources
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- =========================================================================
-- learning_items
-- =========================================================================
create table if not exists public.learning_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  type text not null check (type in (
    'guide', 'name_of_allah', 'prophet_name', 'story', 'dua',
    'reflection', 'vocabulary', 'theme', 'tajweed', 'seerah', 'hadith'
  )),
  title text not null,
  title_arabic text,
  transliteration text,
  subtitle text,
  language text not null default 'en',
  level text check (level in ('beginner', 'intermediate', 'advanced')),
  source_status text not null default 'needs_source'
    check (source_status in ('verified', 'needs_source', 'review_pending', 'not_connected')),
  status text not null default 'pending'
    check (status in ('approved', 'pending', 'rejected')),
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  related_verse_keys text[] default '{}',
  related_surahs int[] default '{}',
  tags text[] default '{}',
  body text,
  body_html text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, type, language)
);

create index if not exists idx_learning_items_type_status on public.learning_items (type, status);
create index if not exists idx_learning_items_lang on public.learning_items (language);

drop trigger if exists trg_learning_items_updated_at on public.learning_items;
create trigger trg_learning_items_updated_at before update on public.learning_items
  for each row execute function public.set_updated_at();

alter table public.learning_items enable row level security;

drop policy if exists "learning_items read approved" on public.learning_items;
create policy "learning_items read approved" on public.learning_items
  for select using (
    status = 'approved'
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

drop policy if exists "learning_items admin write" on public.learning_items;
create policy "learning_items admin write" on public.learning_items
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- =========================================================================
-- learning_item_sources (m:n)
-- =========================================================================
create table if not exists public.learning_item_sources (
  item_id uuid not null references public.learning_items (id) on delete cascade,
  source_id uuid not null references public.learning_sources (id) on delete cascade,
  reference text,
  primary key (item_id, source_id)
);

alter table public.learning_item_sources enable row level security;

drop policy if exists "learning_item_sources read" on public.learning_item_sources;
create policy "learning_item_sources read" on public.learning_item_sources
  for select using (
    exists (
      select 1 from public.learning_items i
      where i.id = item_id
        and (i.status = 'approved'
             or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
    )
  );

drop policy if exists "learning_item_sources admin write" on public.learning_item_sources;
create policy "learning_item_sources admin write" on public.learning_item_sources
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- =========================================================================
-- saved_learning_items (per-user "save for later")
-- =========================================================================
create table if not exists public.saved_learning_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item_id uuid not null references public.learning_items (id) on delete cascade,
  saved_at timestamptz not null default now(),
  unique (user_id, item_id)
);

create index if not exists idx_saved_learning_user on public.saved_learning_items (user_id);

alter table public.saved_learning_items enable row level security;

drop policy if exists "saved_learning own" on public.saved_learning_items;
create policy "saved_learning own" on public.saved_learning_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================================
-- learning_progress (per-user per-item)
-- =========================================================================
create table if not exists public.learning_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  item_id uuid not null references public.learning_items (id) on delete cascade,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed')),
  last_studied_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create index if not exists idx_learning_progress_user on public.learning_progress (user_id, last_studied_at desc);

alter table public.learning_progress enable row level security;

drop policy if exists "learning_progress own" on public.learning_progress;
create policy "learning_progress own" on public.learning_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================================
-- Seed the editorial source so admins have a default to attach items to.
-- =========================================================================
insert into public.learning_sources (slug, title, source_type, license_status, notes)
values (
  'quranvoice-editorial',
  'QuranVoice editorial guide',
  'manual_review',
  'verified_allowed',
  'App orientation only — not a tafsir, not a fatwa.'
) on conflict (slug) do nothing;
