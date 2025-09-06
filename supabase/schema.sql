-- Enable required extensions
create extension if not exists pgcrypto;

-- Videos table (minimal, ID as text so we can use route param directly)
create table if not exists public.videos (
  id text primary key,
  title text,
  topic text,
  created_at timestamptz not null default now()
);

-- Chat messages for live rooms
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  room text not null,
  user_id uuid,
  user_name text,
  message text not null,
  created_at timestamptz not null default now()
);

-- Video comments (archive detail)
create table if not exists public.video_comments (
  id uuid primary key default gen_random_uuid(),
  video_id text not null,
  user_id uuid,
  user_name text,
  comment text not null,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.chat_messages enable row level security;
alter table public.video_comments enable row level security;
alter table public.videos enable row level security;

-- Policies: read for all, write for authenticated
do $$ begin
  -- chat_messages
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='chat_messages' and policyname='Allow read chat') then
    create policy "Allow read chat" on public.chat_messages for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='chat_messages' and policyname='Allow write chat for auth') then
    create policy "Allow write chat for auth" on public.chat_messages for insert with check (auth.role() = 'authenticated');
  end if;

  -- video_comments
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='video_comments' and policyname='Allow read comments') then
    create policy "Allow read comments" on public.video_comments for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='video_comments' and policyname='Allow write comments for auth') then
    create policy "Allow write comments for auth" on public.video_comments for insert with check (auth.role() = 'authenticated');
  end if;

  -- videos
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='videos' and policyname='Allow read videos') then
    create policy "Allow read videos" on public.videos for select using (true);
  end if;
end $$;

-- Realtime
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.video_comments;


