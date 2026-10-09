-- Hyderabad Locals schema
-- Run this once in the Supabase project's SQL editor.
-- Auth model: anonymous sign-in (supabase.auth.signInAnonymously), every
-- auth.users row gets a matching profiles row with just a display name.

create extension if not exists "pgcrypto";

create table places (
  id text primary key,
  name text not null,
  lat double precision not null,
  lng double precision not null
);

insert into places (id, name, lat, lng) values
  ('golconda', 'Golconda Fort', 17.3833, 78.4011),
  ('charminar', 'Charminar', 17.3616, 78.4747),
  ('medak', 'Medak Fort', 18.0460, 78.2630),
  ('rachakonda', 'Rachakonda Fort', 17.3270, 78.9480),
  ('hussainsagar', 'Hussain Sagar', 17.4239, 78.4738)
on conflict (id) do nothing;

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  lat double precision,
  lng double precision,
  is_seed boolean not null default false,
  created_at timestamptz not null default now()
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  place_id text not null references places(id),
  post_type text not null check (post_type in ('question', 'trip_report', 'like', 'unexpected', 'unsafe')),
  title text not null,
  body text not null,
  is_seed boolean not null default false,
  created_at timestamptz not null default now()
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  is_seed boolean not null default false,
  created_at timestamptz not null default now()
);

create table message_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references profiles(id) on delete cascade,
  recipient_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  unique (sender_id, recipient_id)
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references message_requests(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index posts_place_idx on posts (place_id);
create index comments_post_idx on comments (post_id);
create index message_requests_recipient_idx on message_requests (recipient_id);
create index messages_request_idx on messages (request_id);

-- Row Level Security --------------------------------------------------

alter table profiles enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table message_requests enable row level security;
alter table messages enable row level security;

-- profiles: anyone signed in can read all profiles (display name + rough
-- location only, nothing sensitive); you can only write your own row.
create policy "profiles_select_all" on profiles for select using (true);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- posts/comments: world-readable, writable only as yourself.
create policy "posts_select_all" on posts for select using (true);
create policy "posts_insert_own" on posts for insert with check (auth.uid() = author_id);

create policy "comments_select_all" on comments for select using (true);
create policy "comments_insert_own" on comments for insert with check (auth.uid() = author_id);

-- message_requests: only the two parties involved can see a request.
-- Anyone can create a request as themselves; only the recipient can
-- flip it to accepted/declined.
create policy "requests_select_own" on message_requests for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "requests_insert_own" on message_requests for insert
  with check (auth.uid() = sender_id);
create policy "requests_update_recipient" on message_requests for update
  using (auth.uid() = recipient_id);

-- messages: only visible to the two parties on the parent request, and
-- only insertable once that request has been accepted.
create policy "messages_select_parties" on messages for select
  using (
    exists (
      select 1 from message_requests r
      where r.id = messages.request_id
        and (r.sender_id = auth.uid() or r.recipient_id = auth.uid())
    )
  );
create policy "messages_insert_if_accepted" on messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from message_requests r
      where r.id = messages.request_id
        and r.status = 'accepted'
        and (r.sender_id = auth.uid() or r.recipient_id = auth.uid())
    )
  );
